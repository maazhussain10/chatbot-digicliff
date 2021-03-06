import React, { useContext, useReducer, useState, useEffect } from 'react';
import { AccessTokenContext } from '../../accessTokenContext';
import chatboxLogo from '../../assets/images/chatlogo.png'
import Navbar from '../common/Navbar';
import settingsService from '../../services/settings.service.js';
import ChatWindow from '../chatbox/ChatWindow';
import $ from 'jquery';

const Settings = (props) => {
  const { accessToken, setAccessToken } = useContext(AccessTokenContext);
  const [messageStorage, setMessageStorage] = useState([]);
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

  const handleSelectedPane = (selected) => {
    if (selected === 'card') setMessageStorage(sampleCardMessage);
    else if (selected === 'chip') setMessageStorage(sampleChipMessage);
    else if (selected == 'message') setMessageStorage(sampleMessages);
    else setMessageStorage([]);
  };

  const setColorTheme = (e) => {
    setTheme({ [e.target.name]: e.target.value });
  };

  const setFontTheme = (name, value) => {
    setTheme({ [name]: value });
  };

  const saveChanges = async () => {
    try {
      let chatbotId = sessionStorage.getItem('chatbot');
      await settingsService.post(chatbotId, theme, accessToken, setAccessToken);
    } catch (err) {
      console.log(err);
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
    try {
      let chatbotId = sessionStorage.getItem('chatbot');
      const settingsResponse = await settingsService.get(
        chatbotId,
        accessToken,
        setAccessToken
      );
      let theme = settingsResponse.data;
      setTheme(theme);
    } catch (err) {
      console.log(err);
    }
  }, []);

  let sampleMessages = [
    {
      from: 'user',
      messages: ['Sample User Message'],
      time: new Date()
        .toLocaleString()
        .split(',')[1]
        .replace(/(.*)\D\d+/, '$1')
        .trim(),
    },
    {
      from: 'bot',
      messages: ['Sample Bot Reply', 'Another sample bot reply'],
      richResponses: [],
      time: new Date()
        .toLocaleString()
        .split(',')[1]
        .replace(/(.*)\D\d+/, '$1'),
    },
  ];

  let sampleCardMessage = [
    {
      from: 'bot',
      messages: ['Sample Card Reply'],
      richResponses: {
        cards: [
          'Sample Header|||Sample SubHeader|||Sample Paragraph',
          'Sample Header|||Sample SubHeader|||Sample Paragraph|||https://www.google.com|||Link Button',
        ],
        type: 'cards',
      },
      time: new Date()
        .toLocaleString()
        .split(',')[1]
        .replace(/(.*)\D\d+/, '$1'),
    },
  ];

  let sampleChipMessage = [
    {
      from: 'bot',
      messages: ['Sample Chip Reply'],
      richResponses: {
        chips: ['Sample Chip 1', 'Sample Chip 2'],
        type: 'chips',
      },
      time: new Date()
        .toLocaleString()
        .split(',')[1]
        .replace(/(.*)\D\d+/, '$1'),
    },
  ];

  const fonts = [
    'Verdana',
    'Cursive',
    'Times New Roman',
    'Arial',
    'Comic Sans Serif',
    'Monospace',
    'Tahoma',
    'Fantasy',
  ];

  return (
    <>
      <Navbar isAuthenticated={props.isAuthenticated}>
        <li className="nav-item">
          <a
            id="creat"
            type="button"
            className=" nav-link"
            data-toggle="modal"
            data-target="#databaseModal"
          >
            Connect DB
          </a>
        </li>
      </Navbar>
      <React.Fragment>
        <div className="mt-5">
          <div className="">
            <div className="">
              <div className="tab-content pb-2" id="pills-tabContent">
                <div
                  className="tab-pane fade show active"
                  id="pills-chatBoxSettings"
                  role="tabpanel"
                  aria-labelledby="pills-chatBoxSettings-tab"
                >
                  <div style={{ marginLeft: '7.5%', marginRight: '7.5%' }}>
                    <div className="card shadow rounded">
                      <div className="card-body pb-" style={{ height: '65vh' }}>
                        <h1
                          style={{
                            fontFamily: 'cursive',
                            paddingLeft: '37px',
                            paddingBottom: '20px',
                          }}
                        >
                          {' '}
                          Settings
                        </h1>
                        <div className="row">
                          <div className="col-lg-3 pb-3">
                            <div className="text-center">
                              <div
                                className="nav flex-column nav-pills"
                                id="v-pills-tab"
                                role="tablist"
                                aria-orientation="vertical"
                              >
                                <a
                                  onClick={() => handleSelectedPane('chatbox')}
                                  className="nav-link active"
                                  id="v-pills-chatBoxSettings-tab"
                                  data-toggle="pill"
                                  href="#v-pills-chatBoxSettings"
                                  role="tab"
                                  aria-controls="v-pills-chatBoxSettings"
                                  aria-selected="false"
                                >
                                  Chatbox
                                </a>
                                <a
                                  onClick={() => handleSelectedPane('message')}
                                  className="nav-link"
                                  id="v-pills-messagesSettings-tab"
                                  data-toggle="pill"
                                  href="#v-pills-messagesSettings"
                                  role="tab"
                                  aria-controls="v-pills-messagesSettings"
                                  aria-selected="false"
                                >
                                  Messages
                                </a>
                                <a
                                  onClick={() => handleSelectedPane('card')}
                                  className="nav-link"
                                  id="v-pills-cardSettings-tab"
                                  data-toggle="pill"
                                  href="#v-pills-cardSettings"
                                  role="tab"
                                  aria-controls="v-pills-cardSettings"
                                  aria-selected="false"
                                >
                                  Card
                                </a>
                                <a
                                  onClick={() => handleSelectedPane('chip')}
                                  className="nav-link"
                                  id="v-pills-chipSettings-tab"
                                  data-toggle="pill"
                                  href="#v-pills-chipSettings"
                                  role="tab"
                                  aria-controls="v-pills-chipSettings"
                                  aria-selected="false"
                                >
                                  Chip
                                </a>
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-7">
                            <div
                              className="tab-content"
                              id="v-pills-tabContent"
                            >
                              <div
                                className="tab-pane fade show active"
                                id="v-pills-chatBoxSettings"
                                role="tabpanel"
                                aria-labelledby="v-pills-chatBoxSettings-tab"
                              >
                                <div className="row mb-3">
                                  <div className="col-6">Chatbox Color:</div>
                                  <div className="col-6">
                                    <input
                                      onChange={setColorTheme}
                                      name="chatboxColor"
                                      value={theme.chatboxColor}
                                      type="color"
                                    ></input>
                                  </div>
                                </div>
                                <div className="row mb-3">
                                  <div className="col-6">Chatbox Font:</div>

                                  <div className="col-6">
                                    <div
                                      className="dropdown-toggle"
                                      id="navbarDropdown"
                                      role="button"
                                      data-toggle="dropdown"
                                      aria-haspopup="true"
                                      aria-expanded="false"
                                    >
                                      <span
                                        style={{
                                          fontFamily: theme.chatboxFont,
                                        }}
                                      >
                                        {theme.chatboxFont}{' '}
                                      </span>
                                    </div>
                                    <div
                                      className="dropdown-menu"
                                      aria-labelledby="navbarDropdown"
                                    >
                                      {fonts.map((font, index) => (
                                        <span
                                          style={{ fontFamily: font }}
                                          key={index}
                                          onClick={() =>
                                            setFontTheme('chatboxFont', font)
                                          }
                                          className="dropdown-item"
                                        >
                                          {' '}
                                          {font}{' '}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                                <div className="row mb-3">
                                  <div className="col-6">
                                    Chatbox Font Color:
                                  </div>
                                  <div className="col-6">
                                    <input
                                      onChange={setColorTheme}
                                      name="chatboxFontColor"
                                      value={theme.chatboxFontColor}
                                      type="color"
                                    ></input>
                                  </div>
                                </div>
                                <div className="row mb-3">
                                  <div className="col-6">
                                    Send Message Icon Color:
                                  </div>
                                  <div className="col-6">
                                    <input
                                      onChange={setColorTheme}
                                      name="sendMessageColor"
                                      value={theme.sendMessageColor}
                                      type="color"
                                    ></input>
                                  </div>
                                </div>
                              </div>
                              {/* MESSAGES SETTING */}
                              <div
                                className="tab-pane fade"
                                id="v-pills-messagesSettings"
                                role="tabpanel"
                                aria-labelledby="v-pills-messagesSettings-tab"
                              >
                                <div className="row mb-3">
                                  <div className="col-6">
                                    User Text BgColor:
                                  </div>
                                  <div className="col-6">
                                    <input
                                      onChange={setColorTheme}
                                      name="userTextBgcolor"
                                      value={theme.userTextBgcolor}
                                      type="color"
                                    ></input>
                                  </div>
                                </div>
                                <div className="row mb-3">
                                  <div className="col-6">User Text Color:</div>
                                  <div className="col-6">
                                    <input
                                      onChange={setColorTheme}
                                      name="userTextColor"
                                      value={theme.userTextColor}
                                      type="color"
                                    ></input>
                                  </div>
                                </div>
                                <div className="row mb-3">
                                  <div className="col-6">User Font:</div>

                                  <div className="col-6">
                                    <div
                                      className="dropdown-toggle"
                                      id="navbarDropdown"
                                      role="button"
                                      data-toggle="dropdown"
                                      aria-haspopup="true"
                                      aria-expanded="false"
                                    >
                                      <span
                                        style={{ fontFamily: theme.userFont }}
                                      >
                                        {theme.userFont}{' '}
                                      </span>
                                    </div>
                                    <div
                                      className="dropdown-menu"
                                      aria-labelledby="navbarDropdown"
                                    >
                                      {fonts.map((font, index) => (
                                        // <span></span>
                                        <span
                                          style={{ fontFamily: font }}
                                          key={index}
                                          onClick={() =>
                                            setFontTheme('userFont', font)
                                          }
                                          className="dropdown-item"
                                        >
                                          {' '}
                                          {font}{' '}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                                <div className="row mb-3">
                                  <div className="col-6">
                                    Assistant Text BgColor:
                                  </div>
                                  <div className="col-6">
                                    <input
                                      onChange={setColorTheme}
                                      name="botTextBgcolor"
                                      value={theme.botTextBgcolor}
                                      type="color"
                                    ></input>
                                  </div>
                                </div>
                                <div className="row mb-3">
                                  <div className="col-6">
                                    Assistant Text Color:
                                  </div>
                                  <div className="col-6">
                                    <input
                                      onChange={setColorTheme}
                                      name="botTextColor"
                                      value={theme.botTextColor}
                                      type="color"
                                    ></input>
                                  </div>
                                </div>
                                <div className="row mb-3">
                                  <div className="col-6">Assistant Font:</div>

                                  <div className="col-6">
                                    <div
                                      className="dropdown-toggle"
                                      id="navbarDropdown"
                                      role="button"
                                      data-toggle="dropdown"
                                      aria-haspopup="true"
                                      aria-expanded="false"
                                    >
                                      <span
                                        style={{ fontFamily: theme.botFont }}
                                      >
                                        {theme.botFont}{' '}
                                      </span>
                                    </div>
                                    <div
                                      className="dropdown-menu"
                                      aria-labelledby="navbarDropdown"
                                    >
                                      {fonts.map((font, index) => (
                                        <span
                                          style={{ fontFamily: font }}
                                          key={index}
                                          onClick={() =>
                                            setFontTheme('botFont', font)
                                          }
                                          className="dropdown-item"
                                        >
                                          {' '}
                                          {font}{' '}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div
                                className="tab-pane fade"
                                id="v-pills-cardSettings"
                                role="tabpanel"
                                aria-labelledby="v-pills-cardSettings-tab"
                              >
                                <div className="row mb-3">
                                  <div className="col-6">Card BgColor:</div>
                                  <div className="col-6">
                                    <input
                                      onChange={setColorTheme}
                                      name="cardBgColor"
                                      value={theme.cardBgColor}
                                      type="color"
                                    ></input>
                                  </div>
                                </div>
                                <div className="row mb-3">
                                  <div className="col-6">Card Text Color:</div>
                                  <div className="col-6">
                                    <input
                                      onChange={setColorTheme}
                                      name="cardTextColor"
                                      value={theme.cardTextColor}
                                      type="color"
                                    ></input>
                                  </div>
                                </div>
                                <div className="row mb-3">
                                  <div className="col-6">
                                    Card Border Color:
                                  </div>
                                  <div className="col-6">
                                    <input
                                      onChange={setColorTheme}
                                      name="cardBorder"
                                      value={theme.cardBorder}
                                      type="color"
                                    ></input>
                                  </div>
                                </div>
                                <div className="row mb-3">
                                  <div className="col-6"> Card Font:</div>

                                  <div className="col-6">
                                    <div
                                      className="dropdown-toggle"
                                      id="navbarDropdown"
                                      role="button"
                                      data-toggle="dropdown"
                                      aria-haspopup="true"
                                      aria-expanded="false"
                                    >
                                      <span
                                        style={{ fontFamily: theme.cardFont }}
                                      >
                                        {theme.cardFont}
                                      </span>
                                    </div>
                                    <div
                                      className="dropdown-menu"
                                      aria-labelledby="navbarDropdown"
                                    >
                                      {fonts.map((font, index) => (
                                        <span
                                          style={{ fontFamily: font }}
                                          key={index}
                                          onClick={() =>
                                            setFontTheme('cardFont', font)
                                          }
                                          className="dropdown-item"
                                        >
                                          {' '}
                                          {font}{' '}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div
                                className="tab-pane fade"
                                id="v-pills-chipSettings"
                                role="tabpanel"
                                aria-labelledby="v-pills-chipSettings-tab"
                              >
                                <div className="row mb-3">
                                  <div className="col-6">Chip BgColor:</div>
                                  <div className="col-6">
                                    <input
                                      onChange={setColorTheme}
                                      name="chipBgColor"
                                      value={theme.chipBgColor}
                                      type="color"
                                    ></input>
                                  </div>
                                </div>
                                <div className="row mb-3">
                                  <div className="col-6">Chip Text Color:</div>
                                  <div className="col-6">
                                    <input
                                      onChange={setColorTheme}
                                      name="chipTextColor"
                                      value={theme.chipTextColor}
                                      type="color"
                                    ></input>
                                  </div>
                                </div>
                                <div className="row mb-3">
                                  <div className="col-6">
                                    Chip Border Color:
                                  </div>
                                  <div className="col-6">
                                    <input
                                      onChange={setColorTheme}
                                      name="chipBorder"
                                      value={theme.chipBorder}
                                      type="color"
                                    ></input>
                                  </div>
                                </div>
                                <div className="row mb-3">
                                  <div className="col-6">Chip Font:</div>

                                  <div className="col-6">
                                    <div
                                      className="dropdown-toggle"
                                      id="navbarDropdown"
                                      role="button"
                                      data-toggle="dropdown"
                                      aria-haspopup="true"
                                      aria-expanded="false"
                                    >
                                      <span
                                        style={{ fontFamily: theme.chipFont }}
                                      >
                                        {' '}
                                        {theme.chipFont}
                                      </span>
                                    </div>
                                    <div
                                      className="dropdown-menu"
                                      aria-labelledby="navbarDropdown"
                                    >
                                      {fonts.map((font, index) => (
                                        <span
                                          style={{ fontFamily: font }}
                                          key={index}
                                          onClick={() =>
                                            setFontTheme('chipFont', font)
                                          }
                                          className="dropdown-item"
                                        >
                                          {' '}
                                          {font}{' '}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                                <div className="row mb-3">
                                  <div className="col-6">Chip Shape:</div>

                                  <div className="col-6">
                                    <input
                                      onChange={setColorTheme}
                                      type="range"
                                      min="0"
                                      max="100"
                                      name="chipShape"
                                      value={theme.chipShape}
                                      id="chipBorderSlider"
                                    ></input>
                                    {theme.chipShape}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <ChatWindow
                          theme={theme}
                          messageStorage={messageStorage}
                          disableInput={true}
                        />
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

                        {/* <div className="chats-box" style={{ bottom: '4px' }}>
                  <ChatboxTop
                    name={'Testbot'}
                    description={'Check your theme settings here.'}
                    chatboxColor={theme.chatboxColor}
                    chatboxFont={theme.chatboxFont}
                    chatboxFontColor={theme.chatboxFontColor}
                  />
                  <div className="chatbox-body">
                    <div className="chat-conversion">
                      <Messages
                        messageObject={sampleUserMessage}
                        theme={theme}
                      />
                      {selectedPane === 'message' ? (
                        <Messages
                          messageObject={sampleBotMessage}
                          duration={0}
                          theme={theme}
                        />
                      ) : null}

                      {selectedPane === 'card' ? (
                        <Messages
                          messageObject={sampleCardMessage}
                          duration={0}
                          theme={theme}
                        />
                      ) : null}
                      {selectedPane === 'chip' ? (
                        <Messages
                          messageObject={sampleChipMessage}
                          duration={0}
                          theme={theme}
                        />
                      ) : null}
                    </div>
                    <div className="clearfix"></div>
                  </div>
                  <div className="chatbox-chat">
                    <div className="form-group">
                      <input
                        disabled
                        // onKeyDown={keyPress}
                        type="text"
                        className="form-control"
                        id="sendMessage"
                        placeholder="Type your message"
                      />
                      <i
                        className="fas fa-paper-plane"
                        style={{ color: theme.sendMessageColor }}
                      ></i>
                    </div>
                  </div>
                </div> */}
                      </div>
                      <div style={{ paddingLeft: '35%', paddingBottom: '2%', paddingTop: '11%' }}>
                        {' '}
                        <button
                          onClick={() => saveChanges()}
                          className="btn btn-sm btn-primary my-2 my-sm-0 mr-2"
                        >
                          {' '}
                          Save Changes{' '}
                        </button>
                      </div>
                      {/* </div> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    </>
  );
};

export default Settings;
