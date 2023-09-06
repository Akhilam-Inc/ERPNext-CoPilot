import * as React from "react";

import {
  Text,
  Table,
  Thead,
  Tbody,
  TableContainer,
  Tr,
  Td,
  Th,
  Image,
  Heading,
  ListItem,
  UnorderedList,
  OrderedList,
  CheckboxGroup,
  RadioGroup,
  Radio,
  Stack,
  Checkbox

} from "@chakra-ui/react";

import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";


import CopyToClipboardButton from "./CopyToClipboardButton";
import TableRenderer from "../views/TableRenderer";
import ChartRenderer from "../views/ChartRenderer";
import DynamicFormView from "../form/DynamicFormNew";

const DynamicMessageRenderer = ({ message, fromAI, onChange , onFormSubmit}) => {

  let messageWidget = <></>

  switch (message.type) {
    case "text":

      messageWidget = <ReactMarkdown
        key={message.id}
        children={message.content}
        components={markdownRenderComponentOverrides}
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
      />
      break;
    case "table":

      messageWidget = <TableRenderer message={message} />
      break;
    case "chart":
      messageWidget = <ChartRenderer key={message.id} message={message} />
      break;
    // case "stat":
    //   messageWidget = <StatRenderer message={message} />
    //   break;
    case "multiselect":
      messageWidget = <>
        <CheckboxGroup colorScheme='green' onChange={(e) => onChange(message.type, e)}>
          <Stack spacing={[1, 5]} direction={['column']}>
            <Text>{message.content.title}</Text>
            {message.content.options.map((value) => {
              return <Checkbox key={value} value={value}>{value}</Checkbox>;
            })}
          </Stack>
        </CheckboxGroup></>
        break;
    case "radio":
      messageWidget = <>
        <RadioGroup onChange={(e) => onChange(message.type, e)} colorScheme='green'>
          <Stack spacing={[1, 5]} direction={['column']}>
            <Text>{message.content.title}</Text>
            {message.content.options.map((value) => {
              return <Radio key={value} value={value}>{value}</Radio>;
            })}
          </Stack>
        </RadioGroup>
      </>
      break;
    case "Create":
      
      messageWidget = <><DynamicFormView title = {message.content.doctype} formJson = {message.content.json_data} onFormSubmit = {onFormSubmit} /></>
      
      break;
  }

  return (
    messageWidget
  );
};

const markdownRenderComponentOverrides = {
  p: ({ node, ...props }) => <Text color="black" mb="0" {...props} />,
  h1: ({ node, ...props }) => <Heading color="black" as="h1" {...props} />,
  h2: ({ node, ...props }) => <Heading color="black" as="h2" {...props} />,
  h3: ({ node, ...props }) => <Heading color="black" as="h3" {...props} />,
  h4: ({ node, ...props }) => <Heading color="black" as="h4" {...props} />,
  li: ({ node, ...props }) => <ListItem color="black" {...props} />,
  ul: ({ node, ...props }) => <UnorderedList {...props} />,
  ol: ({ node, ...props }) => <OrderedList {...props} />,
  table: ({ node, ...props }) => (
    <TableContainer bg={"black"} mt="1.5" rounded="sm">
      <Table p={"1"} size={"sm"} variant={"simple"} {...props} />
    </TableContainer>
  ),
  img: ({ node, ...props }) => (
    <Image rounded={"sm"} boxSize={"32"} objectFit={"cover"} {...props} />
  ),
  thead: ({ node, ...props }) => <Thead {...props} />,
  tbody: ({ node, ...props }) => <Tbody {...props} />,
  tr: ({ node, ...props }) => <Tr {...props} />,
  td: ({ node, ...props }) => <Td {...props} />,
  th: ({ node, ...props }) => <Th {...props} />,
  code({ node, inline, className, children, ...props }) {
    const match = /language-(\w+)/.exec(className || "");
    const codeString = String(children).replace(/\n$/, "");
    return !inline && match ? (
      <SyntaxHighlighter
        {...props}
        children={codeString}
        style={atomDark}
        language={match[1]}
        PreTag={(props) => (
          <PreWithClickToCopyButton codeString={codeString} {...props} />
        )}
      />
    ) : (
      <code {...props} className={className}>
        {children}
      </code>
    );
  },
};

const PreWithClickToCopyButton = (props) => {
  const { codeString, ...otherProps } = props;

  return (
    <div
      role="group"
      {...otherProps}
      style={{ ...otherProps.style, position: "relative" }}
    >
      {otherProps.children}
      <CopyToClipboardButton contentToCopy={codeString} />
    </div>
  );
};

export default DynamicMessageRenderer;
