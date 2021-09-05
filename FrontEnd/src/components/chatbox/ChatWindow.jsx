import React, {
  useState,
  useEffect,
  useReducer,
  useContext,
  useRef,
} from 'react';
import { AccessTokenContext } from '../../accessTokenContext.js';
import chatWindowService from '../../services/chat-window.service.js';
import TextareaAutosize from 'react-textarea-autosize';
import chatboxLogo from '../../assets/images/chatlogo.png';
import Messages from './Messages.jsx';

const ChatWindow = (props) => {
  const { accessToken, setAccessToken } = useContext(AccessTokenContext);
  const [message, setMessage] = useState('');
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

  const [chatbotDetails, setChatbotDetails] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      chatbot: undefined,
      theme: theme,
    }
  );

  const [messageStorage, setMessageStorage] = useState([]);

  const [followUp, setFollowUp] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      hasFollowUp: false,
      previousIntent: undefined,
    }
  );

  useEffect(() => {
    if (props.theme) setChatbotDetails({ theme: props.theme });
  }, [props.theme]);

  useEffect(() => {
    console.log(props.messageStorage);
    if (props.messageStorage) setMessageStorage(props.messageStorage);
  }, [props.messageStorage]);

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
    if (e.target.innerText) setMessage(e.target.innerText);
    e.preventDefault();
    let chatbotId = sessionStorage.getItem('chatbot');
    try {
      let userReply = {
        from: 'user',
        messages: [message],
        time: new Date()
          .toLocaleString()
          .split(',')[1]
          .replace(/(.*)\D\d+/, '$1')
          .trim(),
      };
      setMessageStorage((prevMessageStorage) => [
        ...prevMessageStorage,
        userReply,
      ]);
      let response = await chatWindowService.post(
        chatbotId,
        message,
        followUp.hasFollowUp,
        followUp.previousIntent,
        accessToken,
        setAccessToken
      );
      setMessage('');
      setFollowUp(response.data.nextIntent);
      let botReply = {
        from: 'bot',
        messages: response.data.messages,
        richResponses: response.data.richResponses,
        time: new Date()
          .toLocaleString()
          .split(',')[1]
          .replace(/(.*)\D\d+/, '$1')
          .trim(),
      };
      setMessageStorage((prevMessageStorage) => [
        ...prevMessageStorage,
        botReply,
      ]);
    } catch (err) {
      console.log(err);
    }
  };

  const handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      if (!e.shiftKey) {
        e.preventDefault();
        sendMessage(e);
      }
    }
  };

  return (
    <div>
      <div className="chats-box">
        <div
          className="chatbox-top"
          style={{ background: chatbotDetails.theme.chatboxColor }}
        >
          <div
            className="chatbox-profile"
            style={{ background: chatbotDetails.theme.chatboxColor }}
          >
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
              <div className="media-right">
                <p>
                  <span
                    style={{
                      color: chatbotDetails.theme.chatboxFontColor,
                      fontFamily: chatbotDetails.theme.chatboxFont,
                    }}
                  >
                    {chatbotDetails.chatbot?.chatbotName}
                  </span>
                </p>
                <h6
                  className="Online"
                  style={{
                    color: chatbotDetails.theme.chatboxFontColor,
                    fontFamily: chatbotDetails.theme.chatboxFont,
                    fontSize: '0.8rem',
                  }}
                >
                  {chatbotDetails.chatbot?.description}
                </h6>
              </div>
            </div>
            <div className="g-right">
              <p>
                <span className="minimize close"></span>
              </p>
            </div>
            <div className="clearfix"></div>
          </div>
        </div>
        <div className="chatbox-body">
          <div className="chat-conversion">
            {messageStorage.map((message, index) => (
              <React.Fragment key={index}>
                <Messages
                  messageObject={message}
                  followUp={followUp}
                  sendMessage={sendMessage}
                  theme={chatbotDetails.theme}
                />
              </React.Fragment>
            ))}
          </div>
          <div className="clearfix"></div>
        </div>
        <div className="chatbox-chat">
          <form className="form-group" onSubmit={sendMessage}>
            <TextareaAutosize
              style={{ resize: 'none', wordWrap: 'break-word' }}
              onChange={(e) => {
                setMessage(e.target.value);
              }}
              onKeyDown={handleKeyDown}
              value={message}
              type="text"
              className="form-control"
              id="sendMessage"
              placeholder="Type your message"
            />
            <i
              className="fas fa-paper-plane"
              style={{ color: chatbotDetails.theme.sendMessageColor }}
              onClick={sendMessage}
            ></i>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
