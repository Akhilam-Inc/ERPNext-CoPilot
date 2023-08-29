import frappe


@frappe.whitelist()
def save_docs(args):
    pass

additional_fields = ["project", "po_no"]
additional_child_table_fields = {
	"Sales Order Item": ["weight_per_unit"]
}

# def get_doctype_structure(doctype_name,return_data_json = 0, additional_fields=[], additional_child_table_fields={}):
#     doctype = frappe.get_doc("DocType", doctype_name)
#     parent_fields = []
#     children = {}
    

#     for field in doctype.fields:
#         if field.reqd == 1 or field.fieldname in additional_fields:
#             parent_field = {
#                 "label": field.label,
#                 "fieldname": field.fieldname,
#                 "fieldtype": field.fieldtype,
#                 "reqd": field.reqd,
#                 "options": field.options
#             }
#             parent_fields.append(parent_field)
           

#     for field in doctype.fields:
#         if field.fieldtype == "Table" and field.reqd == 1:
#             child_doctype = frappe.get_doc("DocType", field.options)
#             child_fields = []
#             child_doctype_name = field.options
#             for child_field in child_doctype.fields:
#                 if child_field.reqd == 1:
#                     ch_field = {
#                         "label": child_field.label,
#                         "fieldname": child_field.fieldname,
#                         "fieldtype": child_field.fieldtype,
#                         "reqd": child_field.reqd,
#                         "options": child_field.options
#                     }
#                     child_fields.append(ch_field)

#                     if child_doctype_name in additional_child_table_fields:
#                         if child_field.fieldname in additional_child_table_fields[child_doctype_name]:
#                             ch_additional_field = {
#                                 "label": child_field.label,
#                                 "fieldname": child_field.fieldname,
#                                 "fieldtype": child_field.fieldtype,
#                                 "reqd": child_field.reqd,
#                                 "options": child_field.options
#                             }
#                             child_fields.append(ch_additional_field)

#             children[child_doctype.name] = child_fields

#     json_structure = {
#         "parent": parent_fields,
#         "children": children
#     }

#     return json_structure

def create_field_dict(field):
    return {
        "label": field.label,
        "fieldname": field.fieldname,
        "fieldtype": field.fieldtype,
        "reqd": field.reqd,
        "options": field.options
    }

def get_doctype_structure(doctype_name, return_data_json=0, additional_fields=[], additional_child_table_fields={}):
    doctype = frappe.get_doc("DocType", doctype_name)
    parent_fields = []
    children = {}
    parent_data_sample = {}
    child_data_sample = {}

    for field in doctype.fields:
        if field.reqd == 1 or field.fieldname in additional_fields:
            parent_fields.append(create_field_dict(field))
            if return_data_json:
                parent_data_sample[field.fieldname] = ""

        if field.fieldtype == "Table" and field.reqd == 1:
            child_doctype = frappe.get_doc("DocType", field.options)
            child_doctype_name = field.options

            # child_fields = [create_field_dict(child_field) for child_field in child_doctype.fields if child_field.reqd == 1]
            child_fields = []

            for child_field in child_doctype.fields:
                if child_field.reqd == 1:
                    child_fields.append(create_field_dict(child_field))
                    if return_data_json:
                        if field.fieldname not in child_data_sample.keys():
                            child_data_sample[field.fieldname] = {}
                        child_data_sample[field.fieldname][child_field.fieldname] = ""
                    



            if child_doctype_name in additional_child_table_fields:
                for child_field in child_doctype.fields:
                    if child_field.fieldname in additional_child_table_fields[child_doctype_name]:
                        child_fields.append(create_field_dict(child_field))
                        if return_data_json:
                            if field.fieldname not in child_data_sample.keys():
                                child_data_sample[field.fieldname] = {}
                            child_data_sample[field.fieldname][child_field.fieldname] = ""
                        

            children[child_doctype.name] = child_fields

    return {
        "parent": parent_fields,
        "children": children,
        "parent_data_sample":parent_data_sample,
        "child_data_sample":child_data_sample
    }


