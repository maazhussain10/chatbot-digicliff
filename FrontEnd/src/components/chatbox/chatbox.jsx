import React, { useState, useContext, useEffect, useReducer, useRef } from 'react';
import './css/chatbox.css';
import $ from 'jquery';
import chatboxLogo from '../../assets/images/chatlogo.png';
import Messages from './Messages.jsx';
import ChatWindow from './ChatWindow';

const ChatBox = (props) => {
  const chatboxRef = useRef(null);
  const displayWindowRef = useRef(false);

  const sendMessageToIframe = () => {
    console.log("Frame", displayWindowRef.current);
    if (displayWindowRef.current) {
      window.parent.postMessage({ height: "530px", width: "450px" }, "http://127.0.0.1:5500")
      chatboxRef.current.style.bottom = "0px";
    }
    else {
      setTimeout(() => {
        window.parent.postMessage({ height: "100px", width: "100px" }, "http://127.0.0.1:5500")
        chatboxRef.current.style.bottom = "0px";
      }, 1000)
    }
  }

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
    <React.Fragment>
      <ChatWindow chatboxRef={chatboxRef} {...props} />
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
