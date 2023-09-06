import { useForm } from "react-hook-form";

import LinkField from "./LinkField";
import Select from 'react-select';
import {
    Box,
    Button,
    ButtonGroup,
    Heading,
    FormControl,
    FormLabel,
    FormErrorMessage,
    Input,
    Checkbox,
    Stack,
    Textarea,
    useToast
} from "@chakra-ui/react";

import React, { useEffect, useState } from "react";
import TableDemo from "./TableDemoNew";
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));


const DynamicFormView = ({ title, formJson, onFormSubmit }) => {

    const onSubmit = async values => {

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
                                    

                                        listObj.forEach(element => {
                                            Object.assign(singleRow, element);
                                        });

                                    }
                                


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