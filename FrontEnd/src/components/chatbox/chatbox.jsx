import React, { useState, useContext, useEffect, useReducer } from 'react';
import './css/chatbox.css';
import $ from 'jquery';
import chatboxLogo from '../../assets/images/chatlogo.png';
import Messages from './Messages.jsx';
import ChatWindow from './ChatWindow';

const ChatBox = (props) => {

  const keyPress = (e) => {
    if (e.keyCode === 13) {
      this.sendMessage();
    }
  };

  const sendMessage = async () => {
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
      // let NLPResponse = await NLPService.post(chatbotId, message, hasFollowUp, followUp.previousIntent, accessToken, setAccessToken);
      // let { messages, cardResponse, chipResponse, hasFollowUp, previousIntent, } = NLPResponse.data;
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
      // if (cardResponse.length !== 0 || chipResponse.length !== 0) {
      //   textMessage.hasRichResponse = true;
      // }
      // messageStorage.push(textMessage);

      // setMessageStorage(messageStorage)

      // Sets hasFollowUp to true if the classifed intent has a follow up intent, else false

      // setFollowUp({ hasFollowUp, previousIntent });

      // document.getElementById("sendMessage").value = "";
      // let chatbox = document.querySelector(".chatbox-body");
      // chatbox.scrollTop = chatbox.scrollHeight - chatbox.clientHeight;
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(async () => {
    $('.chats-box').toggle(0);
    $(function () {
      $('.minimize').on('click', function () {
        $('.chats-box').toggle(1000);
      });
      $('.chatbox-popup').on('click', function () {
        $('.chats-box').toggle(1000);
      });
    });


  }, []);

  return (
    <React.Fragment>
      <ChatWindow />
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
    </React.Fragment>
  );
};

export default ChatBox;
