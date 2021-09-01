import React, { useState, useEffect, useContext, useReducer } from 'react';
import { AccessTokenContext } from '../../accessTokenContext';
import messageService from '../../services/message.service.js';
import mutlipleReplyService from '../../services/mutliple-reply.service.js';
import Navbar from '../common/Navbar';
import DisplayMessage from '../message/DisplayMessage';
import CreateMessage from '../message/CreateMessage';
import Entities from '../message/Entities';
import RunQueries from '../message/RunQueries';
import ChatBox from '../chatbox/chatbox';

const Messages = (props) => {
    const { accessToken, setAccessToken } = useContext(AccessTokenContext);
    const [intentId, setIntentId] = useState(undefined);
    const [multipleReply, setMultipleReply] = useState(false);

    const [messageGroup, setMessageGroup] = useReducer(
        (state, newState) => ({ ...state, ...newState }),
        { messages: [], userMessages: [], botReplies: [] }
    )

    const getMessages = async (intentId) => {
        try {
            const messageResponse = await messageService.get(intentId, accessToken, setAccessToken);
            let messages = messageResponse.data;
            let userMessages = messages.filter((message) => message.type === 'user');
            let botReplies = messages.filter((message) => message.type === 'bot');
            setMessageGroup({ messages, userMessages, botReplies })

        } catch (err) {
            console.log(err);
        }
    }

    useEffect(async () => {
        let intentId = sessionStorage.getItem('intent');
        setIntentId(intentId);

        try {
            const multipleReply = await mutlipleReplyService.get(intentId, accessToken, setAccessToken);
            setMultipleReply(multipleReply.data);

            getMessages(intentId);

        } catch (err) {
            console.log(err);
        }
    }, []);

    const handleMultipleReply = async (event) => {
        try {
            setMultipleReply(event.target.checked);
            await mutlipleReplyService.update(event.target.checked, intentId, accessToken, setAccessToken)
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <React.Fragment>
            <Navbar isAuthenticated={props.isAuthenticated}>
                <li className="nav-item">
                    <a className="navlinks" data-toggle="modal" data-target="#entity" href="/explore" style={{ marginRight: "50px" }}>Entity</a>
                    <Entities />
                </li>
                <li className="nav-item">
                    <a className="navlinks" data-toggle="modal" data-target="#run-query" href="/explore" style={{ marginRight: "50px" }}>Run Queries</a>
                    <RunQueries />
                </li>
                <li className="nav-item">
                    <a className="navlinks" data-toggle="modal" data-target="#richResponses" href="/explore" style={{ marginRight: "50px" }}>Rich Responses</a>
                </li>
            </Navbar>
            <div className="container text-center">
                <button className="btn btn-primary button mt-5 mb-5" type="button" data-toggle="collapse" data-target="#createTraining" aria-expanded="false" aria-controls="collapseExample">
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
                    </div>
                    <div className="col-md-6">
                        <CreateMessage
                            header="Create Bot Reply"
                            subText="Bot Reply"
                            messageType="bot"
                            intentId={intentId}
                            getMessages={getMessages}
                        />
                    </div>
                </div>
                < div className="row text-center">
                    <div className="col-md-6">
                        <h5> User Message </h5>
                    </div>
                    <div className="col-md-6">
                        <h5> Bot Reply </h5>
                        <div className="custom-control custom-switch">
                            <input type="checkbox" onChange={handleMultipleReply} className="custom-control-input" id="multipleBotReply" checked={multipleReply} />
                            <label className="custom-control-label" htmlFor="multipleBotReply" >Multiple replies</label>
                        </div>
                    </div>
                </div>
                <br />
                {/* Implement map func here */}
                {messageGroup.messages.map((_, index) => (
                    <React.Fragment key={index}>
                        < div className="row text-center">
                            <div className="col-md-6">
                                <DisplayMessage message={
                                    messageGroup.userMessages[index]}
                                    getMessages={getMessages}
                                    intentId={intentId} />
                            </div>
                            <div className="col-md-6">
                                <DisplayMessage
                                    message={messageGroup.botReplies[index]}
                                    getMessages={getMessages}
                                    intentId={intentId} />
                            </div>
                        </div>
                    </React.Fragment>
                ))}

            </div>
            <ChatBox />
        </React.Fragment>
    );
}

export default Messages;