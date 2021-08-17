import React, { Component } from 'react';
import axios from 'axios';
import URL from '../../websiteURL';

class BotReply extends Component {
    state = {}
    deleteBotReply = () => {
        let { username } = JSON.parse(sessionStorage.getItem('userDetails'));
        let { assistantName } = JSON.parse(sessionStorage.getItem('assistantDetails'));
        let { intentName } = JSON.parse(sessionStorage.getItem('intentDetails'));
        let { message } = this.props.botReply;

        try {
            axios({
                method: 'get',
                url: 'http://' + URL + ':5000/message/delete',
                params: {
                    username: username,
                    assistantName: assistantName,
                    intentName: intentName,
                    message: message,
                    messageType: "bot",
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

    updateBotReply = (htmlElement) => {
        let botReply = htmlElement.textContent;
        let { username } = JSON.parse(sessionStorage.getItem('userDetails'));
        let { assistantName } = JSON.parse(sessionStorage.getItem('assistantDetails'));
        let { intentName } = JSON.parse(sessionStorage.getItem('intentDetails'));
        let { message } = this.props.botReply;
        try {
            axios({
                method: 'get',
                url: 'http://' + URL + ':5000/message/update',
                params: {
                    username: username,
                    assistantName: assistantName,
                    intentName: intentName,
                    message: botReply,
                    previousMessage: message,
                    messageType: "bot",
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

    botReplyKeyPress = (e) => {
        if (e.keyCode === 13) {
            if (!e.shiftKey) {
                e.preventDefault();
                this.updateBotReply(e.target);
            }

        }
    }
    render() {
        let { botReply } = this.props;
        if (!botReply) {
            return (
                <span></span>
            )
        }
        let { message } = botReply;
        return (
            <React.Fragment>
                <div className="input-group mb-3">
                    <div className="input-group-prepend">
                        <span className="input-group-text" id="basic-addon1">
                            <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-chat-left-dots-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4.414a1 1 0 0 0-.707.293L.854 15.146A.5.5 0 0 1 0 14.793V2zm5 4a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
                            </svg>
                        </span>
                    </div>
                    <pre
                        contentEditable
                        suppressContentEditableWarning
                        style={{ textAlign: "left", whiteSpace: "pre-wrap", height: "auto" }}
                        onKeyDown={this.botReplyKeyPress}
                        type="text"
                        className="form-control"
                        placeholder="Username"
                        aria-label="Username"
                        aria-describedby="basic-addon1" >
                        {message}
                    </pre>

                    <div className="input-group-prepend">
                        <button onClick={() => this.deleteBotReply()} style={{ zIndex: "0" }} className="btn btn-outline-danger" type="button" id="button-addon1"><svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-trash-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5a.5.5 0 0 0-1 0v7a.5.5 0 0 0 1 0v-7z" />
                        </svg></button>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export { BotReply };