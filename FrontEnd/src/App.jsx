import React, { useState, useMemo } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { AccessTokenContext } from './accessTokenContext';
import Home from './components/pages/Home';
import Dashboard from './components/pages/Dashboard';
import Intents from './components/pages/Intents';
import Profile from './components/pages/Profile';
import Messages from './components/pages/Messages';
import RichResponses from './components/message/RichResponses';
import Settings from './components/pages/Settings';
import Stats from './components/pages/Stats';
import PrivateRoute from './components/common/PrivateRoute';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import ChatBox from './components/chatbox/Chatbox';

const App = () => {
  const [accessToken, setAccessToken] = useState(undefined);

  const value = useMemo(
    () => ({ accessToken, setAccessToken }),
    [accessToken, setAccessToken]
  );

  return (
    <Router>
      <AccessTokenContext.Provider value={value}>
        <Switch>
          <Route exact path="/" component={Home} />
          <PrivateRoute exact path="/profile" component={Profile} />
          <PrivateRoute exact path="/stats" component={Stats} />
          <PrivateRoute exact path="/dashboard" component={Dashboard} />
          <PrivateRoute exact path="/dashboard/settings" component={Settings} />
          <PrivateRoute exact path="/dashboard/intent" component={Intents} />
          <PrivateRoute
            exact
            path="/dashboard/intent/messages"
            component={Messages}
          />
          <PrivateRoute
            exact
            path="/dashboard/intent/rich-responses"
            component={RichResponses}
          />
          <Route exact path="/:chatbot/" component={ChatBox} />
        </Switch>
      </AccessTokenContext.Provider>
    </Router>
  );
};

export default App;
