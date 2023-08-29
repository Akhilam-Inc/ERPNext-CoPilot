import * as React from "react";

import MessageBubble from "./DynamicMessageBubble";
import MessageRenderer from "./DynamicMessageRenderer";
import MessageLoadingSkeletonText from "./MessageLoadingSkeletonText";

const DynamicMessage = ({ message , onChange , onFormSubmit}) => {
  const fromAI = message.from === "ai";
  return (
    <MessageBubble key={message.id} fromAI={fromAI}>
      {!message.isLoading ? (
        <MessageRenderer message={message} fromAI = {fromAI} onChange = {onChange} onFormSubmit={onFormSubmit}/>
      ) : (
        <MessageLoadingSkeletonText />
      )}
    </MessageBubble>
  );
};

export default DynamicMessage;
