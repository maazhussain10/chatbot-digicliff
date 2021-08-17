import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Home } from './components/home/home'
import { AssistantPage } from './components/assistantPage/assistantPage';
import { Profile } from './components/assistantPage/profile';
import { IntentPage } from './components/intents/intentPage';
import { MessagesPage } from './components/insideIntent/messagesPage';
import { Documentation } from './components/home/documentaion';
import { Rich } from './components/insideIntent/richResponse';
import { Error } from './components/home/error';

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import { ChatBox } from './components/chatbox/chatbox';
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
                    <Route exact path='/assistant/:username/:assistantName/chatwidget' component={ChatBox} />
                    <Route exact path='/assistant/:username/:assistant/:intent' component={MessagesPage} />
                    <Route path='/assistant/:username/:assistant/:intent/rich' component={Rich} />
                    <Route path="*" component={Error} />
                </Switch>
            </Router>
        );
    }
}

export default App;


