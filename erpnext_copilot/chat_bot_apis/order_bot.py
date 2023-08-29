import os
import openai
import json
import frappe
from erpnext_copilot.chat_bot_apis.get_doctype_json import get_doctype_json
# from dotenv import load_dotenv, find_dotenv
# _ = load_dotenv(find_dotenv()) # read local .env file


# openai.api_type = "azure"
# openai.api_base = "https://akhilam-chatpdf.openai.azure.com/"
# openai.api_version = "2022-12-01"
# openai.api_key = os.getenv("AZURE_OPENAI_KEY")

openai.api_key  = frappe.conf.get("openai_api_key")

list_of_jsons = [
    {
        "action":"Create Sales Order",
        "doctype":"Sales Order",
        "customer":"[name_of_customer]",
        "delivery_date":"[delivery_date_of_sales_order]",
        "items":[
            {
                "item_code":"[code_of_item]",
                "item_name":"[name_of_item]",
                "qty":"[qty_of_item]"
            },
            {
                "item_code":"[code_of_item]",
                "item_name":"[name_of_item]",
                "qty":"[qty_of_item]"
            }
        ]
    }
]




def get_completion_from_messages(messages, 
                                 model="gpt-4", 
                                 temperature=0, 
                                 max_tokens=500):
    response = openai.ChatCompletion.create(
        model=model,
        messages=messages,
        temperature=temperature,
        max_tokens=max_tokens,
    )
    return response.choices[0].message["content"]




def get_task_category(user_input):
    delimiter = "####"
    system_message = f"""
    You will be provided with sales, purchase and stock operation related tasks. \
    These tasks will be delimited with \
    {delimiter} characters.
    Classify each task into a below category. \
    Provide your output in json format with the \
    two keys primary and secondary.

    Primary Task Categories: Get,Create.\
    Below are the defination of each Primary Task. \
    
    Create : Any query related to create new records \
    Get : Any query related to get records from system \
    
    Secondary Task will be dependend on primary category.

    Secondary Tasks in case of 'Create':\
    Customer, Item, Sales Order, Sales Invoice, Purchase Order, Purchase Invoice, Quotation, Purchase Receipt, Delivery Note, Stock Entry.

    Note : Request of stock addition and deduction will both be in same category Stock Entry.

    Secondary Task in case of 'Get':
    Item Details, Quotation Details, Purchase Order Details, Sales Order Details, Customer Details

    If there is no matching category then return NA.

    """
    user_message = user_input
    messages =  [  
    {'role':'system', 
    'content': system_message},    
    {'role':'user', 
    'content': f"{delimiter}{user_message}{delimiter}"},  
    ]
    response = get_completion_from_messages(messages)
    return response 

def extract_json_by_action(list_of_jsons, action_name):
    return next((json_obj for json_obj in list_of_jsons if json_obj.get("action") == action_name), None)

def fill_input_in_json(user_input,json_object):
    delimiter = "####"
    system_message = f"""
    You will be provided with json object and user input. \
    The raw user input will be delimited with \
    {delimiter} characters.
    Follow below json object format and fill the input provided by user in raw format. \n
    {str(json_object)}

    If you can not find the input from input then keep it blank with "".
    provide output in json stringify format
    """
    user_message = user_input
    messages =  [  
    {'role':'system', 
    'content': system_message},    
    {'role':'user', 
    'content': f"{delimiter}{user_message}{delimiter}"},  
    ]
    response = get_completion_from_messages(messages)
    return response

def get_data_from_syestem(user_input,json_object):
    delimiter = "####"
    system_message = f"""
    You will be provided with user query and json object of table. \
    You have to write SQL Query to get desire data.
    The raw user input will be delimited with \
    {delimiter} characters.
    Follow below json object format and write the sql query. \n
    {str(json_object)}

    If you can not find the required parameter in table then reply 'insufficient information' "".
    provide output in json format
    """
    user_message = user_input
    messages =  [  
    {'role':'system', 
    'content': system_message},    
    {'role':'user', 
    'content': f"{delimiter}{user_message}{delimiter}"},  
    ]
    print(messages)
    response = get_completion_from_messages(messages)
    return response

@frappe.whitelist()
def complete_task(input_message):
    response = get_task_category(input_message)
    response = json.loads(response)
    if  response["primary"] == "NA" or response["secondary"] == "NA":
        res =  "Not valid query"
    if response["primary"] == "Create":
        doctype = response["secondary"]
    
    
        json_object = get_doctype_json(doctype)
        
        
        if json_object:
            res = fill_input_in_json(input_message,json_object["values"])
            json_object["values"] = res

    
        result = {
            "json_data":json_object,
            "doctype":doctype,
            "type":response["primary"]
        }
    # if response["primary"] == "Get":
    #     print("here")
    #     task = response["secondary"]
    #     if task == "Item Details":
    #         print("here")
            

    return result
    # print(result)

# print(get_completion_from_messages("hi"))
def run_bot():
    while True:
        userinput = input("Input:")
        complete_task(userinput)

