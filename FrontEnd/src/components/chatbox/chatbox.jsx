import React, { useState, useContext, useEffect, useRef } from 'react';
import './css/chatbox.css';
import $ from 'jquery';
import chatboxLogo from '../../assets/images/chatlogo.png';
import ChatWindow from './ChatWindow';
import chatWindowService from '../../services/chat-window.service.js';
import { AccessTokenContext } from '../../accessTokenContext';


const ChatBox = (props) => {
  const { accessToken, setAccessToken } = useContext(AccessTokenContext);
  const chatboxRef = useRef(null);
  const displayWindowRef = useRef(false);
  const hostNameRef = useRef('');

  const sendMessageToIframe = () => {
    let { chatbot: chatbotId } = props.match?.params ?? { chatbot: undefined }
    console.log(hostNameRef.current)
    // console.log(chatbotDetails, chatbotId);
    if (displayWindowRef.current) {
      window.parent.postMessage({ height: "530px", width: "450px" }, hostNameRef.current);
      chatboxRef.current.style.bottom = "0px";
    }
    else {
      setTimeout(() => {
        window.parent.postMessage({ height: "100px", width: "100px" }, hostNameRef.current)
        chatboxRef.current.style.bottom = "0px";
      }, 1000)
    }
  }

  useEffect(async () => {
    try {
      let { chatbot: chatbotId } = props.match?.params ?? { chatbot: undefined, }
      if (!chatbotId)
        chatbotId = sessionStorage.getItem('chatbot');
      const response = await chatWindowService.get(
        chatbotId,
        accessToken,
        setAccessToken
      );
      hostNameRef.current = response.data.chatbot.hostName;
    }
    catch (err) {
      console.log(err);
    }
  }, []);
  useEffect(async () => {
    $('.chats-box').toggle(0);
    $(function () {
      $('.minimize').on('click', function () {
        $('.chats-box').toggle(1000);
        displayWindowRef.current = !displayWindowRef.current;
        sendMessageToIframe();
      });
      $('.chatbox-popup').on('click', function () {
        $('.chats-box').toggle(1000);

        displayWindowRef.current = !displayWindowRef.current;
        sendMessageToIframe();
      });
    });
  }, []);
  return (
    <React.Fragment >
      <ChatWindow chatboxRef={chatboxRef} {...props} />
      <div className="chatbox-popup" >
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
