import React, {FormEvent, useEffect, useRef, useState} from 'react';
import type {Message} from "../types";
import {Box, Container, Grid, InputLabel, Switch, Typography} from "@mui/material";
import SendForm from "../components/SendForm/SendForm";
import Preloader from "../components/Preloader/Preloader";
import MessageList from "../components/MessageList/MessageList";
import './App.css';


const messagesUrl = 'http://146.185.154.90:8000/messages';

const request = async (url: string): Promise<Message[]> => {
  const response = await fetch(url);
  if (!response.ok) throw new Error('Cannot fetch data');
  return response.json();
}

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isNewFirst, setIsNewFirst] = useState(true);
  const [nickname, setNickname] = useState('');
  const [message, setMessage] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const intervalId = useRef<null | number>(null);
  const param = useRef<string>('');

  const orderedMessages = isNewFirst ? [...messages].reverse() : messages;


  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  }

  const changeMessageLayout = () => setIsNewFirst(prev => !prev);

  const sendMessage = async (e: FormEvent) => {
    e.preventDefault();
    const data = new URLSearchParams();
    data.set('message', message);
    data.set('author', nickname);

    stopAutoRefresh();

    await fetch(messagesUrl, {
      method: 'post',
      body: data,
    });

    getMessages(messagesUrl + param.current).catch(console.error);
    autoRefresh();

    setMessage('');
  };

  const getMessages = async (url: string) => {
    setIsFetching(true);
    const messages: Message[] = await request(url);
    if (messages.length) param.current = `?datetime=${messages[messages.length - 1].datetime}`;
    setMessages(prev => [...prev, ...messages]);
    setIsFetching(false);
  };

  const stopAutoRefresh = () => {
    if (intervalId.current === null) return;
    clearInterval(intervalId.current);
    intervalId.current = null;
  }

  const autoRefresh = () => {
    if (intervalId.current !== null) return;
    intervalId.current = window.setInterval(async () => {
      if (isFetching) return;
      getMessages(messagesUrl + param.current).catch(console.error);
    }, 3000);
  };

  useEffect(() => {
    getMessages(messagesUrl).catch(console.error);
    autoRefresh();
  }, []);

  return (
    <Box style={{
      display: "flex",
      flexDirection: "column",
      height: "100vh"
    }}>
      <Box sx={{
        boxShadow: "0 0 10px gray",
        position: 'relative',
        zIndex: 1
      }}>
        <Container fixed>
          <Box display="flex">
            <Typography component="h1" fontSize="2.5em" marginRight="1em">Chat</Typography>
            <Box sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }}>
              <InputLabel color="secondary" sx={{fontSize: ".8em"}}>
                <Switch
                  id="show-new"
                  checked={isNewFirst}
                  onChange={changeMessageLayout}
                />
                New Messages First
              </InputLabel>
            </Box>
            <Preloader visible={isFetching}/>
          </Box>
        </Container>
      </Box>
      <Box sx={{
        flex: "1",
        overflow: "auto"
      }}>
        <Container fixed>
          <Grid container spacing={2}>
            <Grid item md={8}>
              <MessageList messages={orderedMessages}/>
            </Grid>
            <Grid item md={4}>
              <Box sx={{
                position: "sticky",
                top: "1em",
              }}>
                <SendForm
                  sendMessage={sendMessage}
                  nickname={nickname}
                  handleNicknameChange={handleNicknameChange}
                  message={message}
                  handleMessageChange={handleMessageChange}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
      <Box sx={{
        height: "15vh",
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        background: "linear-gradient(to bottom, transparent, white)",
        pointerEvents: "none"
      }}/>
    </Box>
  );
}

export default App;
