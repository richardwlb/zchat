import { useEffect, useState } from 'react';
import { w3cwebsocket as W3CWebSocket } from 'websocket';
import { useHistory } from 'react-router-dom';

import './styles.css';

const URL = 'ws://localhost:8000';
const client = new W3CWebSocket(URL);

export default function RoomChat( props ) {
  const [users, setUsers] = useState([1, 2,3 ]);
  const [messageToSend, setMessageToSend] = useState('');
  const history = useHistory();

  const connect = () => {
    client.onopen = () => {
      console.log('WebSocket Client Connected');
    };

    doLogin();
    
    client.onmessage = function(msg) {
      const dataFromServer = JSON.parse(msg.data);

      if(dataFromServer.type === 'usersList'){
        setUsers(dataFromServer.data);
      }

      if(dataFromServer.type === 'message'){
        const message = dataFromServer.data;
        const time = new Date().toLocaleString();

        document.querySelector('#messages').innerHTML += `
          <div class='message-line' key='${time}'>
            <div class='message-time'>(${time})</div> 
              <b>${message.user}:</b> ${message.text}
          </div>
        `;
      }
    };
  }
 
  const doLogin = () => {
    const { login } = props.location.state;
    const data = {
      user: login,
      type: 'login',
    }
    client.send(JSON.stringify(data));
  }

  useEffect(() => {
    if(client.readyState === 1) {
      connect();
    }
    client.onclose = () => {
      console.log('disconnected');
    };
  }, []);

  const onMessage = (ev) => {
    ev.preventDefault();

    const message = {
      type: "message",
      text: messageToSend,
    }
    client.send(JSON.stringify(message));
    setMessageToSend('');
  };

  const handleClose = () => {
    client.close();
    window.location = '/';
  }

  return(
    client.readyState !== 1 ? 
      <>
        Error.
        {
          history.push('/', { message: 'An error has ocurred. Please try again'})
          }
      </>
    :
      <>
        <nav id='navbar-chatroom' >
          <button className='button-sair' onClick={() => handleClose()} >Sair</button>
        </nav>
        <div id="container-messages">
        <div id="messages" />
          <div id="users">
            {users.map(user => <div key={user.user}>{user.user}</div>)}
          </div>
        </div>
        <form onSubmit={ev => onMessage(ev)}>
          <input
            className='input-text'
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