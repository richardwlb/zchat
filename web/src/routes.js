import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Login from './pages/Login';
import RoomChat from './pages/RoomChat';

export default function Routes() {
  return(
    <BrowserRouter>
      <Switch>
        <Route path='/' exact component={Login} />
        <Route path='/chat' component={RoomChat}/>
      </Switch>
    </BrowserRouter>
  )
}