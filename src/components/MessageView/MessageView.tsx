import React from 'react';
import type {Message} from "../../types";
import {Card, CardContent, Typography} from "@mui/material";

interface Props {
  message: Message;
}

const MessageView = React.memo<Props>(({message}) => {
  const date = new Date(message.datetime);
  const dateString = date.toLocaleTimeString() + ' ' + date.toLocaleDateString();

  return (
    <Card variant="outlined" sx={{boxShadow: "0 0 1em gainsboro", marginBottom: ".8em"}}>
      <CardContent sx={{padding: ".6rem"}}>
        <Typography component="span" fontSize=".8em" color="text.secondary">From </Typography>
        <Typography
          component="strong"
          fontSize=".8em"
          fontWeight="bold"
          color="primary.main"
        >{message.author}
        </Typography>
      </CardContent>
      <CardContent sx={{
        borderTop: "1px solid gainsboro",
        borderBottom: "1px solid gainsboro",
      }}>
        <Typography fontSize="1.2em">{message.message}</Typography>
      </CardContent>
      <CardContent sx={{padding: ".6rem !important"}}>
        <Typography align="right">
          <Typography
            fontSize=".8em"
            component="span"
            fontWeight="bold"
            color="text.secondary"
          >
            Date:&nbsp;
          </Typography>
          <Typography
            component="span"
            color="text.secondary"
            align="right"
            fontStyle="italic"
            fontSize=".8em"
          >
            {dateString}
          </Typography>
        </Typography>
      </CardContent>
    </Card>
  );
}, (prev, next) => prev.message._id === next.message._id);

export default MessageView;
