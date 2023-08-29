import frappe

FIELDS_MAP = {
    "Sales Order" : ["customer" , "transaction_date" , "delivery_date" , "items" , "order_type"],
    "Sales Order Item" : ["item_code" ,"item_name", "qty" , "rate"],
    "Customer" : ["customer_name" , "customer_type" , "customer_group" , "territory"],
    "Item" : ["item_code" , "item_name","item_group" , "stock_uom" , "standard_rate"]
} 

def get_doctype_json(doctype_name,additional_fields=[],additional_child_table_fields={},return_only_data_sample=0):
    try:
        doctype = frappe.get_doc("DocType", doctype_name)
        parent_fields = []
        parent_data_sample = {}
        children = {}
        child_data_sample = {}
        
        # only minimal/neccessary parent fields
        parent_doc_fields = FIELDS_MAP[doctype_name] or [] 

        for field in doctype.fields:
            # if field.reqd == 1 or field.fieldname in additional_fields:
            if field.fieldname in parent_doc_fields or field.fieldname in additional_fields:
                parent_fields.append(create_field_dict(field))
                parent_data_sample[field.fieldname] = ""
            # if field.fieldtype == "Table" and (field.reqd == 1 or field.fieldname in additional_fields) :
            if field.fieldtype == "Table" and (field.fieldname in parent_doc_fields or field.fieldname in additional_fields) :
                child_doctype = frappe.get_doc("DocType", field.options) 
                child_fields = []
                add_ct_fields = []
                
                #get additional filed for current ct
                if field.fieldname in additional_child_table_fields.keys():
                    add_ct_fields = additional_child_table_fields.get(field.fieldname)

                # only minimal/neccessary child fields
                child_doc_fields = FIELDS_MAP[field.options] or []     
                    
                for child_field in child_doctype.fields:
                    # if child_field.reqd == 1 or child_field.fieldname in add_ct_fields:
                    if child_field.fieldname in child_doc_fields or child_field.fieldname in add_ct_fields:
                        child_fields.append(create_field_dict(child_field))
                        
                        if not field.fieldname in child_data_sample.keys():
                            child_data_sample[field.fieldname] = {}
                        child_data_sample[field.fieldname][child_field.fieldname] = ""

                children[field.fieldname] = child_fields

        modified_child_data = convert_dict(child_data_sample)
     
        final_data_dict = {**parent_data_sample, **modified_child_data}
        if return_only_data_sample:
            return final_data_dict
        else:
            return {
                "parent_fields":parent_fields,
                "children":children,
                "values":final_data_dict
            }
        
    
        
    except Exception as e:
        print("Error while fetching doctype json")
        frappe.log_error(title="Error while fetching doctype json")
        return "Something went wrong. please check error log."


def convert_dict(input_dict):
    output_dict = {}
    
    for key, value in input_dict.items():
        if isinstance(value, dict):
            output_dict[key] = [value]
        else:
            output_dict[key] = value

    return output_dict


def create_field_dict(field):
    return {
        "label": field.label,
        "fieldname": field.fieldname,
        "fieldtype": field.fieldtype,
        "reqd": field.reqd,
        "options": field.options
    }