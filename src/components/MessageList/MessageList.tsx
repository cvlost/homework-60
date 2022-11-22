import React from 'react';
import type {Message} from "../../types";
import {Box, Collapse} from "@mui/material";
import {TransitionGroup} from "react-transition-group";
import MessageView from "../MessageView/MessageView";

interface Props {
  messages: Message[];
}

const MessageList: React.FC<Props> = ({messages}) => {
  return (
    <Box sx={{
      paddingTop: "1em",
      paddingBottom: "5em"
    }}>
      <TransitionGroup>
        {messages.map((message: Message) => (
          <Collapse key={message._id}>
            <MessageView message={message}/>
          </Collapse>
        ))}
      </TransitionGroup>
    </Box>
  );
};

export default MessageList;