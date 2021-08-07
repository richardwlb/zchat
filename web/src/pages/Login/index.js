import { useState } from 'react';
import { useHistory } from 'react-router-dom';

import './styles.css';

export default function Login() {
  const [userName, setUserName] = useState('');

  const history = useHistory();

  const onSubmit = (ev) => {
    ev.preventDefault();
    history.push('/chat', { login: userName});
  }

  return (
    <div className="login-container">
      <div className="login">
        <h2>Login</h2>
        <form onSubmit={(ev) => onSubmit(ev)}>
          <input 
            required
            id='login' 
            type='text'
            value={userName}
            onChange={ev => setUserName(ev.target.value)} 
            placeholder='Apelido'
          />
          <button type='submit'>Entrar</button>
        </form>
      </div>
    </div>
  )
}