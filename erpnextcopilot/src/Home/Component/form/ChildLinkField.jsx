import { useFrappePostCall } from 'frappe-react-sdk';
import React, { useEffect, useState } from 'react';

import Select from 'react-select';

const ChildLinkField = ({ name, value,
    reference,
    schema, onChange }) => {

    const { call: callLinkDataRef } = useFrappePostCall('erpnext_copilot.chat_bot_apis.bot_api_router.get_names_by_field_value')
    const { call: callLinkData } = useFrappePostCall('erpnext_copilot.chat_bot_apis.bot_api_router.get_all_names_for_doctype')

    const [options, setOptions] = useState([]);

    const styles = {
        menuList: (base) => ({
          ...base,
          height: "100px",
      
         "::-webkit-scrollbar": {
           width: "9px"
         },
         "::-webkit-scrollbar-track": {
           background: "blue"
         },
         "::-webkit-scrollbar-thumb": {
           background: "#888"
         },
         "::-webkit-scrollbar-thumb:hover": {
           background: "#555"
         }
        }),
    }

    useEffect(() => {
      
        if (reference != null){
          callLinkDataRef({
            doctype: schema.doctype,
            field_name: schema.options,
            field_value: reference
        }).then((response) => {
            setOptions(response.message);
        })
            .catch((e) => {
                console.error(e);
                toast({
                    title: "Something went wrong, check console",
                    status: "error",
                    position: "bottom-right",
                });
            });
        }else{
          callLinkData({
            doctype: schema.doctype,
            field_name: schema.options,
            field_value: reference
        }).then((response) => {
            setOptions(response.message);
        })
            .catch((e) => {
                console.error(e);
                toast({
                    title: "Something went wrong, check console",
                    status: "error",
                    position: "bottom-right",
                });
            });
        }
        
    }, []);

    return (
         <Select
            className="basic-single"
            classNamePrefix="select"
            menuPortalTarget={document.body} 
            menuPosition={'fixed'}
            selectedValue={ {label : value , value : value}}
            defaultValue={ {label : value , value : value}}
            styles={styles}
            isClearable={true}
            isSearchable={true}
            name={name}
            options={options}
            onChange={(value, _) => {
              onChange(value != null ? value : {lable: "" , value : ""});
            }}

        />
    );
}
export default ChildLinkField;