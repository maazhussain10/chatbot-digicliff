import React, { Component } from 'react';
import { Navbar } from './navbar'
import { CreateTrainingPhrase } from './createTraining';
import { UserMessage } from './userMessage'
import { BotReply } from './botReply'
import './css/buttonalign.css'
import { CreateBotReply } from './createBotReply';
import axios from 'axios';
import { ChatBox } from '../chatbox/chatbox';
class MessagesPage extends Component {
    state = {
        messages: [],
        userMessages: [],
        botReplies: [],
    }

    componentDidMount = () => {
        this.getMessages();
    }

    getMessages = () => {
        // Get the necessary details ( intentName )
        let { username } = JSON.parse(sessionStorage.getItem('userDetails'));
        let { assistantName } = JSON.parse(sessionStorage.getItem('assistantDetails'));
        let { intentName } = JSON.parse(sessionStorage.getItem('intentDetails'));

        // Make a get request to the express server( messages.js ) to get the messages in the intent.
        try {
            axios({
                method: 'get',
                url: 'http://localhost:5000/message',
                params: {
                    username: username,
                    assistantName:assistantName,
                    intentName: intentName,
                },

            }).then((response) => {
                let { messages, userMessages, botReplies } = response.data;
                this.setState({ messages: messages, userMessages: userMessages, botReplies: botReplies });

            });
        }
        catch (e) {
            console.log(e);
        }
    }

    multipleReplyChange = (e) => {
        let multipleReply = document.getElementById('multipleBotReply').checked;
        // Get the necessary details ( intentName )
        let { username } = JSON.parse(sessionStorage.getItem('userDetails'));
        let { assistantName } = JSON.parse(sessionStorage.getItem('assistantDetails'));
        let { intentName } = JSON.parse(sessionStorage.getItem('intentDetails'));
        try {
            axios({
                method: 'get',
                url: 'http://localhost:5000/intent/multiple-reply',
                params: {
                    username: username,
                    assistantName:assistantName,
                    intentName: intentName,
                    multipleReply: multipleReply,
                },

            })
        }
        catch (e) {
            console.log(e);
        }
    }

    render() {
        let { botReplies, userMessages } = this.state;
        let { assistantName, description } = JSON.parse(sessionStorage.getItem('assistantDetails'));
        let messages;
        if (userMessages.length > botReplies.length) {
            messages = userMessages;
        } else {
            messages = botReplies;
        }
        return (
            <React.Fragment>
                <Navbar />
                <div className="container">
                    <button className="btn btn-primary button" type="button" data-toggle="collapse" data-target="#createTraining" aria-expanded="false" aria-controls="collapseExample">
                        Add training phrase / Response
                </button>
                    <div className="row text-center">
                        <div className="col-md-6">
                            <CreateTrainingPhrase getMessages={this.getMessages} />
                        </div>
                        <div className="col-md-6">
                            <CreateBotReply getMessages={this.getMessages} />
                        </div>
                    </div>
                    < div className="row text-center">
                        <div className="col-md-6">
                            <h5> User Message </h5>
                        </div>
                        <div className="col-md-6">
                            <h5> Bot Reply </h5>
                            <div onChange={this.multipleReplyChange} className="custom-control custom-switch">
                                <input type="checkbox" className="custom-control-input" id="multipleBotReply" />
                                <label className="custom-control-label" htmlFor="multipleBotReply" >Multiple replies</label>
                            </div>
                        </div>
                    </div>
                    <br />
                    {/* Implement map func here */}
                    {messages.map((_, index) => (
                        <React.Fragment key={index}>
                            < div className="row text-center">
                                <div className="col-md-6">
                                    <UserMessage
                                        getMessages={this.getMessages}
                                        userMessage={userMessages[index]} />
                                </div>
                                <div className="col-md-6">
                                    <BotReply
                                        getMessages={this.getMessages}
                                        botReply={botReplies[index]}
                                    />
                                </div>
                            </div>
                        </React.Fragment>
                    ))}

                </div>
                <ChatBox
                    assistantName={assistantName}
                    description={description} />
            </React.Fragment >
        );
    }
}

export { MessagesPage };