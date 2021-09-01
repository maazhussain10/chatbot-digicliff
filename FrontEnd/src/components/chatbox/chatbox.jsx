import React, { useState, useEffect, useReducer } from 'react';;
import settingsService from '../../services/settings.service.js';
import chatbotService from '../../services/chatbot.service.js';
import ChatboxTop from './chatboxTop.jsx';
import './css/chatbox.css';
import $ from 'jquery';
import chatboxLogo from '../../assets/images/chatlogo.png'
const ChatBox = (props) => {

    const [chatbotDetails, setChatbotDetails] = useState([]);
    const [theme, setTheme] = useReducer(
        (state, newState) => ({ ...state, ...newState }),
        {
            cardBgColor: "", cardTextColor: "", cardBorder: "", cardFont: "",
            chipBgColor: "", chipTextColor: "", chipBorder: "", chipShape: "", chipFont: "",
            userTextBgcolor: "", userFont: "", userTextColor: "", botTextBgcolor: "", botFont: "", botTextColor: "",
            chatboxColor: "", chatboxFont: "", chatboxFontColor: "", sendMessageColor: ""
        }
    )

    useEffect(async () => {

        $(function () {
            $(".minimize").on("click", function () {
                $(".chats-box").toggle(1000);
            });
            $(".chatbox-popup").on("click", function () {
                $(".chats-box").toggle(1000);
            });
        });

        try {
            let chatbotId = sessionStorage.getItem('chatbot');
            const settingsResponse = await settingsService.get(chatbotId, accessToken, setAccessToken);
            const chatbotResponse = await chatbotService.getSingleBot(chatbotId, accessToken, setAccessToken);
            let chatbotDetails = chatbotResponse.data;
            let theme = settingsResponse.data;
            setTheme(theme)
            setChatbotDetails(chatbotDetail);
        } catch (err) {
            console.log(err);
        }
    }, []);

    return (
        <div>
            <div className="chats-box">
                <ChatboxTop
                    name={chatbotDetails.chatbotName}
                    description={chatbotDetails.description}
                    chatboxColor={theme.chatboxColor}
                    chatboxFont={theme.chatboxFont}
                    chatboxFontColor={theme.chatboxFontColor}
                    sendMessageColor={theme.sendMessageColor}
                />
                <div className="chatbox-body">
                    <div className="chat-conversion">
                        {/* {state.messageStorage.map((message) => (
                            <Message
                                messageObject={message}
                                key={message.messageId}
                                sendMessage={sendMessage}
                                theme={theme}
                            />
                        ))} */}
                    </div>
                    <div className="clearfix"></div>
                </div>
                <div className="chatbox-chat">
                    <div className="form-group">
                        <input
                            // onKeyDown={keyPress}
                            type="text"
                            className="form-control"
                            id="sendMessage"
                            placeholder="Type your message"
                        />
                        <i
                            className="fas fa-paper-plane"
                        // onClick={() => sendMessage()}
                        ></i>
                    </div>
                </div>
            </div>
            <div className="chatbox-popup">
                <div className="circle">
                    <span className="chatbox-click">
                        <img
                            src={chatboxLogo}
                            alt="Logo"
                            className="img-responsive center-block"
                        />
                    </span>
                </div>
            </div>
        </div>
    );
}

export default ChatBox;