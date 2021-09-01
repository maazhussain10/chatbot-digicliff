import React, { useState, useContext,useEffect, useReducer } from 'react';
import settingsService from '../../services/settings.service.js';
import chatbotService from '../../services/chatbot.service.js';
import { AccessTokenContext } from '../../accessTokenContext';
import ChatboxTop from './ChatboxTop.jsx';
import './css/chatbox.css';
import $ from 'jquery';
import chatboxLogo from '../../assets/images/chatlogo.png';
import NLPService from '../../services/NLP.service.js';
import Messages from './Messages.jsx';

const ChatBox = (props) => {

    const { accessToken, setAccessToken } = useContext(AccessTokenContext);

    const [chatbotDetails, setChatbotDetails] = useState([]);
    const [messageStorage, setMessageStorage] = useState([]);
    const [hasFollowUp, setHasFollowUp] = useState(false)
    const [previousIntent, setPreviousIntent] = useState(null)

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

  const keyPress = (e) => {
    if (e.keyCode === 13) {
      this.sendMessage();
    }
  };

  const sendMessage = async() => {
    let message;
    if (chipMessage) {
        message = chipMessage;
    } else {
        message = document.getElementById("sendMessage").value;
    }

    try {
        let userMessage = {
            from: "user",
            type: "text",
            messages: [message],
            messageId: messageStorage.length + 1,
            time: new Date()
                .toLocaleString()
                .split(",")[1]
                .replace(/(.*)\D\d+/, "$1"),
        };
        messageStorage.push(userMessage);

        // Once Hosted get Id from URL
        const chatbotId = sessionStorage.getItem('chatbot');
        let NLPResponse = await NLPService.post(chatbotId, message, hasFollowUp, previousIntent, accessToken, setAccessToken);
        let { messages, cardResponse, chipResponse, hasFollowUp, previousIntent, } = NLPResponse.data;
        let textMessage = {
            from: "bot",
            type: "text",
            messages: messages,
            messageId: messageStorage.length + 1,
            hasRichResponse: false,
            cardMessage: cardResponse,
            chipMessage: chipResponse,
            time: new Date()
                .toLocaleString()
                .split(",")[1]
                .replace(/(.*)\D\d+/, "$1"),
        };
        if (cardResponse.length !== 0 || chipResponse.length !== 0) {
            textMessage.hasRichResponse = true;
        }
        messageStorage.push(textMessage);

        setMessageStorage(messageStorage)

        // Sets hasFollowUp to true if the classifed intent has a follow up intent, else false
        if (hasFollowUp === true) {
            setHasFollowUp(true);
            setPreviousIntent(previousIntent)
        } else {
            setHasFollowUp(false);
        }
        document.getElementById("sendMessage").value = "";
        let chatbox = document.querySelector(".chatbox-body");
        chatbox.scrollTop = chatbox.scrollHeight - chatbox.clientHeight;
    } catch (e) {
        console.log(e);
    }
};

  useEffect(async () => {
    $(function () {
      $('.minimize').on('click', function () {
        $('.chats-box').toggle(1000);
      });
      $('.chatbox-popup').on('click', function () {
        $('.chats-box').toggle(1000);
      });
    });

    try {
      let chatbotId = sessionStorage.getItem('chatbot');
      const settingsResponse = await settingsService.get(
        chatbotId,
        accessToken,
        setAccessToken
      );
      const chatbotResponse = await chatbotService.getSingleBot(
        chatbotId,
        accessToken,
        setAccessToken
      );
      let chatbotDetail = chatbotResponse.data;
      let theme = settingsResponse.data;
      setTheme(theme);
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
        />
        <div className="chatbox-body">
          <div className="chat-conversion">
            {messageStorage.map((message) => (
              <Messages
                messageObject={message}
                key={message.messageId}
                sendMessage={sendMessage}
                theme={theme}
              />
            ))}
          </div>
          <div className="clearfix"></div>
        </div>
        <div className="chatbox-chat">
          <div className="form-group">
            <input
              onKeyDown={keyPress}
              type="text"
              className="form-control"
              id="sendMessage"
              placeholder="Type your message"
            />
            <i className="fas fa-paper-plane" style={{color: theme.sendMessageColor}} onClick={() => sendMessage}></i>
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
};

export default ChatBox;
