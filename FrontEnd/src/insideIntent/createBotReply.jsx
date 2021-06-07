import React, { Component } from 'react';
import axios from 'axios';

class CreateBotReply extends Component {

    addBotReply = () => {

        // Get the necessary details ( userId, assistantId, intentId )
        let { userId } = JSON.parse(sessionStorage.getItem('userDetails'));
        let { assistantId } = JSON.parse(sessionStorage.getItem('assistantDetails'));
        let { intentId } = JSON.parse(sessionStorage.getItem('intentDetails'));


        // Get the html of the input field and value entered.
        let botReplyField = document.getElementById('input-botreply');
        let botReply = botReplyField.textContent;

        // Empty the input field after pressing enter ( that is, after the value is entered )
        botReplyField.textContent = "";

        // Make a post request to the express server( messages.js ) to add the bot reply to the database
        try {
            axios({
                method: 'post',
                url: 'http://localhost:5000/message',
                params: {
                    userId: userId,
                    assistantId: assistantId,
                    intentId: intentId,
                    messageType: "bot",
                    message: botReply
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

    createBotReplyKeyPress = (e) => {
        if (e.keyCode === 13) {
            if (!e.shiftKey) {
                e.preventDefault();
                this.addBotReply();
            }
        }
    }

    render() {
        return (
            <React.Fragment>
                <div className="collapse" id="createTraining">
                    <div className="card">
                        <div className="card-header">
                            Create Bot Reply
                        </div>
                        <div className="card-body">
                            <div className="input-group input-group-lg">
                                <div className="input-group-prepend">
                                    <span className="input-group-text" id="inputGroup-sizing-lg"><svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-chat-right-quote-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" d="M16 2a2 2 0 0 0-2-2H2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h9.586a1 1 0 0 1 .707.293l2.853 2.853a.5.5 0 0 0 .854-.353V2zM7.194 4.766c.087.124.163.26.227.401.428.948.393 2.377-.942 3.706a.446.446 0 0 1-.612.01.405.405 0 0 1-.011-.59c.419-.416.672-.831.809-1.22-.269.165-.588.26-.93.26C4.775 7.333 4 6.587 4 5.667 4 4.747 4.776 4 5.734 4c.271 0 .528.06.756.166l.008.004c.169.07.327.182.469.324.085.083.161.174.227.272zM11 7.073c-.269.165-.588.26-.93.26-.958 0-1.735-.746-1.735-1.666 0-.92.777-1.667 1.734-1.667.271 0 .528.06.756.166l.008.004c.17.07.327.182.469.324.085.083.161.174.227.272.087.124.164.26.228.401.428.948.392 2.377-.942 3.706a.446.446 0 0 1-.613.01.405.405 0 0 1-.011-.59c.42-.416.672-.831.81-1.22z" />
                                    </svg></span>
                                </div>
                                <pre
                                    id="input-botreply"
                                    contentEditable={true}
                                    style={{ textAlign: "left" }}
                                    onKeyDown={this.createBotReplyKeyPress}
                                    className="form-control"
                                    aria-label="Sizing example input"
                                    aria-describedby="inputGroup-sizing-lg" />
                                {/* <small id="emailHelp" className="form-text text-muted">Enter the bot reply</small> */}
                            </div>
                        </div>
                        <div className="card-footer">
                            <svg width="0.5em" height="0.5em" viewBox="0 0 16 16" className="bi bi-asterisk" fill="red" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M8 0a1 1 0 0 1 1 1v5.268l4.562-2.634a1 1 0 1 1 1 1.732L10 8l4.562 2.634a1 1 0 1 1-1 1.732L9 9.732V15a1 1 0 1 1-2 0V9.732l-4.562 2.634a1 1 0 1 1-1-1.732L6 8 1.438 5.366a1 1 0 0 1 1-1.732L7 6.268V1a1 1 0 0 1 1-1z" />
                            </svg> bot reply or whatever
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export { CreateBotReply };