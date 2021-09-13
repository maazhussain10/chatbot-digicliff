import React, { useState, useEffect, useContext, useReducer, useRef } from 'react';
import { AccessTokenContext } from '../../accessTokenContext';
import messageService from '../../services/message.service.js';
import mutlipleReplyService from '../../services/mutliple-reply.service.js';
import Navbar from '../common/Navbar';
import DisplayMessage from '../message/DisplayMessage';
import CreateMessage from '../message/CreateMessage';
import Entities from '../message/Entities';
import RunQueries from '../message/RunQueries';
import ChatBox from '../chatbox/Chatbox';

const Messages = (props) => {
  const { accessToken, setAccessToken } = useContext(AccessTokenContext);
  const [intentId, setIntentId] = useState(undefined);
  const [multipleReply, setMultipleReply] = useState(false);

  const intentNameRef = useRef(undefined);

  const [messageGroup, setMessageGroup] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    { messages: [], userMessages: [], botReplies: [] }
  );

  const getMessages = async (intentId) => {
    try {
      const messageResponse = await messageService.get(
        intentId,
        accessToken,
        setAccessToken
      );
      let messages = messageResponse.data;
      let userMessages = messages.filter((message) => message.type === 'user');
      let botReplies = messages.filter((message) => message.type === 'bot');
      setMessageGroup({ messages, userMessages, botReplies });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(async () => {
    intentNameRef.current = sessionStorage.getItem('intent-name');

    let intentId = sessionStorage.getItem('intent');
    setIntentId(intentId);



    try {
      const multipleReply = await mutlipleReplyService.get(
        intentId,
        accessToken,
        setAccessToken
      );
      setMultipleReply(multipleReply.data);

      getMessages(intentId);
    } catch (err) {
      console.log(err);
    }
  }, []);

  const handleMultipleReply = async (event) => {
    try {
      setMultipleReply(event.target.checked);
      await mutlipleReplyService.update(
        event.target.checked,
        intentId,
        accessToken,
        setAccessToken
      );
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <React.Fragment>
      <Navbar isAuthenticated={props.isAuthenticated}>
        <li className="nav-item">
          <a className={"nav-link " + (intentNameRef.current === "Default Intent" ? "disabled" : "")} data-toggle="modal" data-target="#entity">
            Entity
          </a>
          <Entities />
        </li>
        <li className="nav-item">
          <a className="nav-link" data-toggle="modal" data-target="#run-query">
            Run Queries
          </a>
          <RunQueries />
        </li>
        <li className="nav-item">
          <a className="nav-link" href="/dashboard/intent/rich-responses">
            Rich Responses
          </a>
        </li>
      </Navbar>
      <div className="container text-center">
        <button
          className="btn btn-primary button mt-5 mb-5"
          type="button"
          data-toggle="collapse"
          data-target="#createTraining"
          aria-expanded="false"
          aria-controls="collapseExample"
        >
          Add training phrase / Response
        </button>
        <div className="row text-center">
          <div className="col-md-6">
            <CreateMessage
              getMessages={getMessages}
              header="Create Training Phrase"
              subText="Phrase"
              messageType="user"
              intentId={intentId}
            />
            <br />
            <h5 className="pb-3"> User Message </h5>
            <br />
            {messageGroup.messages.map((_, index) => (
              <React.Fragment key={index}>
                <DisplayMessage
                  message={messageGroup.userMessages[index]}
                  getMessages={getMessages}
                  intentId={intentId}
                />
              </React.Fragment>
            ))}
            <br />
          </div>
          <div className="col-md-6">
            <CreateMessage
              header="Create Bot Reply"
              subText="Bot Reply"
              messageType="bot"
              intentId={intentId}
              getMessages={getMessages}
            />
            <br />
            <h5> Bot Reply </h5>
            <div className="custom-control custom-switch pb-3">
              <input
                type="checkbox"
                onChange={handleMultipleReply}
                className="custom-control-input"
                id="multipleBotReply"
                checked={multipleReply}
              />
              <label
                className="custom-control-label"
                htmlFor="multipleBotReply"
              >
                Multiple replies
              </label>
            </div>
            {messageGroup.messages.map((_, index) => (
              <React.Fragment key={index}>
                <DisplayMessage
                  message={messageGroup.botReplies[index]}
                  getMessages={getMessages}
                  intentId={intentId}
                />
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
      <ChatBox />
    </React.Fragment>
  );
};

export default Messages;
