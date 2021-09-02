import React, { useState, useEffect, useReducer, useContext } from 'react';
import { AccessTokenContext } from '../../accessTokenContext.js';
import chatWindowService from '../../services/chat-window.service.js';

import chatboxLogo from '../../assets/images/chatlogo.png';

const ChatWindow = () => {
    const { accessToken, setAccessToken } = useContext(AccessTokenContext);
    const [message, setMessage] = useState();

    // const [chatbotDetails, setChatbotDetails] = useState([]);
    const [theme, setTheme] = useReducer(
        (state, newState) => ({ ...state, ...newState }),
        {
            cardBgColor: '',
            cardTextColor: '',
            cardBorder: '',
            cardFont: '',
            chipBgColor: '',
            chipTextColor: '',
            chipBorder: '',
            chipShape: '',
            chipFont: '',
            userTextBgcolor: '',
            userFont: '',
            userTextColor: '',
            botTextBgcolor: '',
            botFont: '',
            botTextColor: '',
            chatboxColor: '',
            chatboxFont: '',
            chatboxFontColor: '',
            sendMessageColor: '',
        }
    );
    const [messageStorage, setMessageStorage] = useState([]);
    const [chatbotDetails, setChatbotDetails] = useReducer(
        (state, newState) => ({ ...state, ...newState }),
        {
            chatbot: undefined, theme: theme
        }
    )
    const [followUp, setFollowUp] = useReducer(
        (state, newState) => ({ ...state, ...newState }),
        {
            hasFollowUp: false, previousIntent: undefined
        }
    )

    useEffect(async () => {

        try {
            let chatbotId = sessionStorage.getItem('chatbot');
            const response = await chatWindowService.get(
                chatbotId,
                accessToken,
                setAccessToken
            );
            setChatbotDetails(response.data);
        } catch (err) {
            console.log(err);
        }
    }, []);

    const sendMessage = async (e) => {
        e.preventDefault();
        let chatbotId = sessionStorage.getItem('chatbot');
        try {
            let response = await chatWindowService.post(chatbotId, message, followUp.hasFollowUp, followUp.previousIntent, accessToken, setAccessToken);
        } catch (err) {
            console.log(err);
        }

    }
    return (<div>
        <div className="chats-box">
            <div className="chatbox-top" style={{ background: chatbotDetails.theme.chatboxColor }}>
                <div className="chatbox-profile" style={{ background: chatbotDetails.theme.chatboxColor }} >
                    <div className="g-left">
                        <div className="media-left">
                            <div className="g-circle">
                                <img
                                    src={chatboxLogo}
                                    alt="Logo"
                                    className="img-responsive center-block"
                                    id="inner-logo"
                                />
                            </div>
                        </div>
                        <div className="media-right" >
                            <p>
                                <span style={{ color: chatbotDetails.theme.chatboxFontColor, fontFamily: chatbotDetails.theme.chatboxFont, }}>{chatbotDetails.chatbot?.chatbotName}</span>
                            </p>
                            <h6 className="Online" style={{ color: chatbotDetails.theme.chatboxFontColor, fontFamily: chatbotDetails.theme.chatboxFont, fontSize: "0.8rem" }}>{chatbotDetails.chatbot?.description}</h6>
                        </div>
                    </div>
                    <div className="g-right">
                        <p>
                            <span className="minimize close"></span>
                        </p>
                    </div>
                    <div className="clearfix"></div>
                </div>
            </div >
            <div className="chatbox-body">
                <div className="chat-conversion">
                    {messageStorage.map((message) => (
                        <Messages
                            messageObject={message}
                            key={message.messageId}
                            sendMessage={sendMessage}
                            theme={chatbotDetails.theme}
                        />
                    ))}
                </div>
                <div className="clearfix"></div>
            </div>
            <div className="chatbox-chat">
                <form className="form-group" onSubmit={sendMessage}>
                    <input
                        onChange={(e) => { setMessage(e.target.value) }}
                        value={message}
                        type="text"
                        className="form-control"
                        id="sendMessage"
                        placeholder="Type your message"
                    />
                    <i className="fas fa-paper-plane" style={{ color: chatbotDetails.theme.sendMessageColor }} onClick={() => sendMessage}></i>
                </form>
            </div>
        </div>
    </div>
    );
}

export default ChatWindow;