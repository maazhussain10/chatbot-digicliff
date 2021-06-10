import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { ChatboxTop } from './chatboxTop';
import { Message } from './message';
import assistantLogo from '../images/chatbots-logo-white.png'
import 'font-awesome/css/font-awesome.min.css';
import './css/chatbox.css';

import axios from 'axios';
import $ from 'jquery';



class ChatBox extends Component {
    state = {
        sendMessageValidation: {
            message: "",
            isCorrect: null,
        },
        messageStorage: [],
        hasFollowUp: false,
        previousIntent: null,
        settings: {
            cardTheme: {
                cardBgColor: "",
                cardTextColor: "",
                cardBorder: "",
                cardFont: "",
            },
            chipTheme: {
                chipBgColor: "",
                chipTextColor: "",
                chipBorder: "",
                chipShape: "",
                chipFont: "",
            },
            chatBoxTheme: {
                userBg: "",
                userFont: "",
                userColor: "",
                assistantBg: "",
                assistantFont: "",
                assistantColor: "",
                chatBoxColor: "",
            }
        },
    }
    componentDidMount() {
        $(function () {
            $(".minimize").on("click", function () {
                $(".chats-box").toggle(1000);
            });
            $(".chatbox-popup").on("click", function () {
                $(".chats-box").toggle(1000);
            });
        });

        this.getSettings();
    }
    componentWillUnmount() {
        this._isMounted = false;
    }


    sendMessage = (chipMessage) => {
        let message;
        if (chipMessage) {
            message = chipMessage;
        } else {
            message = document.getElementById('sendMessage').value;
        }
        try {
            const { messageStorage, hasFollowUp, previousIntent } = this.state
            let userMessage = {
                from: 'user',
                type: 'text',
                messages: [message],
                messageId: messageStorage.length + 1,
                time: new Date().toLocaleString().split(',')[1].replace(/(.*)\D\d+/, '$1')
            }
            messageStorage.push(userMessage);
            let { username } = JSON.parse(sessionStorage.getItem('userDetails'));

            const { assistantName } = this.props;

            axios({
                method: 'post',
                url: 'http://localhost:5000/nlp',
                params: {
                    sendMessage: message,
                    username: username,
                    assistantName: assistantName,
                    hasFollowUp: hasFollowUp,
                    previousIntent: previousIntent,
                },

            }).then((response) => {
                let { messages, cardResponse, chipResponse, hasFollowUp, previousIntent } = response.data;
                let textMessage = {
                    from: 'bot',
                    type: 'text',
                    messages: messages,
                    messageId: messageStorage.length + 1,
                    hasRichResponse: false,
                    cardMessage: cardResponse,
                    chipMessage: chipResponse,
                    time: new Date().toLocaleString().split(',')[1].replace(/(.*)\D\d+/, '$1')
                }

                if (cardResponse.length !== 0 || chipResponse.length !== 0) {
                    textMessage.hasRichResponse = true;
                }
                messageStorage.push(textMessage);

                this.setState({
                    messageStorage: messageStorage,
                });

                // Sets hasFollowUp to true if the classifed intent has a follow up intent, else false
                if (hasFollowUp === true) {
                    this.setState({ hasFollowUp: true });
                    this.setState({ previousIntent: previousIntent })
                }
                else {
                    this.setState({ hasFollowUp: false });
                }
                document.getElementById("sendMessage").value = "";
                let chatbox = document.querySelector('.chatbox-body');
                chatbox.scrollTop = chatbox.scrollHeight - chatbox.clientHeight;
            });
        }
        catch (e) {
            console.log(e);
        }
    }

    getSettings = () => {
        // Get the necessary details ( username, assistantName )
        let { username } = JSON.parse(sessionStorage.getItem('userDetails'));
        let { assistantName } = JSON.parse(sessionStorage.getItem('assistantDetails'));
        try {
            axios({
                method: 'get',
                url: 'http://localhost:5000/settings',
                params: {
                    username: username,
                    assistantName: assistantName
                },

            }).then((response) => {
                const { chatBoxSettings } = response.data;
                this.setState({ settings: chatBoxSettings });
            });
        }
        catch (e) {
            console.log(e);
        }
    }


    keyPress = (e) => {
        if (e.keyCode === 13) {
            this.sendMessage();
        }
    }


    render() {
        const { assistantName, description } = this.props;
        const { cardTheme, chipTheme, chatBoxTheme } = this.state.settings;
        return (
            <div>
                <div className="chats-box">
                    <ChatboxTop
                        name={assistantName.slice(0, -5)}
                        description={description}
                        chatBoxColor={chatBoxTheme.chatBoxColor} />
                    <div className="chatbox-body">
                        <div className="chat-conversion">
                            {this.state.messageStorage.map(message => (
                                <Message
                                    messageObject={message} key={message.messageId}
                                    sendMessage={this.sendMessage}
                                    chipTheme={chipTheme}
                                    cardTheme={cardTheme}
                                    chatBoxTheme={chatBoxTheme} />
                            ))
                            }
                        </div >
                        <div className="clearfix"></div>
                    </div>
                    <div className="chatbox-chat">
                        <div className="form-group">
                            <input
                                onKeyDown={this.keyPress}
                                type="text"
                                className="form-control"
                                id="sendMessage"
                                placeholder="Type your message" />
                            <i className="fas fa-paper-plane" onClick={() => this.sendMessage()}></i>

                        </div>

                    </div>

                </div>
                <div className="chatbox-popup">
                    <div className="circle">
                        <span className="chatbox-click" >
                            <img src={assistantLogo} alt="Logo" className="img-responsive center-block" />
                        </span>
                    </div>
                </div>
            </div>
        );
    }
}

export { ChatBox };