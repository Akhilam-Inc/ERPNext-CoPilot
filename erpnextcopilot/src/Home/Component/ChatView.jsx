import {
    Flex,
    Button,
    VStack,
    Box,
    Card,
    CardBody,
    useToast,
    Textarea,
    MenuButton,
    MenuList,
    MenuItem,
    Menu,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import Message from "./message/DynamicMessage";
import { UserContext } from "../../Context/UserContext";
import { useFrappePostCall } from "frappe-react-sdk";
import { ChevronDownIcon } from "@chakra-ui/icons";


export const ChatView = ({ sessionID }) => {

    const { currentUser } = useContext(UserContext);
    const toast = useToast();

    const [mode, setMode] = useState("Inquiry");
    const [promptMessage, setPromptMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const { call: callChatBotInquery } = useFrappePostCall('erpnext_copilot.chat_bot_apis.bot_api_router.get_response_as_per_role')
    var { call: callPromtFormCreate } = useFrappePostCall('erpnext_copilot.chat_bot_apis.order_bot.complete_task')
    var { call: callSubmitForm } = useFrappePostCall('erpnext_copilot.chat_bot_apis.bot_api_router.submit_form')
    const { logout } = useContext(UserContext);


    useEffect(() => {
        setMessages((old) => [
            {
                from: "ai",
                content: "I can help you with,<br>1)Suggest new products to customer.<br>2)Check Stock and Price detail.<br>3)Analyse the customer sales and their outstanding.<br>4)Check their available credit limit.",
                isLoading: false,
                type: "text",
            }
        ]);
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
        
        setMode(value);

        if (value == "Inquiry"){
            setMessages((old) => [
                {
                    from: "ai",
                    content: "I can help you with,<br>1)Suggest new products to customer.<br>2)Check Stock and Price detail.<br>3)Analyse the customer sales and their outstanding.<br>4)Check their available credit limit.",
                    isLoading: false,
                    type: "text",
                }
            ]);
        }else{
            setMessages((old) => [
                {
                    from: "ai",
                    content: "I can help you in creating records in ERPNext",
                    isLoading: false,
                    type: "text",
                }
            ]);
        }
    }

    const onLogoutClick = () => {
        logout();
    }

    const onFormSubmit = async (values) => {

        callSubmitForm({
            form_values: values,
            session_id: sessionID,
        })
            .then((response) => {
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

        if (mode == "Create") {
            callPromtFormCreate({
                input_message: message,
                session_id: sessionID,
            })
                .then((response) => {

                    

                    if (response.message && response.message.type == "Create") {
                    
                        if (typeof response.message.json_data.values == 'string') {
                            
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
            height={"92vh"}
            width={"100vw"}
        >
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
                        <Menu>
                            <MenuButton as={Button} rightIcon={<ChevronDownIcon />} >
                                {mode}
                            </MenuButton>
                            <MenuList>
                                <MenuItem onClick={() => onChangeMode("Create")}>Create</MenuItem>
                                <MenuItem onClick={() => onChangeMode("Inquiry")}>Inquiry</MenuItem>
                            </MenuList>
                        </Menu>
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
                        <Button colorScheme='purple' size='md' onClick={handleSendMessage}>
                            Send
                        </Button>
                    </Flex>
                </CardBody>
            </Card>
        </Flex>
    );
};

