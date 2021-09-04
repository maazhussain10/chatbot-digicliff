import React, { useContext, useEffect } from 'react';
import { AccessTokenContext } from '../../accessTokenContext';
import messageService from '../../services/message.service.js';

const DisplayMessage = (props) => {
    const { accessToken, setAccessToken } = useContext(AccessTokenContext);
    useEffect(() => {

    }, []);

    const deleteMessage = async () => {
        try {
            await messageService.delete(props.intentId, props.message.type, props.message.text, accessToken, setAccessToken);
            props.getMessages(props.intentId);
        } catch (err) {
            console.log(err);
        }
    }

    const handleKeyDown = (e) => {
        if (e.keyCode === 13) {
            if (!e.shiftKey) {
                e.preventDefault();
                updateMessage(e.target);
            }
        }
    }

    const updateMessage = async (element) => {
        try {
            let newMessage = element.innerText;
            await messageService.update(props.intentId, props.message.type, newMessage, props.message.text, accessToken, setAccessToken);
            props.getMessages(props.intentId);
        } catch (err) {
            console.log(err);
        }
    }
    if (!props.message)
        return <></>
    return (
        <div className="input-group mb-3">
            <div className="input-group-prepend">
                <span className="input-group-text" id="basic-addon1">
                    <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-chat-right-dots-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M16 2a2 2 0 0 0-2-2H2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h9.586a1 1 0 0 1 .707.293l2.853 2.853a.5.5 0 0 0 .854-.353V2zM5 6a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
                    </svg>
                </span>
            </div>
            <pre
                type="text"
                className="form-control"
                onKeyDown={handleKeyDown}
                style={{ textAlign: "left", whiteSpace: "pre-wrap", height: "auto", wordWrap: "break-word" }}
                contentEditable
                suppressContentEditableWarning={true}
                aria-label="Username"
                aria-describedby="basic-addon1">
                {props.message.text.trim()}
            </pre>
            <div className="input-group-prepend">
                <button onClick={() => deleteMessage()} style={{ zIndex: "0" }} className="btn btn-outline-danger" type="button" id="button-addon1"><svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-trash-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5a.5.5 0 0 0-1 0v7a.5.5 0 0 0 1 0v-7z" />
                </svg></button>
            </div>
        </div>
    );
}

export default DisplayMessage;