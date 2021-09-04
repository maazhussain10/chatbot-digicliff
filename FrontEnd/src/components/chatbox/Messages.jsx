import React, { useState } from 'react';
import Card from './richResponses/Card'
import Chip from './richResponses/Chip'
import chatboxLogo from '../../assets/images/chatbots-logo-white.png';

const MessageIcon = (props) => {
  const visibility = () => {
    let className = 'circle';
    if (props.invisible) {
      className += 'invisible';
    }
    return className;
  };

  return (
    <div className="media-left">
      <div className={visibility()}>
        <img
          src={chatboxLogo}
          alt="Logo"
          className="img-responsive center-block"
        />
      </div>
    </div>
  );
};

function RichResponse(props) {
  const { richResponses, sendMessage, theme } = props;
  console.log("AVDV", richResponses.cards);
  if (richResponses.type === "card") {
    return <Card cards={richResponses.cards} theme={theme} />;
  }

  if (richResponses.type === "chip") {
    return (
      <div className="m-option">
        {richResponses.chips.map((chip, index) => (
          <Chip
            key={index}
            chip={chip}
            sendMessage={sendMessage}
            theme={theme}
          />
        ))}
      </div>
    );
  }

  return <span></span>;
}

const Messages = (props) => {
  const [load, setLoad] = useState([]);

  const sleepTime = (index) => {
    let { duration } = props;
    if (duration !== 0) {
      duration = 2000;
    }
    setTimeout(() => {
      let { load } = state;
      load[index] = false;
      setLoad({ load });
      let chatbox = document.querySelector('.chatbox-body');
      chatbox.scrollTop = chatbox.scrollHeight - chatbox.clientHeight;
    }, duration);
  };

  const { sendMessage, messageObject } = props;
  const { messages, time, from, richResponses } = messageObject;
  const {
    userTextBgcolor,
    userFont,
    userTextColor,
    botTextBgcolor,
    botFont,
    botTextColor
  } = props.theme;

  if (from === 'user') {
    return (
      <div>
        <div className="chatbox-sender">
          <div className="s-content" style={{ backgroundColor: userTextBgcolor }}>
            <pre
              className="text"
              style={{
                color: userTextColor,
                fontFamily: userFont,
                whiteSpace: "pre-wrap",
                margin: "0px",
                wordWrap: "break-word"

              }}
            >
              {messages[0].trim()}
            </pre>
          </div>
          <span className="time">{time}</span>
        </div>
        <div className="clearfix"></div>
      </div>
    );
  } else if (from === 'bot') {
    return (
      <div className="chat-reciever">
        <MessageIcon />
        <div className="media-left"></div>
        <div className="media-right">
          {/* Bot's Text Reply */}
          {messages.length !== 0 ?
            <React.Fragment>
              {messages.map((message, index) => (
                <div key={index} className="chat-conversion">
                  {load[index] ? (
                    <div className="reciever-load">
                      <h1 className="load-dot first">
                        <span></span>
                      </h1>
                      <h1 className="load-dot second">
                        <span></span>
                      </h1>
                      <h1 className="load-dot third">
                        <span></span>
                      </h1>
                      <h1 className="load-dot fourth">
                        <span></span>
                      </h1>
                      {sleepTime(index)}
                    </div>
                  ) : (
                    <React.Fragment>
                      <div
                        className="n-content"
                        style={{
                          backgroundColor: botTextBgcolor,
                        }}
                      >
                        <pre
                          key={index}
                          style={{
                            color: botTextColor,
                            fontFamily: botFont,
                            whiteSpace: "pre-wrap",
                            margin: "0px",
                            wordWrap: "break-word"
                          }}
                          className="text"
                        >
                          {message.trim()}
                        </pre>
                      </div>
                    </React.Fragment>
                  )}
                </div>

              ))}
              {richResponses?.type === "cards" ?

                <Card Card cards={richResponses.cards} theme={props.theme} />
                :
                richResponses?.type === "chips" ?
                  <Chip chips={richResponses.chips}
                    sendMessage={sendMessage}
                    theme={props.theme} />
                  : null
              }

              {load[load.length - 1] ? null : (
                <span className="time">{time}</span>
              )}
            </React.Fragment>
            : null}
        </div>
      </div>
    );
  }
};

export default Messages;
