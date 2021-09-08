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
  const chatboxRef = useRef(null);
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


    // document.body.style.overflow = "hidden";
    document.body.style.background = "transparent";
    try {
      let { chatbot: chatbotId } = props.match?.params ?? { chatbot: undefined }
      if (!chatbotId)
        chatbotId = sessionStorage.getItem('chatbot');
      console.log(chatbotId);
      const response = await chatWindowService.get(
        chatbotId,
        accessToken,
        setAccessToken
      );
      setChatbotDetails(response.data);
      let botReply = {
        from: 'bot',
        messages: [response.data.chatbot.description],
        richResponses: [],
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
  }, []);

  const sendMessage = async (e) => {
    let messageToBeSent = message;
    if (e.target.innerText)
      messageToBeSent = e.target.innerText;

    e.preventDefault();
    console.log("sending", followUp)
    let { chatbot: chatbotId } = props.match?.params ?? { chatbot: undefined }
    if (!chatbotId)
      chatbotId = sessionStorage.getItem('chatbot');

    try {
      let userReply = {
        from: 'user',
        messages: [messageToBeSent],
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
        messageToBeSent,
        followUp.hasFollowUp,
        followUp.previousIntent,
        accessToken,
        setAccessToken
      );
      setMessage('');
      console.log("receiving", { hasFollowUp: response.data.nextIntent.hasFollowUp, previousIntent: response.data.nextIntent.previousIntent })

      setFollowUp({ hasFollowUp: response.data.nextIntent.hasFollowUp, previousIntent: response.data.nextIntent.previousIntent });
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

      chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight - chatboxRef.current.clientHeight;

    } catch (err) {
      setFollowUp({
        hasFollowUp: false,
        previousIntent: undefined,
      });
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

  const changeChatWindowHeight = (height) => {
    window.parent.postMessage({ height: "530px - 40", width: undefined }, "http://127.0.0.1:5500")
  }
  return (
    <div>
      <div className="chats-box" ref={props.chatboxRef} style={{ height: "500px", width: "400px" }}>
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
                  Online
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
        <div className="chatbox-body" ref={chatboxRef}>
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
              style={{ resize: 'none', wordWrap: 'break-word', height: "31px", pointerEvents: props.disableInput ? "none" : "all" }}
              onChange={(e) => {
                setMessage(e.target.value);
              }}
              minRows={2}
              maxRows={2}
              onHeightChange={changeChatWindowHeight}
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
