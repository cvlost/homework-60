import React, {FormEvent, useEffect, useRef, useState} from 'react';
import './App.css';
import {Button, FormControl, Input, InputLabel, TextareaAutosize} from "@mui/material";


type Message = {
  message: string,
  author: string,
  datetime: string,
  _id: string
};

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
  const intervalId = useRef<null | number>(null);
  const param = useRef<string>('');

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  }

  const changeMessageLayout = () => {
    setIsNewFirst(prev => !prev);
    console.log('New first: ', isNewFirst);
  };

  const sendMessage = async (e: FormEvent) => {
    console.log('submitted')
    e.preventDefault();
    const data = new URLSearchParams();
    data.set('message', message);
    data.set('author', nickname);
    await fetch(messagesUrl, {
      method: 'post',
      body: data,
    });

    setMessage('');
  };

  const getMessages = async (url: string) => {
    const messages: Message[] = await request(url);
    if (messages.length) param.current = `?datetime=${messages[messages.length - 1].datetime}`;
    setMessages(prev => [...prev, ...messages]);
  };

  const autoRefresh = () => {
    intervalId.current = window.setInterval(async () => {
      console.log(messagesUrl + param.current);
      getMessages(messagesUrl + param.current).catch(console.error);
    }, 2500);
  };

  useEffect(() => {
    getMessages(messagesUrl).catch(console.error);
    autoRefresh();
  }, []);

  const renderMessage = (message: Message) => {
    const date = new Date(message.datetime);
    const dateString = date.toLocaleTimeString() + ' ' + date.toLocaleDateString();
    return (
      <div key={message._id} className="message">
        <div className="message-header">
          <span>From</span> {message.author}
        </div>
        <div className="message-body">{message.message}</div>
        <div className="message-footer"><span>Date: </span>{dateString}</div>
      </div>
    );
  }

  return (
    <div className="App">
      <div className="App-header">
        <div className="container">
          <h1>Chat</h1>
          <div className="options">
            <label htmlFor="setting-show-new">New messages first</label>
            <input type="checkbox" id="setting-show-new" checked={isNewFirst} onChange={changeMessageLayout}/>
          </div>
        </div>
      </div>
      <div className="App-main">
        <div className="container">
          <div className="messages">
            {!isNewFirst ? messages.map(renderMessage) : [...messages].reverse().map(renderMessage)}
          </div>
          <div className="sidebar">
            <form onSubmit={sendMessage}>
              <FormControl>
                <InputLabel htmlFor="nickname">Nickname</InputLabel>
                <Input id="nickname" value={nickname} onChange={handleNicknameChange}/>
                <TextareaAutosize placeholder="Message here..." value={message} onChange={handleMessageChange}/>
                <Button type="submit">Send</Button>
              </FormControl>
            </form>
          </div>
        </div>
      </div>
      <div className="App-footer">
        <div className="container">
          footer
        </div>
      </div>
    </div>
  );
}

export default App;
