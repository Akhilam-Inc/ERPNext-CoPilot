import { useFrappePostCall } from 'frappe-react-sdk';
import React, { useEffect, useState } from 'react';

import Select from 'react-select';

const LinkField = ({doctype,value , onLinkFieldChange}) => {

    
    const { call: callLinkData } = useFrappePostCall('erpnext_copilot.chat_bot_apis.bot_api_router.get_all_names_for_doctype')
    
    const [options, setOptions] = useState([]);
   
    useEffect(()=>{
        callLinkData({
            doctype : doctype
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
    },[]);
    
    return (
        <Select
            className="basic-single"
            classNamePrefix="select"
            selectedValue={ {label : value , value : value}}
            defaultValue={ {label : value , value : value}}
            isClearable={true}
            isSearchable={true}
            name={doctype}
            options={options}
            onChange={(value,_)=>{
                onLinkFieldChange(value);
            }}
        
        />
    );
}
export default LinkField;