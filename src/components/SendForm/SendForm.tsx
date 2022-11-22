import React from 'react';
import {Button, Card, CardContent, FormControl, TextField, Typography} from "@mui/material";

interface Props {
  sendMessage: React.FormEventHandler;
  nickname: string;
  handleNicknameChange: React.ChangeEventHandler;
  message: string;
  handleMessageChange: React.ChangeEventHandler;
}

const SendForm: React.FC<Props> = ({sendMessage, nickname, handleNicknameChange, handleMessageChange, message}) => {
  return (
    <Card sx={{boxShadow: "0 0 1em gainsboro", my: "1em"}}>
      <CardContent>
        <form onSubmit={sendMessage}>
          <Typography
            align="center"
            marginTop="0"
            marginBottom="1em"
          >Any thoughts?</Typography>
          <FormControl fullWidth>
            <TextField
              label="Nickname"
              placeholder="You nickname..."
              value={nickname}
              onChange={handleNicknameChange}
              variant="outlined"
              fullWidth
              required
            />
            <TextField
              label="Message"
              placeholder="Your message..."
              value={message}
              onChange={handleMessageChange}
              variant="outlined"
              fullWidth
              required
              multiline
              rows={4}
              margin="normal"
            />
            <Button type="submit" variant="contained">Send</Button>
          </FormControl>
        </form>
      </CardContent>
    </Card>
  );
};

export default SendForm;