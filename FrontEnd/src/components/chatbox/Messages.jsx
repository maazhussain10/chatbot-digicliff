import React, { useState } from 'react';
import MessageIcon from './MessageIcon';
import Card from './richResponses/Card'
import Chip from './richResponses/Chip'
function RichResponse(props) {
  const { cardMessage, chipMessage, sendMessage, theme } = props;

  if (cardMessage.length >= 1) {
    return <Card cards={cardMessage} theme={theme} />;
  }

  if (chipMessage.length >= 1) {
    return (
      <div className="m-option">
        {chipMessage.map((chip, index) => (
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
  const { from, messages, time, cardMessage, chipMessage } = messageObject;
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
            <span
              className="text"
              style={{
                color: userTextColor,
                fontFamily: userFont,
              }}
            >
              {messages[0]}
            </span>
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
          {(() => {
            if (messages.length !== 0) {
              return (
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
                            <span
                              key={index}
                              style={{
                                color: botTextColor,
                                fontFamily: botFont,
                              }}
                              className="text"
                            >
                              {message}
                            </span>
                          </div>
                        </React.Fragment>
                      )}
                    </div>
                  ))}
                  {load[load.length - 1] ? null : (
                    <RichResponse
                      cardMessage={cardMessage}
                      chipMessage={chipMessage}
                      sendMessage={sendMessage}
                      theme={props.theme}
                    />
                  )}
                  {load[load.length - 1] ? null : (
                    <span className="time">{time}</span>
                  )}
                </React.Fragment>
              );
            }
          })()}
        </div>
      </div>
    );
  }
};

export default Messages;
