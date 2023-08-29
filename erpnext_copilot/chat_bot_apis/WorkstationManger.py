from langchain.agents import initialize_agent, Tool, AgentType
from langchain.chat_models import ChatOpenAI
from langchain.memory import ConversationBufferMemory,RedisChatMessageHistory
from langchain.prompts import MessagesPlaceholder
from langchain.schema import SystemMessage
from frappe.utils import get_url_to_form
import frappe

#imported api keys from site config
OpenAI_api_key = frappe.conf.get("openai_api_key")

# class defination of worksationbot
class WorkStationManagerBot:
    def __init__(self,session_id):
        self.agent_kwargs = {
            "extra_prompt_messages": [MessagesPlaceholder(variable_name="chat_history")],
            "system_message": 
           SystemMessage(content="""
            You are a friendly Workstation Manager assistant bot. You will help workstation manager to perform his daily tasks. Main Tasks of Workstation Manager manager is to add stock in the warehouse,create job card of workers and create invoice of the customers.I am explaining each task in details below.
            1)Add Stock in the warehouse:Warehouse manger basically need to create stock entry voucher when they receive any new item. To create this stock entry voucher they have to input Warehouse name, Item name, Quantity of Item and Value of Item. It means to perform ```AddInventory``` action, required parameters are <warehouse name>,<item name>,<item quantity> and <item rate>.
            Ask user to provide information in this format : ```Warehouse Name, Item1:Qty1:rate1, Item2:Qty2:rate1 . . .```
            If any of this information is missing then you have to ask followup question to ask this information. Once all informations are gathered confirm the collected information from workstation manager and then perform necessary action.
            2)Create Job card of workers : In workstation there are many workers are working. Workstation managers duty is to manage their work and keep track or their work.To record their work workstation manager need to create Job card for them. To create job card required information is worker name, the list of work he did. It means to perform ```CreateJobCard``` action, required parameters are <worker name> and <Job Name>.If any of this information is missing then you have to ask followup question to ask this information. Once all informations are gathered confirm the collected information from workstation manager and then perform necessary action.
            3)Create Invoice for the customer: Workstation need to create Sales invoice for the customer for the service they have provided.This tasks required customer name for whom the is creating invoice, list of services they have provided and qty of the service. Usually quantity of service remains one but if quantity is provided then need to take provided quantity.It means to perform ```CreateSalesInvoice``` action, required parameters are <customer name>,<list of services>,<quantity of services>(This is optional, you can take by default 1).If any of this information is missing then you have to ask followup question to ask this information. Once all informations are gathered confirm the collected information from workstation manager and then perform necessary action.
            The Execution flow will be as below:
            -First you will provide list of tasks workstation manager can perform using this chatbot
            -workstation manager will choose the option
            -workstation manager will give the neccesary information for any task
            -if the information is not sufficient then get the necessary information by asking followup questions
            -if the information is necessary then ask for the confirmation from the sales person whether the information is correct or not?
            -if sales person confirms by saying yes then invoke the related function by providing input format required by each function.            
            Ensure you have all necessary information required for the selected function, and adhere strictly to the function's guidelines. Proper execution depends on this level of detail and accuracy.
            """)              
        }

        #initiate memory from redis cache based on sessions, memory will only stay for one session
        message_history = RedisChatMessageHistory(
            session_id=session_id,
            url=frappe.conf.get("redis_cache") or "redis://localhost:6379/0",              
            )
        
        #initialed memory object
        self.memory = ConversationBufferMemory(
            memory_key="chat_history",
            return_messages=True,
            chat_memory = message_history,
        )

        self.llm = ChatOpenAI(
            openai_api_key=OpenAI_api_key,
            temperature=0.0,
            model_name='gpt-3.5-turbo-0613'
        )
        # Define a list of tools for the agent. Here, we only have 3 tool, which is the "AddInventory","CreateJobCard","CreateSalesInvoice"
        # uses the 'create_stock_entry','create_job_card','create_sales_invoice' function respectively defined below.
        self.tools = [
            Tool(
                name="AddInventory",
                func=self.create_stock_entry,
                description = """
                Description: The 'AddInventory' function to help a workstation manager to create a stock entry. Here's what you 
                need:

                1. A SINGLE STRING in the format: ```Warehouse Name, item name1:item quantity1:rate1, item name2:item quantity2:rate2```.

                An example function input for an order might look like: ```Surat Alpha, Gear:5:100.00, Break:5:150.50, Nutt Bolts Set:1:200``` 
                It is important to remember that the input should be formatted as a single string, not a list or multiple strings.

                Make sure to gather all this information and confirm the order details with the sales person before using this 
                function. 
                A word of caution: if any information is unclear, incomplete, or not confirmed, the function might 
                not work correctly.
               
                """
            ),
            Tool(
                name="CreateJobCard",
                func=self.create_job_card,
                description = """
                Description: The 'CreateJobCard' function to help workstation manager to create job card of workers. Here's what you 
                need:

                1. A SINGLE STRING in the format: ```Worker Name, Job he performed```

                An example function input for an order might look like: ```Jimmy, Car Wash```. It is 
                important to remember that the input should be formatted as a single string, not a list or multiple strings.
                The most important thing to remember is user need to input all three inputs, then only this function can be executed.
                If you dont have enough information dont run this function.
                A word of caution: if any information is unclear, incomplete, or not confirmed, the function might 
                not work correctly.
               
                """
            ),
            Tool(
                name="CreateSalesInvoice",
                func=self.create_sales_invoice,
                description = """
                Description: The 'CreateSalesInvoice' function to helps workstation manager to create sales invoice of customer. Here's what you 
                need:

                1. A SINGLE STRING in the format: ```Customer Name, Service Name1:Quantity1,Service Name2:Quantity2```.

                An example function input for an order might look like: ```Raaj Tailor, Car Wash:1,Break Service:4```. It is 
                important to remember that the input should be formatted as a single string, not a list or multiple strings.
                The most important thing to remember is user need to input all three inputs, then only this function can be executed.
                If you dont have enough information dont run this function.
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
   

    
    def create_stock_entry(self,stock_entry_string):
        response  = parse_stock_entry(stock_entry_string)
        self.memory.clear()
        return response
    
    def create_job_card(self,job_card_string):
        response = parse_job_card(job_card_string)
        self.memory.clear()
        return response
    
    def create_sales_invoice(self,sales_invoice_string):  
        response = parse_invoice(sales_invoice_string)    
        self.memory.clear()  
        return response

    def run(self, userinput):
        return self.agent.run(userinput)


def parse_invoice(invoice_string):
    invoice_list = invoice_string.split(",")
    customer_name = invoice_list[0].strip()
    # Check if the name is "user" or blank
    if customer_name.lower() == "user":
        return "Invalid customer name. The name cannot be 'user'."
    elif customer_name == "":
        return "Invalid customer name. The name cannot be blank."
    elif customer_name == "Customer":
        return "Invalid customer name. The name cannot be blank."
    
    if not frappe.db.exists("Customer",customer_name):
        create_customer(customer_name)

    # Check if there are items beyond the customer's name
    if len(invoice_list) < 2:
        return "Invalid invoice. The invoice must contain at least one product."
    # Loop over the items in the list, split the product and quantity, and add them to the invoice dictionary
    items = []
    for item in invoice_list[1:]:
        try:
            product, quantity = item.split(':')
            product,quantity = product.strip(),float(quantity.strip())
            # Check if the product or quantity is blank
            if product == "":
                return "Invalid product name. The product name cannot be blank."
            elif quantity == "":
                return "Invalid quantity. The quantity cannot be blank."
            items.append({
                "item_code":product,
                "qty":quantity
            })
        except ValueError:
            return "Not able to find required information from your input, For better response provide information in ```provide example provided in description```."
    
    for item in items:
        item_validation = validate_item(item['item_code'])
        # print("item validation : {}".format(item_validation))
        if item_validation != 1:
            return item_validation
        
    try:
        
        invoice_doc = frappe.new_doc('Sales Invoice')
        invoice_doc.customer = customer_name
        invoice_doc.posting_date = frappe.utils.today()
        invoice_doc.due_date = frappe.utils.today()
        for item in items:
            invoice_doc.append('items',{
                'item_code':item['item_code'],
                'qty':item['qty']
            })
        invoice = invoice_doc.insert(ignore_permissions=True)
        frappe.db.commit()
        invoice_link = get_link_to_form("Sales Invoice",invoice.name)
       
        return f"Sales Invoice {invoice_link} created successfully!"
        

    except Exception as e:
        
        frappe.log_error(title="Invoice creation error from bot",message=frappe.get_traceback())
        return "Error occured while creating invoice in backend,check error log for more information."


def create_customer(customer_name):
    try:        
        customer_doc = frappe.get_doc({
            "doctype":"Customer",
            "customer_name":customer_name,
            "customer_type":"Individual",
            "territory":"All Territories",
            "customer_group":"Commercial"
        })
        customer_doc.insert(ignore_permissions=1)
    except Exception as e:
        
        frappe.log_error(title="Customer creation error from bot",message=frappe.get_traceback())
        return "Error occured while creating customer in backend for new invoice,check error log for more information."


def parse_stock_entry(stock_string):
    # Split the order string into a list
    # print("Stock String {}".format(stock_string))
    stock_list = stock_string.split(",")
    warehouse_name = stock_list[0].strip()
    # print("Warehouse name {}".format(warehouse_name))
    # Check if the warehouse exists
    warehouse_validation = validate_warehouse(warehouse_name)
    if warehouse_validation != 1:
        return warehouse_validation
    
    # Check if there are items beyond the customer's name
    if len(stock_list) < 2:
        # print("input validation")
        return "Invalid stock_entry. The stock_entry must contain at least one product. With their quantity and rate"
    
    
    # Loop over the items in the list, split the product and quantity, and add them to the stock_entry dictionary
    
    items = []
    for item in stock_list[1:]:
       
        try:
            product, quantity, rate = item.split(':')
            product,quantity,rate = product.strip(),float(quantity.strip()),float(rate.strip())
            
            # Check if the product or quantity is blank
            if product == "":
                return "Invalid product name. The product name cannot be blank."
            elif quantity == 0:
                return "Invalid quantity. The quantity cannot be 0."
            elif rate == 0:
                return "Invalid rate. The rate cannot be 0."
            
            items.append({
                "item_code":product,
                "qty":quantity,
                "basic_rate":rate,
                "t_warehouse":warehouse_name
            })

        except ValueError:
            # print("value error")
            return "Invalid stock_entry format. Please use 'Name, Product: Quantity' format as given in tool description"
    
    for item in items:
        item_validation = validate_item(item['item_code'])
        # print("item validation : {}".format(item_validation))
        if item_validation != 1:
            return item_validation

    try:
        stock_entry = frappe.get_doc({
            "doctype":"Stock Entry",
            "stock_entry_type":"Material Receipt",
            "posting_date":frappe.utils.today(),
            "items":items
        }).insert(ignore_permissions=True)
        frappe.db.commit()
        stock_link = get_link_to_form("Stock Entry",stock_entry.name)
        return "Stock Entry {stock_link} created successfully!".format(stock_link=stock_link)
    

    except Exception as e:
        frappe.log_error(title="Stock creation error from bot",message=frappe.get_traceback())
        return "Error occured while creating stock entry in backend,check error log for more information."

def validate_warehouse(warehouse_name):
    if not frappe.db.exists("Warehouse",warehouse_name):
        list_of_warehouses = frappe.db.sql("""
        select name from `tabWarehouse` 
        """,as_dict=1)
        return """This Warehouse not exists in system please select any of below warehouses.
        ```{list_of_warehouse}```.
        Provide name of this warehouses and ask to choose any option from it. once user select the option, replace that warehouse by selected option
        """.format(list_of_warehouse=list_of_warehouses)
    else:
        return 1

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


def parse_job_card(job_card_string):
    # Split the order string into a list
    job_card_details = job_card_string.split(",")
    # Check if there are items beyond the customer's name
    if len(job_card_details) < 2:
        return "Invalid Job Card Details. The Job Card must contain worker name and Job Details."
    worker_name = job_card_details[0].strip()
    job_details = job_card_details[1].strip()
    
    
    try:
        if job_card_details:
            job_card = frappe.new_doc('Job Card Custom')
            job_card.worker_name = worker_name
            job_card.job_done = job_details
            job_card_entry = job_card.insert(ignore_permissions=True)
            frappe.db.commit()
            job_card_link = get_link_to_form("Job Card Custom",job_card_entry.name)
            return "Job Card {job_card_link} created successfully!".format(job_card_link=job_card_link)
    except Exception as e:
        frappe.log_error(title="Job Card creation error from bot",message=frappe.get_traceback())
        return "Error occured while creating job card in backend,check error log for more information."


@frappe.whitelist()
def get_chatbot_response(session_id: str, prompt_message: str) -> str:
    bot = WorkStationManagerBot(session_id)    
    user_input = prompt_message
    if not user_input:
        return 'No input provided'
    return bot.run(user_input)

def get_link_to_form(doctype: str, name: str, label: str | None = None) -> str:
	if not label:
		label = name

	return f"""<a href="{get_url_to_form(doctype, name)}" target="_blank">{label}</a>"""

