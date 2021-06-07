import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Home } from './home/home'
import { AssistantPage } from './assistantPage/assistantPage';
import { Profile } from './assistantPage/profile';
import { IntentPage } from './intents/intentPage';
import { MessagesPage } from './insideIntent/messagesPage';
import { Documentation } from './home/documentaion';
import { Rich } from './insideIntent/richResponse';
import { Error } from './home/error';
class App extends Component {
  state = {}
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path='/' component={Home} />
          <Route exact path='/docs' component={Documentation} />
          <Route exact path='/:username/profile' component={Profile} />
          <Route exact path='/assistant/:username' component={AssistantPage} />
          <Route exact path='/assistant/:username/:assistant' component={IntentPage} />
          <Route exact path='/assistant/:username/:assistant/:intent' component={MessagesPage} />
          <Route path='/assistant/:username/:assistant/:intent/rich' component={Rich} />
          <Route path="*" component={Error} />
        </Switch>
      </Router>
    );
  }
}

export default App;


