import { useEffect, useState, useMemo } from 'react';
import { TextField, Input } from '@material-ui/core';
import { w3cwebsocket as W3CWebSocket } from 'websocket';

import './styles.css';

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
        const time = new Date().toLocaleString();
        console.log(time);
        document.querySelector('#messages').innerHTML += `
          <div class='message-line' key='${time}'><div class='message-time'>(${time})</div> <b>${message.user}:</b> ${message.text}</div>
        `;
      }
      
    };

    client.onclose = () => {
      console.log('disconnected');
      setLogin('');
    };

  }, []);

  const keepScrollBotton = () => {
    // var
  }

  const onLogin = () => {
    const data = {
      user: userName,
      type: 'login',
    }
    client.send(JSON.stringify(data));
    setLogin(userName);
  }

  const onMessage = (ev) => {
    ev.preventDefault();

    const message = {
      type: "message",
      text: messageToSend,
    }
    client.send(JSON.stringify(message));
    setMessageToSend('');
  };

  return(
      !login ? 
        <>
          <label for='login'>Apelido</label>
          <input 
            required
            id='login' 
            type='text'
            value={userName}
            onChange={ev => setUsername(ev.target.value)} 
            defaultValue='Richard'
          />
          <button onClick={ev => onLogin()}>Entrar</button>
        </> 
      :
        <>
          <div id="container-messages">
            <div id="messages"></div>
            <div id="users">
              {users.map(user => <div key={user.user}>{user.user}</div>)}
            </div>
          </div>
          <form onSubmit={ev => onMessage(ev)}>
            <input
              className='input-text'
              fullWidth={true}
              margin="none"
              value={messageToSend} 
              onChange={ev => setMessageToSend(ev.target.value)} 
              type="text"
            />
            <button type='submit'>
              Enviar
            </button>
          </form>
        </>
  );
}