import frappe
from erpnext_copilot.chat_bot_apis.item_query import get_chatbot_response as sales_person_bot_response
from erpnext_copilot.chat_bot_apis.employee_query import get_chatbot_response as employee_response



@frappe.whitelist()
def get_response_as_per_role(session_id: str, prompt_message: str) -> str:
    roles = frappe.get_roles(frappe.session.user)
    if "Sales Person ChatBot" in roles:
        response = sales_person_bot_response(session_id,prompt_message)
    else:
        response = employee_response(session_id,prompt_message)
    return response

@frappe.whitelist()
def get_all_names_for_doctype(doctype):
    try:
        query = f"SELECT name as label, name as value FROM `tab{doctype}`"
        doc_names = frappe.db.sql(query, as_dict=True)
        return doc_names
    except Exception as e:
        print(f"Error: {e}")
        return []
 
@frappe.whitelist()   
def get_names_by_field_value(doctype, field_name, field_value):
    try:
        query = f"SELECT name as label, name as value FROM `tab{doctype}` WHERE {field_name} = %s"
        doc_names = frappe.db.sql(query, (field_value,), as_dict=True)
        return doc_names
    except Exception as e:
        print(f"Error: {e}")
        return []   
    
@frappe.whitelist()
def submit_form(form_values):
    try:
        doc = frappe.get_doc(form_values)
        doc.insert(ignore_permissions = 1)
        frappe.db.commit()
    except Exception as e:
        print(f"Error: {e}")
        frappe.log_error(frappe.get_traceback(), "Form Creation")
        return {}    

@frappe.whitelist()
def get_link_field_data(doctype):
    # data = frappe.db.sql("""
    #             SELECT name as value, name as label FROM `%(doctype)s`
    #         """,{
    #             "doctype" : "tab{}".format(doctype)
    #         })
    
    return [
        {
            "value" : "Raj",
            "label" : "Raj"
        },
        {
            "value" : "Parth",
            "label" : "Parth"
        },
        {
            "value" : "Shivam",
            "label" : "Shivam"
        },
        {
            "value" : "Thakor",
            "label" : "Thakor"
        },
        {
            "value" : "Ravi",
            "label" : "Ravi"
        },
    ]