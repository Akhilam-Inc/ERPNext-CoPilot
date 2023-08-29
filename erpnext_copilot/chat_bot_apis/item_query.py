from langchain.agents import initialize_agent, Tool, AgentType
from langchain.chat_models import ChatOpenAI
from langchain.memory import ConversationBufferMemory,RedisChatMessageHistory
from langchain.prompts import MessagesPlaceholder
from langchain.schema import SystemMessage
import frappe

OpenAI_api_key = frappe.conf.get("openai_api_key")

class ItemQuery:

    def __init__(self,session_id):
        self.agent_kwargs = {
            "extra_prompt_messages": [MessagesPlaceholder(variable_name="chat_history")],
            "system_message": 
            SystemMessage(content="""
            You are a friendly product inquiry bot. Your main task is to help user to provide stock and price related query.Below are the details of 2 type of inquiries
            1)Stock Inquiry : In this inquiry you will provide the information about the stock available in warehouse. To perform this action you will need 2 details from user.<item_code> and <warehouse>. If user does not provide information of warehouse take `all` as a input and if he provides details about warehouse then use that warehouse value as a input parameter.
                     
            2)Price Inquiry : In this inquiry you will provide the information about the price of product. To perform this action you will need 2 details from user.<item_code> and <price_list>. If user does not provide information of price list then take `default` as a input. and if he provides details about price list then use that price list value as a input parameter.
            
            
            Ensure you have all necessary information required for the selected function, and adhere strictly to the function's guidelines. Proper execution depends on this level of detail and accuracy.

            Caution : You have to execute function for each request, Do not hallucinate anything from previous results.     
            """)           
            
        }

        # Initialize a language learning model (LLM) using the ChatOpenAI model with the OpenAI API key and specific
        # parameters
        message_history = RedisChatMessageHistory(
            session_id=session_id,
            url=frappe.conf.get("redis_cache") or "redis://localhost:6379/0",     
              
            )
        self.memory = ConversationBufferMemory(
            memory_key="chat_history",
            return_messages=True,
            chat_memory = message_history,
        )

        self.llm = ChatOpenAI(
            openai_api_key=OpenAI_api_key,
            temperature=0.0,
            model_name='gpt-4'
        )

        # Define a list of tools for the agent. Here, we only have "CreateSalesOrder","CreateSalesVisit","CheckStockAvailibility" tool that
        self.tools = [
            Tool(
                name="GetStockDetails",
                func=self.get_stock_details,
                description = """
                Description: The 'GetStockDetails' function to get details of stock from inventory. Here's what you 
                need:

                1. A SINGLE STRING in the format: ```Item Code, Warehouse```.

                An example function input for an order might look like: ```Apple, Mumbai``` 
                It is important to remember that the input should be formatted as a single string, not a list or multiple strings.

                A word of caution: if any information is unclear, incomplete, or not confirmed, the function might 
                not work correctly.
               
                """
            ),
            Tool(
                name="GetPriceDetails",
                func=self.get_price_details,
                description = """
                Description: The 'GetPriceDetails' function to get details of stock from inventory. Here's what you 
                need:

                1. A SINGLE STRING in the format: ```Item Code, Price List```.

                An example function input for an order might look like: ```Apple, Retail``` 
                It is important to remember that the input should be formatted as a single string, not a list or multiple strings.

                A word of caution: if any information is unclear, incomplete, or not confirmed, the function might 
                not work correctly.
               
                """
            )
        ]
        self.agent = self.initialize_agent()

    def initialize_agent(self):
        # Initialize the agent with the tools, language learning model, and other settings defined above
        agent = initialize_agent(
            tools=self.tools,
            llm=self.llm,
            agent=AgentType.OPENAI_FUNCTIONS,
            verbose=True,
            memory=self.memory,
            agent_kwargs=self.agent_kwargs,
            max_iterations=10,
            early_stopping_method='generate', )
        return agent
    
    def get_stock_details(self,stock_inquiry_string):
        stock_inquiry = stock_inquiry_string.split(",")
        item,warehouse = stock_inquiry[0].strip(),stock_inquiry[1].strip()
        item_validation = validate_entity("Item",item)
        if item_validation['status']:
            item_code = item_validation['result']
        else:
            return item_validation['result']
        
        if warehouse == "all":
            stock_qty_raw = frappe.db.sql("""select sum(actual_qty) as total_qty from `tabBin` where item_code = %s group by item_code""",(item_code),as_dict=1)
            if len(stock_qty_raw) > 0:
                stock_qty = stock_qty_raw[0]['total_qty']
            else:
                stock_qty = 0
        else:        
            warehouse_validation = validate_entity("Warehouse",warehouse)
            if warehouse_validation['status']:
                warehouse_code = warehouse_validation['result']
            else:
                return warehouse_validation['result']
            
            stock_qty = frappe.db.get_value('Bin', {'item_code': item_code, 'warehouse': warehouse_code}, 'actual_qty')

        return "Stock of {item} in {warehouse} is {stock_value}".format(item=item,warehouse=warehouse,stock_value=stock_qty)
        

    def get_price_details(self,price_inquiry_string):
        stock_inquiry = price_inquiry_string.split(",")
        item,price_list = stock_inquiry[0].strip(),stock_inquiry[1].strip()
        item_validation = validate_entity("Item",item)
        if item_validation['status']:
            item_code = item_validation['result']
        else:
            return item_validation['result']
        
        if not price_list == "default":
            price_list_validation = validate_entity("Price List",price_list)
            if price_list_validation['status']:
                price_list_code = price_list_validation['result']
            else:
                return price_list_validation['result']
        else:
            price_list_code = "Standard Selling"
        
        item_price = frappe.db.get_value('Item Price', {'item_code': item_code, 'price_list': price_list_code,'selling':1}, 'price_list_rate')
        print(item_price)

        return "Price of {item} for {price_list} is {price} INR".format(item=item,price_list=price_list,price=item_price)

    
    # def parse_sales_order(self,order_string):
    #     response = create_sales_order(order_string)
    #     self.memory.clear
    #     return response
    
    # def create_sales_visit(self,visit_string):
    #     # John,14:00,16:00,Gave demo of newly launched products
    #     response = parse_sales_visit(visit_string)
    #     self.memory.clear()
    #     return response
    
    # def check_stock(self,stock_string):
    #     response = get_stock_value(stock_string)
    #     self.memory.clear()
    #     return response

    def run(self, userinput):
        return self.agent.run(userinput)

# def parse_sales_visit(sales_visit_string):
#     sales_visit_details = sales_visit_string.split(",")

#     if len(sales_visit_details) < 4:
#         return "Invalid Request. Your request must contain ```show the required parameter for this request```. You can pass your request in this format ```Show the format of string```."
#     sales_person,from_time,to_time,visit_purpose = sales_visit_details[0],sales_visit_details[1],sales_visit_details[2],sales_visit_details[3]

#     try:
#         sales_visit_doc = frappe.new_doc('Sales Visit Custom')
#         sales_visit_doc.sales_person = sales_person
#         sales_visit_doc.from_time = from_time
#         sales_visit_doc.to_time = to_time
#         sales_visit_doc.visit_purpose = visit_purpose        
#         sales_visit_doc = sales_visit_doc.insert(ignore_permissions=True)
#         frappe.db.commit()

#         sales_visit_link = get_link_to_form("Sales Visit Custom",sales_visit_doc.name)
        
#         return f"Sales Visit {sales_visit_link} created successfully!"
    

#     except Exception as e:
        
#         frappe.log_error(title="order creation error from bot",message=frappe.get_traceback())
#         return "Error occured while creating order in backend,check error log for more information."



# def create_sales_order(order_string):
#         order_list = order_string.split(",")
#         customer_name = order_list[0].strip()
#         # Check if the name is "user" or blank
#         if customer_name.lower() == "user":
#             return "Invalid customer name. The name cannot be 'user'."
#         elif customer_name == "":
#             return "Invalid customer name. The name cannot be blank."
#         elif customer_name == "Customer":
#             return "Invalid customer name. The name cannot be blank."
        
#         if not frappe.db.exists("Customer",customer_name):
#             create_customer(customer_name)

#         # Check if there are items beyond the customer's name
#         if len(order_list) < 2:
#             return "Invalid order. The order must contain at least one product."
#         # Loop over the items in the list, split the product and quantity, and add them to the order dictionary
#         items = []
#         for item in order_list[1:]:
#             try:
#                 product, quantity = item.split(':')
#                 product,quantity = product.strip(),float(quantity.strip())
#                 # Check if the product or quantity is blank
#                 if product == "":
#                     return "Invalid product name. The product name cannot be blank."
#                 elif quantity == "":
#                     return "Invalid quantity. The quantity cannot be blank."
#                 items.append({
#                     "item_code":product,
#                     "qty":quantity
#                 })
#             except ValueError:
#                 return "Not able to find required information from your input, For better response provide information in ```provide example provided in description```."
        
#         for item in items:
#             item_validation = validate_item(item['item_code'])
#             # print("item validation : {}".format(item_validation))
#             if item_validation != 1:
#                 return item_validation
            
#         try:
            
#             order_doc = frappe.new_doc('Sales Order')
#             order_doc.customer = customer_name
#             order_doc.transaction_date = frappe.utils.today()
#             order_doc.delivery_date = frappe.utils.today()
#             order_doc.due_date = frappe.utils.today()
#             for item in items:
#                 order_doc.append('items',{
#                     'item_code':item['item_code'],
#                     'qty':item['qty']
#                 })
#             order = order_doc.insert(ignore_permissions=True)
#             frappe.db.commit()
#             order_link = get_link_to_form("Sales Order",order.name)
           
#             return f"Sales order {order_link} created successfully!"
        

#         except Exception as e:
#             frappe.log_error(title="order creation error from bot",message=frappe.get_traceback())
#             return "Error occured while creating order in backend,check error log for more information."


# def get_stock_value(stock_check_string):
#     stock_check_details = stock_check_string.split(",")
#     # Check if there are items beyond the customer's name
#     if len(stock_check_details) < 2:
#         return "Invalid Request. The query need to have item and warehouse for request."
#     item_name = stock_check_details[0].strip()
#     warehouse_name = stock_check_details[1].strip()

#     # Check if item_name is empty or invalid
#     if not item_name or item_name.lower() == 'item':
#         return "Invalid Item Name"

#     # Check if warehouse_name is empty or invalid
#     if not warehouse_name or warehouse_name.lower() == 'warehouse':
#         return "Invalid Warehouse Name"

#     # Check if the item exists in the system
#     item_validation = validate_item(item_name)
#     if item_validation != 1:
#         return item_validation

#     # Check if the warehouse exists in the system
#     warehouse_validation = validate_warehouse(warehouse_name)
#     if warehouse_validation != 1:
#         return warehouse_validation

#     # Item and warehouse exist, proceed to check stock
#     stock_qty = frappe.db.get_value('Bin', {'item_code': item_name, 'warehouse': warehouse_name}, 'actual_qty')

#     if stock_qty is not None and stock_qty > 0:
#         return "Stock available for Item: {0} is {1} Quantity".format(item_name, stock_qty)
#     else:
#         return "Stock Not Available for Item: {0} in Warehouse: {1}".format(item_name, warehouse_name)

def validate_warehouse(warehouse_name):
    
    warehouses = frappe.db.sql("""
    select name from `tabWarehouse` where name like %s
    """,(warehouse_name),as_dict=1)
    if len(warehouses) == 1:
        return {
            "status":1,
            "result":warehouses[0]['name']
        }
    elif len(warehouses) > 1:
        return {
            "status":0,
            "result":"""I found multiple warehouses with this name.Please select any of these.
        ```{list_of_warehouse}```.
        Provide name of this warehouses and ask to choose any option from it. once user select the option, replace that warehouse by selected option
        """.format(list_of_warehouse=warehouses)
        }            
        
    elif len(warehouses) == 0:
        warehouses = frappe.db.sql("""
        select name from `tabWarehouse` 
        """,as_dict=1)
        return {
            "status":0,
            "result":"""I cant find warehouses with this name.Please select any of these.
        ```{list_of_warehouse}```.
        Provide name of this warehouses and ask to choose any option from it. once user select the option, replace that warehouse by selected option
        """.format(list_of_warehouse=warehouses)
        }
        

def validate_entity(doctype,entity_name):

    like_entity = frappe.db.get_list(doctype,
    filters={
        'name': ['like','%'+entity_name+'%']
    },
    fields=['name']
    )

    
    # like_entity = frappe.db.sql("""
    # select name from `tab{doctype}` where name like %s
    # """.format(doctype=doctype),(entity_name),as_dict=1)
    if len(like_entity) == 1:
        return {
            "status":1,
            "result":like_entity[0]['name']
        }
    elif len(like_entity) > 1:
        return {
            "status":0,
            "result":"""I found multiple {doctype} with this name.Please select any of these.
        ```{list_of_entity}```.
        Provide name of this {doctype} and ask to choose any option from it. once user select the option, replace that {doctype} by selected option
        """.format(doctype=doctype,list_of_entity=like_entity)
        }            
        
    elif len(like_entity) == 0:
        all_entity = frappe.db.sql("""
        select name from `tab{doctype}`
        """.format(doctype=doctype),as_dict=1)
        return {
            "status":0,
            "result":"""I cant find {doctype} with this name.Please select any of these.
        ```{list_of_entity}```.
        Provide name of this {doctype} and ask to choose any option from it. once user select the option, replace that {doctype} by selected option
        """.format(doctype=doctype,list_of_entity=all_entity)
        }

def validate_item(item):
    
    if not frappe.db.exists("Item",item):
        similar_items = frappe.db.sql("""
        select name from `tabItem` where name like %s and is_stock_item = 1
        """,(item),as_dict=1)
        if len(similar_items)>0:
            return """We are unable to find the item {item} in system. You can choose other similar items like {similar_items}.
            Show similar items to replace the invalid item. If user selects any other option then replace it with the selected items.
            """.format(item=item,similar_items=similar_items)
        else:
            other_items = frappe.db.sql("""
            select name from `tabItem` where is_stock_item = 1
            """,as_dict=1)
            if len(other_items)>0:
                return """We are unable to find the item {item} in system. You can choose other items like {other_items}.
                Show similar items to replace the invalid item. If user selects any other option then replace it with the selected items.
                """.format(item=item,other_items=other_items)
            else:
                return "Not able to find this item in our database"
    else:
        return 1

@frappe.whitelist()
def get_chatbot_response(session_id: str, prompt_message: str) -> str:
    bot = ItemQuery(session_id)    
    user_input = prompt_message
    if not user_input:
        return 'No input provided'
    return bot.run(user_input)

def run_bot():
    while True:
        userinput = input("Input:")
        get_chatbot_response("223",userinput)


