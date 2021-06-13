import React, { Component } from 'react';
import axios from 'axios';

class UserMessage extends Component {
    deleteUserMessage = () => {
        let { message } = this.props.userMessage;
        let { username } = JSON.parse(sessionStorage.getItem('userDetails'));
        let { assistantName } = JSON.parse(sessionStorage.getItem('assistantDetails'));
        let { intentName } = JSON.parse(sessionStorage.getItem('intentDetails'));
        try {
            axios({
                method: 'get',
                url: 'http://localhost:5000/message/delete',
                params: {
                    username: username,
                    assistantName: assistantName,
                    intentName:intentName,
                    message: message,
                    messageType: "user",
                },
            }).then((response) => {
                let { getMessages } = this.props;
                getMessages();
            });
        }
        catch (e) {
            console.log(e);
        }
    }

    updateUserMessage = (htmlElement) => {
        let userMessage = htmlElement.textContent;
        let { username } = JSON.parse(sessionStorage.getItem('userDetails'));
        let { assistantName } = JSON.parse(sessionStorage.getItem('assistantDetails'));
        let { intentName } = JSON.parse(sessionStorage.getItem('intentDetails'));
        let { message } = this.props.userMessage;
        try {
            axios({
                method: 'get',
                url: 'http://localhost:5000/message/update',
                params: {
                    username: username,
                    assistantName: assistantName,
                    intentName:intentName,
                    message: userMessage,
                    previousMessage:message,
                    messageType: "user",
                },

            }).then((response) => {
                let { getMessages } = this.props;
                getMessages();
            });
        }
        catch (e) {
            console.log(e);
        }
    }

    userMessageKeyPress = (e) => {
        if (e.keyCode === 13) {
            if (!e.shiftKey) {
                e.preventDefault();
                this.updateUserMessage(e.target);
            }

        }
    }
    render() {
        let { userMessage } = this.props;
        if (!userMessage) {
            return (
                <span></span>
            )
        }
        let { message } = userMessage;
        return (
            <React.Fragment>
                <div className="input-group mb-3">
                    <div className="input-group-prepend">
                        <span className="input-group-text" id="basic-addon1">
                            <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-chat-right-dots-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M16 2a2 2 0 0 0-2-2H2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h9.586a1 1 0 0 1 .707.293l2.853 2.853a.5.5 0 0 0 .854-.353V2zM5 6a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
                            </svg>
                        </span>
                    </div>
                    {/* <input defaultValue="User Message" type="text" className="form-control" placeholder="Username" aria-label="Username" aria-describedby="basic-addon1" /> */}
                    <pre
                        type="text"
                        className="form-control"
                        onKeyDown={this.userMessageKeyPress}
                        style={{ textAlign: "left" }}
                        suppressContentEditableWarning={true}
                        contentEditable
                        aria-label="Username"
                        aria-describedby="basic-addon1">
                        {message}
                    </pre>
                    <div className="input-group-prepend">
                        <button onClick={() => this.deleteUserMessage()} style={{ zIndex: "0" }} className="btn btn-outline-danger" type="button" id="button-addon1"><svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-trash-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5a.5.5 0 0 0-1 0v7a.5.5 0 0 0 1 0v-7z" />
                        </svg></button>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export { UserMessage };