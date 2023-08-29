import * as React from "react";

import { Flex } from "@chakra-ui/react";

const DynamicMessageBubble = ({ children, fromAI }) => {
  return (
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
