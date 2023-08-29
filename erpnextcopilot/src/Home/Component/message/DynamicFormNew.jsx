import { useForm } from "react-hook-form";

import LinkField from "./LinkField";
import Select from 'react-select';
import {
    Box,
    Button,
    ButtonGroup,
    Heading,
    Icon,
    Link,
    FormControl,
    FormLabel,
    FormErrorMessage,
    Input,
    Checkbox,
    Progress,
    Radio,
    RadioGroup,
    Stack,
    Text,
    Textarea,
    Card,
    CardBody,
    useToast
} from "@chakra-ui/react";

import React, { useEffect, useState } from "react";
import TableDemo from "./TableDemoNew";
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));


const DynamicFormView = ({ title, formJson, onFormSubmit }) => {



    // from Frappe!
    const onSubmit = async values => {

        // console.log(items);
        // console.log(formValues);

        var emptyFields = Object.entries(formValues).filter((e) => {
            return e[1] == "" || e[1] == []
        });

        if (emptyFields.length > 0) {
            window.alert("Please enter values for: \n" + emptyFields.map((e) => "* " + camelToTitleCase(e[0])).join("\n"))
            return;
        }
        Object.entries(formValues).forEach((e) => {
            if (values[e[0]] == null || values[e[0]] != e[1]) {
                values[e[0]] = e[1];
            }
        })


        if (items.items && items.items.length > 0) {

            var finalItems = items.items.filter((e) => {
                console.log(e, " ", !Object.values(e).every((value) => value == ""));
                return !Object.values(e).every((value) => value == "");
            });

            onFormSubmit({
                "doctype": title,
                ...values,
                "items" : finalItems
            })
        } else {
            onFormSubmit({
                "doctype": title,
                ...values
            })
        }
    };

    const formDummyJson = {
        "values": {
            "customer": "Raj",
            "delivery_date": "2023-08-30",
            "items": [
                {
                    "item_code": "apple_1",
                    "item_name": "Apple",
                    "qty": "5",
                    "rate": "150"
                },
                {
                    "item_code": "banana_2",
                    "item_name": "Banana",
                    "qty": "12",
                    "rate": "50"
                }
            ]
        },
        "parent": [
            {
                "label": "Customer",
                "fieldname": "customer",
                "fieldtype": "Link",
                "options": "Customer",
                "reqd": 1
            },
            {
                "label": "Delivery Date",
                "fieldname": "delivery_date",
                "fieldtype": "Date",
                "reqd": 1
            },
            {
                "label": "Order Type",
                "fieldname": "order_type",
                "fieldtype": "Select",
                "options": ["Sales Order", "Shopping Cart", "Maintenance"],
                "reqd": 1
            },
            {
                "label": "Maintain Stock",
                "fieldname": "maintain_stock",
                "fieldtype": "Check",
                "reqd": 1
            },
            {
                "label": "Narration",
                "fieldname": "narration",
                "fieldtype": "TextArea",
                "reqd": 1
            },
            {
                "label": "Items",
                "fieldname": "items",
                "fieldtype": "Table",
                "options": "Sales Order Item",
                "reqd": 1,
            },
        ],
        "children": {
            "Sales Order Item": [
                {
                    "label": "Item Code",
                    "fieldname": "item_code",
                    "fieldtype": "Link",
                    "options": "Item",
                    "data_like": "item_name",
                    "reqd": 1
                },
                {
                    "label": "Item Name",
                    "fieldname": "item_name",
                    "fieldtype": "Data",
                    "reqd": 1
                },
                {
                    "label": "Qty",
                    "fieldname": "qty",
                    "fieldtype": "Data",
                    "reqd": 1
                },
                {
                    "label": "Rate",
                    "fieldname": "rate",
                    "fieldtype": "Data",
                    "reqd": 1
                },
            ],
        }
    };
    const toast = useToast();
    const [date, setDate] = useState(new Date());
    const [items, setItems] = useState({});

    var formJsonValues = formJson.parent_fields.filter((e) => e.reqd == 1 && ["Link", "Select"].includes(e.fieldtype)).map((e) => {

        var json = {}
        json[e.fieldname] = formJson.values[e.fieldname] ?? ""
        return json
    })
    var otherValues = {}
    formJsonValues.forEach((e) => {
        Object.assign(otherValues, e);
    })

    const [formValues, setFormValues] = useState(otherValues);

    const {
        handleSubmit,
        register,
        getValues,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: formJson.values,
    });


    const onItemChange = (payload) => {
        console.log("ITEMS ", payload);
        setItems({ "items": Object.values(payload) });

    }


    return (
        <Box p={4} m="20px auto">
            <form onSubmit={handleSubmit(onSubmit)}>


                <Box
                    p={4}
                    borderWidth="1px"
                    borderRadius="lg"
                    boxShadow="1px 1px 3px rgba(0,0,0,0.3)" >
                    <Stack spacing={4}>

                        <Heading>{title}</Heading>
                        {formJson.parent_fields.map((element) => {

                            let elementWidget = <></>

                            switch (element.fieldtype) {
                                case "Link":

                                    var value = formJson.values[element.fieldname] != null ? formJson.values[element.fieldname] : "Select " + element.label;

                                    elementWidget = <>
                                        <FormControl key={element.fieldname} id={element.fieldname} isRequired={element.reqd == 1} isInvalid={!!errors?.email}>
                                            <FormLabel htmlFor={element.label}>{element.label}</FormLabel>
                                            <LinkField doctype={element.options} value={value} onLinkFieldChange={(value) => {

                                                formValues[element.fieldname] = value != null ? value.value : "";
                                                setFormValues(formValues);

                                            }} />
                                            {errors && errors[element.fieldname]?.message &&
                                                <FormErrorMessage >{errors[element.fieldname]?.message}</FormErrorMessage>
                                            }
                                        </FormControl>
                                    </>;


                                    break;
                                case "Data":
                                case "Float":

                                    elementWidget = <>
                                        <FormControl key={element.fieldname} id={element.fieldname} isRequired={element.reqd == 1} isInvalid={!!errors?.email}>
                                            <FormLabel htmlFor={element.label}>{element.label}</FormLabel>
                                            <Input
                                                type="text"
                                                id={element.fieldname}
                                                placeholder={element.label}
                                                // defaultValue={defaultValue}
                                                {...register(element.fieldname, {
                                                    required: element.reqd == 1,
                                                    message: "Please Enter " + element.fieldname
                                                })}
                                            />
                                            {errors && errors[element.fieldname]?.message &&
                                                <FormErrorMessage >{errors[element.fieldname]?.message}</FormErrorMessage>
                                            }
                                        </FormControl>
                                    </>;


                                    break;
                                case "Date":

                                    elementWidget = <>
                                        <FormControl key={element.fieldname} id={element.fieldname} isRequired={element.reqd == 1} isInvalid={!!errors?.email}>
                                            <FormLabel htmlFor={element.label}>{element.label}</FormLabel>
                                            <Input
                                                type="date"
                                                id={element.fieldname}
                                                placeholder={element.label}
                                                {...register(element.fieldname, {
                                                    required: element.required == 1,
                                                    message: "Please Enter " + element.fieldname,
                                                })}
                                            />
                                            {/* <Error name={element.fieldname} />
                                     */}
                                            {errors && errors[element.fieldname]?.message &&
                                                <FormErrorMessage >{errors[element.fieldname]?.message}</FormErrorMessage>
                                            }
                                        </FormControl>
                                    </>
                                    break;

                                case "Check":
                                    elementWidget = <>
                                        <FormControl isRequired={element.reqd == 1}>
                                            <Checkbox {...register(element.fieldname)}>
                                                {element.label}
                                            </Checkbox>
                                            {errors && errors[element.fieldname]?.message &&
                                                <FormErrorMessage >{errors[element.fieldname]?.message}</FormErrorMessage>
                                            }
                                        </FormControl>
                                    </>;
                                    break;
                                case "Select":

                                    var value = formJson.values[element.fieldname] != null ? formJson.values[element.fieldname] : "Select " + element.label;

                                    elementWidget = <>
                                        <FormControl key={element.fieldname} id={element.fieldname} isRequired={element.reqd == 1} isInvalid={!!errors?.email}>
                                            <FormLabel htmlFor={element.label}>{element.label}</FormLabel>
                                            <Select
                                                className="basic-single"
                                                classNamePrefix="select"
                                                isClearable={true}
                                                isSearchable={true}
                                                name={element.fieldname}
                                                selectedValue={{ label: value, value: value }}
                                                defaultValue={{ label: value, value: value }}
                                                options={element.options.split("\n").map((e) => {
                                                    return {
                                                        value: e,
                                                        label: e
                                                    }
                                                })}
                                                onChange={(value, _) => {
                                                    formValues[element.fieldname] = value != null ? value.value : "";
                                                    setFormValues(formValues);

                                                }}
                                            />
                                            {errors && errors[element.fieldname]?.message &&
                                                <FormErrorMessage >{errors[element.fieldname]?.message}</FormErrorMessage>
                                            }
                                        </FormControl>
                                    </>;
                                    break;
                                case "TextArea":
                                case "Text Editor":
                                    elementWidget = <>
                                        <FormControl key={element.fieldname} id={element.fieldname} isRequired={element.reqd == 1} isInvalid={!!errors?.email}>
                                            <FormLabel htmlFor={element.label}>{element.label}</FormLabel>
                                            <Textarea

                                                id={element.fieldname}
                                                placeholder={element.label}
                                                {...register(element.fieldname, {
                                                    required: element.reqd == 1,
                                                    message: "Please Enter " + element.fieldname
                                                })}
                                            />
                                            {errors && errors[element.fieldname]?.message &&
                                                <FormErrorMessage >{errors[element.fieldname]?.message}</FormErrorMessage>
                                            }
                                        </FormControl>
                                    </>;


                                    break;
                                case "Table":

                                    var values = []
                                    var singleRow = {}
                                    var schemas = {}

                                    if (formJson.values[element.fieldname] != null && formJson.values[element.fieldname].length > 0) {
                                        values = formJson.values[element.fieldname];

                                        var listObj = Object.keys(values[0]).map((e) => {
                                            var fieldname = e;
                                            var json = {}
                                            json[fieldname] = "";
                                            return json;
                                        });
                                        console.log(listObj);

                                        listObj.forEach(element => {
                                            Object.assign(singleRow, element);
                                        });;
                                    } else {

                                        var listObj = formJson.children[element.fieldname].map((e) => {
                                            var fieldname = e.fieldname;
                                            var json = {}
                                            json[fieldname] = "";
                                            return json;
                                        });
                                        console.log(listObj);

                                        listObj.forEach(element => {
                                            Object.assign(singleRow, element);
                                        });

                                    }
                                    console.log("ITEMSS ", values);


                                    if (!items["items"]) {
                                        setItems({ "items": values });
                                    }

                                    var listSchema = formJson.children[element.fieldname].map((e) => {
                                        var json = {}
                                        json[e.fieldname] = {
                                            "type": e.fieldtype,
                                            "options": e.data_like,
                                            "doctype": e.options,
                                            "reqd": e.reqd
                                        };
                                        return json;
                                    })

                                    listSchema.forEach(element => {
                                        Object.assign(schemas, element);
                                    });
                                    elementWidget = <>
                                        <FormLabel >{element.label}</FormLabel>
                                        <TableDemo key={element.fieldtype} values={values} singleRowData={singleRow} schemas={schemas} onItemChange={onItemChange} />
                                    </>;
                                    // elementWidget =  <Box key = 'empty' h='20px'></Box>;
                                    break;
                            }

                            return elementWidget
                        })
                        }
                    </Stack>
                    <Box key='spacing' h='20px'>
                    </Box>
                    <ButtonGroup key='buttongroup' spacing={4}>
                        <Button
                            type="submit"
                        >
                            Submit
                        </Button>
                        <Button
                            variant="outline"
                        // onClick={form.reset}
                        >
                            Reset
                        </Button>
                    </ButtonGroup>
                </Box>
            </form>
        </Box>
    );
};

function camelCase(str) {
    // Using replace method with regEx
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
        return index == 0 ? word.toLowerCase() : word.toUpperCase();
    }).replace(/\s+/g, '');
}

// const AdaptedTextarea = ({ input, meta, ...rest }) => (
//     <Textarea {...input} {...rest} isInvalid={meta.error && meta.touched} />
// );

// const CheckboxControl = ({ name, defaultValue, children }) => {
//     const {
//         input: { checked, ...input },
//         meta: { error, touched, invalid }
//     } = useField(name, {
//         type: "checkbox" // important for RFF to manage the checked prop
//     });
//     return (
//         <FormControl isInvalid={touched && invalid} my={4}>
//             <Checkbox {...input} isInvalid={touched && invalid} my={4} {...register(name)} defaultValue={defaultValue}>
//                 {children}
//             </Checkbox>
//             <FormErrorMessage>{error}</FormErrorMessage>
//         </FormControl>
//     );
// };

// const AdaptedRadioGroup = ({ input, meta, label, children, defaultValue }) => (
//     <FormControl isInvalid={meta.touched && meta.invalid} my={4}>
//         <FormLabel htmlFor={input.name}>{label}</FormLabel>
//         <RadioGroup {...input} defaultValue={defaultValue}>{children}</RadioGroup>
//         <FormErrorMessage>{meta.error}</FormErrorMessage>
//     </FormControl>
// );

// const Control = ({ name, defaultValue, ...rest }) => {
//     const {
//         meta: { error, touched }
//     } = useField(name,

//         { subscription: { touched: true, error: true } });
//     return <FormControl {...rest} isInvalid={error && touched} defaultValue={defaultValue} />;
// };

// const Error = ({ name }) => {
//     const {
//         meta: { error }
//     } = useField(name, { subscription: { error: true } });
//     return <FormErrorMessage>{error}</FormErrorMessage>;
// };



// const TextareaControl = ({ name, label, defaultValue }) => (
//     <Control name={name} my={4}>
//         <FormLabel htmlFor={name}>{label}</FormLabel>
//         <Field
//             name={name}
//             component={AdaptedTextarea}
//             placeholder={label}
//             id={name}
//             defaultValue={defaultValue}
//         />
//         <Error name={name} />
//     </Control>
// );

// const PercentComplete = props => {
//     const form = useForm();
//     const numFields = form.getRegisteredFields().length;
//     const numErrors = Object.keys(form.getState().errors).length;
//     return (
//         <Progress
//             value={numFields === 0 ? 0 : ((numFields - numErrors) / numFields) * 100}
//             {...props}
//         />
//     );
// };


export default DynamicFormView;
function camelToTitleCase(str) {
    var camel = snakeToCamel(str);
    var pascalCase = camel.charAt(0).toUpperCase() + camel.substr(1);
    return pascalCase
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2')
        .replace(/([a-z])([0-9])/gi, '$1 $2')
        .replace(/([0-9])([a-z])/gi, '$1 $2').replace('_', " ");
}

const snakeToCamel = s => s.replace(/(_\w)/g, k => k[1].toUpperCase())