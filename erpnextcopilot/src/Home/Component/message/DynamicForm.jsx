import { Form, Field, useField, useForm } from "react-final-form";


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
    useToast,
} from "@chakra-ui/react";

import React, { useEffect, useState } from "react";
import TableDemo from "./TableDemoNew";
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));


const DynamicFormView = ({ contentJson , onFormSubmit }) => {
    // from Frappe!
    const onSubmit = async values => {

        // console.log(items);
        // console.log(items.items.length > 0);


        if(items.items && items.items.length > 0){
            onFormSubmit({
                ...values,
                ...items
            })
        }else{
            onFormSubmit({
                ...values
            })
        }
    };

    const formJson = [
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
                {
                    id: 1,
                    item_name: "Apple",
                    qty: 5,
                    rate: 100
                },
                {
                    id: 2,
                    item_name: "Orange",
                    qty: 3,
                    rate: 50
                }
            ]
        },
    ];
    const toast = useToast();
    const [date, setDate] = useState(new Date());
    const [items, setItems] = useState({});

    const onItemChange = (payload) => {
        setItems({ "items": Object.values(payload) });
    }


    return (
        <Box p={4} m="20px auto">
            <Form
                onSubmit= {onSubmit}
                render={({
                    handleSubmit,
                    form,
                    errors,
                    submitting,
                    pristine,
                    values
                }) => (
                    <Box
                        key="form"
                        as="form"
                        p={4}
                        borderWidth="1px"
                        borderRadius="lg"
                        boxShadow="1px 1px 3px rgba(0,0,0,0.3)"
                        onSubmit={handleSubmit}
                    >

                        {contentJson.map((element) => {

                            let elementWidget = <></>

                            switch (element.field_type) {
                                case "Data":
                                    elementWidget = <InputControl key={element.field_type} name={element.field_key} label={element.field_name} type='text' />
                                    break;
                                case "Date":
                                    elementWidget = <InputControl key={element.field_type} type="datetime-local" name={element.field_key} label={element.field_name} />
                                    break;

                                case "Check":
                                    elementWidget = <CheckboxControl key={element.field_type} name={element.field_key}>{element.field_name}</CheckboxControl>;
                                    break;
                                case "Select":
                                    elementWidget = <Field
                                        key={element.field_type}
                                        name={element.field_key}
                                        component={AdaptedRadioGroup}
                                        label={element.field_name}
                                    >
                                        <Stack spacing={[1, 5]} direction={['row']}>
                                            {element.options.map((e) => {
                                                return <Radio key={e} value={e}>
                                                    {e}
                                                </Radio>;
                                            })}
                                        </Stack>
                                    </Field>;
                                    break;
                                case "TextArea":
                                    elementWidget = <TextareaControl key={element.field_type} name={element.field_key} label={element.field_name} />;
                                    break;
                                case "Table":
                                    if (!items["items"]) {
                                        setItems({ "items": element.values });
                                    }
                                    elementWidget = <TableDemo key={element.field_type} values={element.values} onItemChange={onItemChange} />;
                                    // elementWidget =  <Box key = 'empty' h='20px'>
                                    // </Box>;
                                    break;
                            }

                            return elementWidget
                        })
                        }
                        <Box key='spacing' h='20px'>
                        </Box>
                        <ButtonGroup key='buttongroup' spacing={4}>
                            <Button
                                isLoading={submitting}
                                loadingText="Submitting"
                                type="submit"
                            >
                                Submit
                            </Button>
                            <Button
                                variant="outline"
                                onClick={form.reset}
                                isDisabled={submitting || pristine}
                            >
                                Reset
                            </Button>
                        </ButtonGroup>
                        <Box as="pre" style={{ display: 'none' }} my={10}>
                            {JSON.stringify({ ...values, ...items }, 0, 2)}
                        </Box>
                    </Box>
                )}
            />
        </Box>
    );
};

function camelCase(str) {
    // Using replace method with regEx
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
        return index == 0 ? word.toLowerCase() : word.toUpperCase();
    }).replace(/\s+/g, '');
}

const AdaptedTextarea = ({ input, meta, ...rest }) => (
    <Textarea {...input} {...rest} isInvalid={meta.error && meta.touched} />
);

const CheckboxControl = ({ name, value, children }) => {
    const {
        input: { checked, ...input },
        meta: { error, touched, invalid }
    } = useField(name, {
        type: "checkbox" // important for RFF to manage the checked prop
    });
    return (
        <FormControl isInvalid={touched && invalid} my={4}>
            <Checkbox {...input} isInvalid={touched && invalid} my={4}>
                {children}
            </Checkbox>
            <FormErrorMessage>{error}</FormErrorMessage>
        </FormControl>
    );
};

const AdaptedRadioGroup = ({ input, meta, label, children }) => (
    <FormControl isInvalid={meta.touched && meta.invalid} my={4}>
        <FormLabel htmlFor={input.name}>{label}</FormLabel>
        <RadioGroup {...input}>{children}</RadioGroup>
        <FormErrorMessage>{meta.error}</FormErrorMessage>
    </FormControl>
);

const Control = ({ name, ...rest }) => {
    const {
        meta: { error, touched }
    } = useField(name,

        { subscription: { touched: true, error: true } });
    return <FormControl {...rest} isInvalid={error && touched} />;
};

const Error = ({ name }) => {
    const {
        meta: { error }
    } = useField(name, { subscription: { error: true } });
    return <FormErrorMessage>{error}</FormErrorMessage>;
};

const InputControl = ({ name, label, type }) => {
    const { input, meta } = useField(name);
    return (
        <Control name={name} my={4}>
            <FormLabel htmlFor={name}>{label}</FormLabel>
            <Input
                {...input}
                type={type}
                isInvalid={meta.error && meta.touched}
                id={name}
                placeholder={label}
            />
            <Error name={name} />
        </Control>
    );
};

const TextareaControl = ({ name, label }) => (
    <Control name={name} my={4}>
        <FormLabel htmlFor={name}>{label}</FormLabel>
        <Field
            name={name}
            component={AdaptedTextarea}
            placeholder={label}
            id={name}
        />
        <Error name={name} />
    </Control>
);

const PercentComplete = props => {
    const form = useForm();
    const numFields = form.getRegisteredFields().length;
    const numErrors = Object.keys(form.getState().errors).length;
    return (
        <Progress
            value={numFields === 0 ? 0 : ((numFields - numErrors) / numFields) * 100}
            {...props}
        />
    );
};


export default DynamicFormView;
