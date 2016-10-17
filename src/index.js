import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

import App from './components/App';
import Login from './components/Login';
import All from './components/All';
import Messages from './components/Messages';
import Profile from './components/Profile';
import Signup from './components/Signup';

import './index.css';

ReactDOM.render(
  <Router history={browserHistory}>
    <Route path='/' component={App}> 
      <IndexRoute component={Login} />
      <Route path="/signup" component={Signup} />
      <Route path="/all" component={All} /> 
      <Route path="/messages" component={Messages} />
      <Route path="/profile" component={Profile} /> 
    </Route>
  </Router>,
  document.getElementById('root')
);
