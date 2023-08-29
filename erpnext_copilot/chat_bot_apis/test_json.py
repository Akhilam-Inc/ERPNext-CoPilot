import frappe

@frappe.whitelist()
def get_chatbot_response(session_id: str, prompt_message: str):
    if prompt_message.lower() == "create customer":
        data_structure = [
            {
            "field_name": "Customer",
            "field_key": "customer",
            "field_type": "Data",
        },
        {
            "field_name": "Customer Group",
            "field_key": "customer_group",
            "field_type": "Select",
            "options": ["Individual", "Commercial"]
        },
        {
            "field_name": "Customer Email",
            "field_key": "customer_email",
            "field_type": "Data",
        },
        {
            "field_name": "Customer Mobile",
            "field_key": "customer_mobile",
            "field_type": "Data",
        }
        ]
        data = {
            "customer":"Raaj",
            "customer_group":"Individual",
            "customer_email":"raaj@akhilaminc.com",
            "customer_mobile":"+918141336872"
        }

        return{
            "message":data_structure,
            "data":{},
            "type" : "form"
        }
    
    elif prompt_message.lower() == "create sales order":
        data_structure = [
        {
            "field_name": "Customer",
            "field_key": "customer",
            "field_type": "Data",
        },
        {
            "field_name": "Delivery Date",
            "field_key": "delivery_date",
            "field_type": "Date",
        },
        {
            "field_name": "Maintain Stock",
            "field_key": "maintain_stock",
            "field_type": "Check",
        },
        {
            "field_name": "Order Type",
            "field_key": "order_type",
            "field_type": "Select",
            "options": ["Sales", "Maintenance", "Shopping Cart"]
        },
        {
            "field_name": "Narration",
            "field_key": "narration",
            "field_type": "TextArea",
        },
        {
            "field_name": "Items",
            "field_key": "items",
            "field_type": "Table",
            "options": [],
            "values": [

            ]
        }]

        return{
            "message":data_structure,
            "data":{},
            "type" : "form"
        }
    
    elif prompt_message.lower() == "get sales orders":
        return {
            "message": [
                {
                    "name": "SAL-ORD-2023-00016",
                    "customer": "Vivek",
                    "transaction_date": "2023-08-01",
                    "grand_total": 6062.0,
                    "status": "To Deliver",
                },
                {
                    "name": "SAL-ORD-2023-00015",
                    "customer": "Shivam",
                    "transaction_date": "2023-08-01",
                    "grand_total": 13580.0,
                    "status": "To Deliver",
                },
                {
                    "name": "SAL-ORD-2023-00014",
                    "customer": "Raj",
                    "transaction_date": "2023-08-01",
                    "grand_total": 3000.0,
                    "status": "To Deliver",
                },
                {
                    "name": "SAL-ORD-2023-00013",
                    "customer": "Parth",
                    "transaction_date": "2023-08-01",
                    "grand_total": 6500.0,
                    "status": "To Deliver",
                },
                {
                    "name": "SAL-ORD-2023-00012",
                    "customer": "Aditya",
                    "transaction_date": "2023-08-01",
                    "grand_total": 4344.0,
                    "status": "To Deliver",
                },
                {
                    "name": "SAL-ORD-2023-00011",
                    "customer": "Parth",
                    "transaction_date": "2023-07-28",
                    "grand_total": 190200.0,
                },
                {
                    "name": "SAL-ORD-2023-00010",
                    "customer": "Vivek",
                    "transaction_date": "2023-07-17",
                    "grand_total": 2000.0,
                    "status": "To Deliver and Bill",
                },
                {
                    "name": "SAL-ORD-2023-00009",
                    "customer": "Vivek",
                    "transaction_date": "2023-07-17",
                    "grand_total": 6000.0,
                    "status": "To Deliver",
                },
                {
                    "name": "SAL-ORD-2023-00008",
                    "customer": "Shivam",
                    "transaction_date": "2023-07-17",
                    "grand_total": 3000.0,
                    "status": "To Deliver and Bill"
                }],
            "type": "table",
        }
    
    return {
        "message" : "Invalid Input",
        "type" : "text"
    }