import {
    Flex,
    IconButton,
    Button,
    VStack,
    Box,
    Card,
    CardBody,
    Avatar,
    useToast,
    Textarea,
    Text,
    Stack,
    MenuButton,
    MenuList,
    MenuItem,
    Menu,
    HStack
} from "@chakra-ui/react";
import { SendIcon } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import Message from "./message/DynamicMessage";
import { UserContext } from "../../Context/UserContext";
import { useFrappePostCall } from "frappe-react-sdk";
import { ChevronDownIcon, ExternalLinkIcon } from "@chakra-ui/icons";

const defaultState = [
    {
        from: "ai",
        id: "1",
        isLoading: false,
        content: "How can I help you?",
        type: "text",
    },
    {
        from: "ai",
        id: "2",
        isLoading: false,
        content: [
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
        type: "table",
    },
    {
        from: "ai",
        id: "3",
        isLoading: false,
        chart_type: "bar",
        content: {

            series: [{
                name: 'series1',
                data: [31, 40, 28, 51, 42, 109, 100]
            }, {
                name: 'series2',
                data: [11, 32, 45, 32, 34, 52, 41]
            }],
            options: {
                chart: {
                    height: 350,
                    type: 'area'
                },
                dataLabels: {
                    enabled: false
                },
                stroke: {
                    curve: 'smooth'
                },
                xaxis: {
                    type: 'datetime',
                    categories: ["2018-09-19T00:00:00.000Z", "2018-09-19T01:30:00.000Z", "2018-09-19T02:30:00.000Z", "2018-09-19T03:30:00.000Z", "2018-09-19T04:30:00.000Z", "2018-09-19T05:30:00.000Z", "2018-09-19T06:30:00.000Z"]
                },
                tooltip: {
                    x: {
                        format: 'dd/MM/yy HH:mm'
                    },
                },
            },


        },
        type: "chart",
    }, {
        from: "ai",
        id: "4",
        isLoading: false,
        chart_type: "line",
        content: {

            series: [{
                name: 'series1',
                data: [31, 40, 28, 51, 42, 109, 100]
            }, {
                name: 'series2',
                data: [11, 32, 45, 32, 34, 52, 41]
            }],
            options: {
                chart: {
                    height: 350,
                    type: 'area'
                },
                dataLabels: {
                    enabled: false
                },
                stroke: {
                    curve: 'smooth'
                },
                xaxis: {
                    type: 'datetime',
                    categories: ["2018-09-19T00:00:00.000Z", "2018-09-19T01:30:00.000Z", "2018-09-19T02:30:00.000Z", "2018-09-19T03:30:00.000Z", "2018-09-19T04:30:00.000Z", "2018-09-19T05:30:00.000Z", "2018-09-19T06:30:00.000Z"]
                },
                tooltip: {
                    x: {
                        format: 'dd/MM/yy HH:mm'
                    },
                },
            },


        },
        type: "chart",
    }, {
        from: "ai",
        id: "5",
        isLoading: false,
        content: [{
            title: "Sent",
            amount: "345,670",
            percentage: "23.36%",
            type: "increase"
        },
        {
            title: "Received",
            amount: "45,000",
            percentage: " 9.05%",
            type: "decreased"
        }],
        type: "stat",
    }, {
        from: "ai",
        id: "6",
        isLoading: false,
        content: {
            title: "Select Food",
            options: ["Idli Sambhar", "Meduwada", "Appam", "Uttapam"]
        },
        type: "multiselect",
    }, {
        from: "ai",
        id: "7",
        isLoading: false,
        content: {
            title: "Choose Drink",
            options: ["Lager Beer", "Witbeer", "American Ale", "Cream Ale"]
        },
        type: "radio",
    }, {
        from: "ai",
        id: "8",
        isLoading: false,
        content: [
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
        ],
        type: "form",
    }
]

export const ChatView = ({ sessionID }) => {

    const { currentUser } = useContext(UserContext);
    const toast = useToast();

    const [mode, setMode] = useState("Inquiry");
    const [promptMessage, setPromptMessage] = useState("");
    const [messages, setMessages] = useState(/* defaultState */[]);
    const { call: callChatBotInquery } = useFrappePostCall('erpnext_copilot.chat_bot_apis.bot_api_router.get_response_as_per_role')
    // const { call: callPromtFormCreate } = useFrappePostCall('erpnext_copilot.chat_bot_apis.test_json.get_chatbot_response')
    var { call: callPromtFormCreate } = useFrappePostCall('erpnext_copilot.chat_bot_apis.order_bot.complete_task')
    var { call: callSubmitForm } = useFrappePostCall('erpnext_copilot.chat_bot_apis.bot_api_router.submit_form')
    const { logout } = useContext(UserContext);


    useEffect(() => {
        setMessages((old) => [
            ...old,
            { from: "ai", content: "", isLoading: true },
            // {
            //     from: "ai",
            //     content: "How can i help you?",
            //     isLoading: false,
            //     type: "text",
            // }
        ]);

        callChatBotInquery({
            prompt_message: "What can you do?",
            session_id: sessionID,
        })
            .then((response) => {

                setMessages((old) => {
                    old.splice(old.length - 1, 1, {
                        from: "ai",
                        content: response.message,
                        isLoading: false,
                        type: "text",
                    });
                    return [...old];
                });
            })
            .catch((e) => {
                console.error(e);
                toast({
                    title: "Something went wrong, check console",
                    status: "error",
                    position: "bottom-right",
                });
            });
    }, []);

    const onChange = (type, payload) => {
        switch (type) {
            case "multiselect":
                setPromptMessage(payload.join(", "));
                break;
            case "radio":
                setPromptMessage(payload);
                break;
        }
    }
    const onChangeMode = (value) => {
        console.log("MODE ", value);
        setMode(value);
    }

    const onLogoutClick = () => {
        logout();
    }

    const onFormSubmit = async (values) => {
        // window.alert(JSON.stringify(values, 0, 2));

        callSubmitForm({
            form_values: values,
            session_id: sessionID,
        })
            .then((response) => {

                console.log(response.message);
                toast({
                    title: values["doctype"] + " Created succcesfully",
                    status: "success",
                    position: "top-center",
                });
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

    const handleSendMessage = () => {
        if (!promptMessage.trim().length) {
            return;
        }

        setMessages((old) => [
            ...old,
            { from: "human", content: promptMessage, isLoading: false, type: "text" },
            { from: "ai", content: "", isLoading: true },
        ]);

        var message = promptMessage;
        setPromptMessage("");

        // erpnext_copilot.api.get_chatbot_response
        // erpnext_copilot.chat_bot_apis.WorkstationManger.get_chatbot_response
        // erpnext_copilot.chat_bot_apis.sales_person_assistant.get_chatbot_response
        // erpnext_copilot.chat_bot_apis.bot_api_router.get_response_as_per_role
        // axios
        //     .post("http://chatai.akhilaminc.com/api/method/erpnext_copilot.chat_bot_apis.test_json.get_chatbot_response", {
        //         prompt_message: promptMessage,
        //         session_id: sessionID,
        //     })


        if (mode == "Create") {
            callPromtFormCreate({
                input_message: message,
                session_id: sessionID,
            })
                .then((response) => {

                    console.log(response.message);

                    if (response.message && response.message.type == "Create") {
                        console.log(typeof response.message.json_data.values, " ", typeof response.message.json_data.values == 'string');
                        if (typeof response.message.json_data.values == 'string') {
                            console.log(response.message.json_data.values);
                            var data = JSON.parse(response.message.json_data.values);
                            response.message.json_data.values = data;
                        }
                    }
                    setMessages((old) => {
                        old.splice(old.length - 1, 1, {
                            from: "ai",
                            content: response.message,
                            isLoading: false,
                            type: response.message.type ?? "text",
                        });
                        return [...old];
                    });

                })
                .catch((e) => {
                    console.error(e);
                    toast({
                        title: "Something went wrong, check console",
                        status: "error",
                        position: "bottom-right",
                    });
                });
        } else {
            callChatBotInquery({
                prompt_message: message,
                session_id: sessionID,
            })
                .then((response) => {

                    console.log(response.message);

                    setMessages((old) => {
                        old.splice(old.length - 1, 1, {
                            from: "ai",
                            content: response.message,
                            isLoading: false,
                            type: response.message.type ?? "text",
                        });
                        return [...old];
                    });

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
    };

    return (
        <Flex
            direction={"column"}
            height={"100vh"}
            width={"100vw"}
        >
            {/* <Text fontSize="xl" fontWeight={"bold"} textColor={"gray.700"}>Ask ERPnext</Text> */}
            {/* Chat Area */}
            <Box
                width={"100%"}
                height={"100%"}
                overflowY="scroll"
                shadow={"xl"}
                rounded={"md"}
                backgroundColor={"white"}
            >
                <VStack spacing={2} align="stretch" p={"2"}>
                    {messages.map((message) => {
                        return <Message key={message.id} message={message} onChange={onChange} onFormSubmit={onFormSubmit} />;
                    })}
                </VStack>
            </Box>

            {/* Prompt Area */}
            <Card mt={"1.5"}>
                <CardBody>
                    <Flex gap={"1.5"} alignItems={"start"}>
                        <VStack spacing={2} align="stretch" p={"2"}>
                            <HStack spacing={4} p={"2"}>
                                <Avatar name={currentUser} size={"sm"} src={""} />
                                <IconButton
                                    background='#b67afd'
                                    _hover={{ boxShadow: "none" }}
                                    aria-label="Logout"
                                    icon={<ExternalLinkIcon height={16} />}
                                    onClick={onLogoutClick}
                                />
                            </HStack>
                            <Menu>
                                <MenuButton as={Button} rightIcon={<ChevronDownIcon />} >
                                    {mode}
                                </MenuButton>
                                <MenuList>
                                    <MenuItem onClick={() => onChangeMode("Create")}>Create</MenuItem>
                                    <MenuItem onClick={() => onChangeMode("Inquiry")}>Inquiry</MenuItem>
                                </MenuList>
                            </Menu>
                        </VStack>
                        {/* Input Box */}
                        <Textarea
                            value={promptMessage}
                            onChange={(event) => setPromptMessage(event.target.value)}
                            onKeyDown={(event) => {
                                if (event.code == "Enter" && promptMessage) {
                                    handleSendMessage();
                                }
                            }}
                            placeholder="Type your message here..."
                        />

                        {/* Send Button */}
                        <IconButton
                            background='#b67afd'
                            _hover={{ boxShadow: "none" }}
                            aria-label="Send Prompt Message"
                            icon={<SendIcon height={16} />}
                            onClick={handleSendMessage}
                        />
                    </Flex>
                </CardBody>
            </Card>
        </Flex>
    );
};

