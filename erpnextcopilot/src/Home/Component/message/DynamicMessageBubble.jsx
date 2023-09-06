import * as React from "react";

import { Flex, HStack, Avatar } from "@chakra-ui/react";
import bot_logo from "../../../assets/bot.png";
const DynamicMessageBubble = ({ children, fromAI }) => {
  return (
    fromAI ? <>
      <HStack spacing={4} display={{ base: 'none', md: 'flex' }} align={"start"}>
        <Avatar name={""} size={"md"} src={bot_logo} />
        <Flex
          direction={"column"}
          p={"4"}
          alignSelf={fromAI ? "start" : "end"}
          justify={"center"}
          backgroundColor={fromAI ? "gray.50" : "#DFC5FE"}
          rounded={"xl"}
          width={"fit-content"}
          maxW={{ base: "100%", sm: "90%" }}
          roundedTopLeft={fromAI ? "0" : "xl"}
          roundedTopRight={fromAI ? "xl" : "0"}
        >

          {children}
        </Flex>
      </HStack>
    </> :
      <Flex
        direction={"column"}
        p={"4"}
        alignSelf={fromAI ? "start" : "end"}
        justify={"center"}
        backgroundColor={fromAI ? "gray.50" : "#DFC5FE"}
        rounded={"xl"}
        width={"fit-content"}
        maxW={{ base: "100%", sm: "90%" }}
        roundedTopLeft={fromAI ? "0" : "xl"}
        roundedTopRight={fromAI ? "xl" : "0"}
      >

        {children}
      </Flex>
  );
};

export default DynamicMessageBubble;
