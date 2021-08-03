import { useEffect, useState, useMemo } from 'react';
import { Input, Button, TextField } from '@material-ui/core';
import { w3cwebsocket as W3CWebSocket } from 'websocket';

const URL = 'ws://localhost:8000';
const client = new W3CWebSocket(URL);

export default function RoomChat() {
  const [login, setLogin] = useState('');
  const [userName, setUsername] = useState('Richard');
  const [users, setUsers] = useState([1, 2,3 ]);
  const [messageToSend, setMessageToSend] = useState('');
  // const [messages, setMessages] = useState('');
  
  useEffect(() => {
    client.onopen = () => {
      console.log('WebSocket Client Connected');
    };
    
    client.onmessage = function(msg) {
      const dataFromServer = JSON.parse(msg.data);

      console.log('dataFromServer', dataFromServer);
     
      if(dataFromServer.type === 'usersList'){
        setUsers(dataFromServer.data);
      }

      if(dataFromServer.type === 'message'){
        const message = dataFromServer.data;
        if(message !== undefined) document.querySelector('#messages').innerHTML += `<div>${message}</div>`;
      }
      
    };

    

    client.onclose = () => {
      console.log('disconnected');
      setLogin('');
    };

  }, []);

  const onLogin = () => {
    const data = {
      user: userName,
      type: 'login',
    }
    client.send(JSON.stringify(data));
    setLogin(userName);
  }

  const onMessage = () => {
    const message = {
      type: "message",
      text: messageToSend,
    }
    client.send(JSON.stringify(message));
  };

  return(
      !login ? 
        <>
          <TextField 
            required 
            id="standard-required" 
            label="Apelido" 
            defaultValue="Richard" 
            value={userName}
            onChange={ev => setUsername(ev.target.value)}   
            variant="filled"
          />
          <Button onClick={ev => onLogin()}>Entrar</Button>
        </> 
      :
        <>
          <Input
            fullWidth={true}
            margin="none"
            value={messageToSend} 
            onChange={ev => setMessageToSend(ev.target.value)} 
            type="text"
          />
          <Button 
            onClick={ev => onMessage()} 
          >
            Enviar
          </Button>
          <div id="messages"></div>
          <hr />
          <div id="users">
            {users.map(user => <div key={user.user}>{user.user}</div>)}
          </div>
        </>
  );
}