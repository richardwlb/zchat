import { BrowserRouter, Route,  } from 'react-router-dom';
import Login from './pages/Login';
import RoomChat from './pages/RoomChat';

export default function Routes() {
  return(
    <BrowserRouter>
      <Route component={Login} path='/' exact />
      <Route component={RoomChat} path='/chat' exact />
    </BrowserRouter>
  )
}