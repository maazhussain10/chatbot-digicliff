import React, { Component } from 'react';
import axios from 'axios';
import './css/buttonAllignment.css'
import validate from '../home/js/validation.js';

class CreateIntentModal extends Component {
    state = {
        intentNameValidation: {
            message: "Intent name cannot be empty",
            isCorrect: null,
        },
        intentDescValidation: {
            message: "Description cannot be empty",
            isCorrect: null,
        },
        intentName: "",
        intentDesc: "",
        intentCreationStatus: null,
    }
    //-----------------------------------------------------------CREATE INTENT AXIOS------------------------------------------------------------
    createIntent = async () => {
        // Get the necessary details ( userId, assistantId, intentId )
        let { userId } = JSON.parse(sessionStorage.getItem('userDetails'));
        let { assistantId } = JSON.parse(sessionStorage.getItem('assistantDetails'));

        let { intentName, intentDesc } = this.state;

        // Check validation of all input fields.
        let { intentNameValidation, intentDescValidation } = this.state;
        if (!intentNameValidation.isCorrect || !intentDescValidation.isCorrect) {
            if (intentName === "") {
                intentNameValidation.isCorrect = false;
                intentNameValidation.message = "Intent name cannot be empty";
                document.getElementById('input-intentName').style.borderColor = "#ff0000";
            }
            if (intentDesc.trim() === "") {
                intentDescValidation.isCorrect = false;
                intentDescValidation.message = "Description cannot be empty";
                document.getElementById('input-intentDesc').style.borderColor = "#ff0000";
            }
            await this.setState({
                intentNameValidation: intentNameValidation,
                intentDescValidation: intentDescValidation
            })
            return;
        }
        // Send a post request to the express server ( assistant.js ) to add the assistant to the database
        try {
            axios({
                method: 'post',
                url: 'http://localhost:5000/intent',
                params: {
                    intentName: intentName,
                    intentDesc: intentDesc,
                    assistantId: assistantId,
                    userId: userId
                },

            }).then((response) => {
                /*
                Has 2 Boolean values as parameters in the response.data object.

                -> responseStatus = True when Intent creation is a success, Else False
                -> doesIntentExist = True when an intent with the given name already exists in the assistant, else False

                */
                let { responseStatus, doesIntentExist } = response.data;
                this.setState({ intentCreationStatus: responseStatus })
                let { getIntents } = this.props;
                getIntents(assistantId);
                if (responseStatus) {

                    document.getElementById("input-intentName").value = "";
                    document.getElementById("input-intentDesc").value = "";
                    setTimeout(() => { this.clearState() }, 2000)
                }

                // If Intent already exists, Print error message.
                if (doesIntentExist) {
                    this.setState({
                        intentNameValidation: {
                            message: "Intent with this name already exists.",
                            isCorrect: false,
                        },
                    })
                    // Set border color of intentName field to red
                    document.getElementById('input-intentName').style.borderColor = "#ff0000";
                }
            });
        }
        catch (e) {
            console.log(e);
        }
    }

    intentNameChange = (e) => {
        let text = e.target.value;

        // Validate the input text
        let validationResults = validate(text, 'name', 0);
        let { isNotEmpty, hasCorrectCharacters } = validationResults;

        // If Empty
        if (!isNotEmpty) {
            this.setState({
                intentNameValidation: {
                    message: "Intent's name cannot be empty.",
                    isCorrect: false,
                },
                intentName: text
            })
            // Set border color of intentName to red.
            document.getElementById('input-intentName').style.borderColor = "#ff0000";

        }
        // If input text has invalid characters.
        else if (!hasCorrectCharacters) {
            this.setState({
                intentNameValidation: {
                    message: "Intent's name should only contain alphabets.",
                    isCorrect: false,
                },
                intentName: text
            })
            // Set border color of intentName to red.
            document.getElementById('input-intentName').style.borderColor = "#ff0000";
        }
        // If Valid
        else {
            this.setState({
                intentNameValidation: {
                    message: "Success",
                    isCorrect: true,
                },
                intentName: text
            })
            // Set border color of intentName to green.
            document.getElementById('input-intentName').style.borderColor = "#32cd32";
        }
    }

    intentDescChange = (e) => {
        let text = e.target.value;

        // Validate entered text
        let validationResults = validate(text, 'name', 0);
        let { isNotEmpty } = validationResults;

        // If Empty
        if (!isNotEmpty) {
            this.setState({
                intentDescValidation: {
                    message: "Intent's name cannot be empty.",
                    isCorrect: false,
                },
                intentDesc: text
            })
            // Set border color if assitant description field to red
            document.getElementById('input-intentDesc').style.borderColor = "#ff0000";
        }
        // If valid
        else {
            this.setState({
                intentDescValidation: {
                    message: "Success",
                    isCorrect: true,
                },
                intentDesc: text
            })
            // Set border color if assitant description field to green
            document.getElementById('input-intentDesc').style.borderColor = "#32cd32";
        }
    }

    //-----------------------------------------------------------------EXTRAS--------------------------------------------------------------------

    // Called when the create/update modal is closed
    clearState = () => {
        // Clears state related to create and update details whenever the modal is closed.
        this.setState({
            intentCreationStatus: null,
            intentUpdateStatus: null,
            intentNameValidation: {
                message: "",
                isCorrect: null,
            },
            intentName: "",
            intentDescValidation: {
                message: "",
                isCorrect: null,
            },
            intentDesc: "",


        })
        // Sets border color of all input fields to the default gray color.
        document.getElementById('input-intentName').style.borderColor = "#cccccc"
        document.getElementById('input-intentDesc').style.borderColor = "#cccccc";
    }



    //------------------------------------------------------------------RENDER----------------------------------------------------------------------
    render() {
        let {
            intentNameValidation,
            intentDescValidation,
            intentCreationStatus,
        } = this.state;
        return (
            <React.Fragment>

                <div className="modal fade" id="intent" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Create Intent</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                {/* Prints Success alert message if assistant has been created succesffuly */}
                                {intentCreationStatus === true ?
                                    <div className="alert alert-success alert-dismissible fade show" role="alert">
                                        Intent has been created Successfully!
                                    </div>
                                    : null}
                                {/* Prints Error alert message if assistant creation failed */}
                                {intentCreationStatus === false ?
                                    <div className="alert alert-danger alert-dismissible fade show" role="alert">
                                        Failed to create Intent!
                                    </div>
                                    : null}
                                <div className="container" id="bootstrap-override">
                                    <form>
                                        <div className="form-group">
                                            <label htmlFor="input-intentName">Intent Name</label>
                                            <input
                                                onChange={this.intentNameChange}
                                                id="input-intentName"
                                                type="text"
                                                className="form-control"
                                                aria-describedby="intentName"
                                            />
                                            {/* Prints small red error message if the input is not valid */}
                                            {intentNameValidation.isCorrect === false ?
                                                <small className="form-text error">{intentNameValidation.message}</small>
                                                :
                                                null
                                            }
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="intentDesc">Intent purpose</label>
                                            <textarea
                                                onChange={this.intentDescChange}
                                                className="form-control"
                                                id="input-intentDesc"
                                                rows="3"
                                            ></textarea>
                                            {intentDescValidation.isCorrect === false ?
                                                <small className="form-text error">{intentDescValidation.message}</small>
                                                :
                                                null
                                            }
                                        </div>
                                    </form>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-outline-danger" data-dismiss="modal"> <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-backspace-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M15.683 3a2 2 0 0 0-2-2h-7.08a2 2 0 0 0-1.519.698L.241 7.35a1 1 0 0 0 0 1.302l4.843 5.65A2 2 0 0 0 6.603 15h7.08a2 2 0 0 0 2-2V3zM5.829 5.854a.5.5 0 1 1 .707-.708l2.147 2.147 2.146-2.147a.5.5 0 1 1 .707.708L9.39 8l2.146 2.146a.5.5 0 0 1-.707.708L8.683 8.707l-2.147 2.147a.5.5 0 0 1-.707-.708L7.976 8 5.829 5.854z" />
                                </svg> Close</button>
                                <button type="button" onClick={() => this.createIntent()} className="btn btn-primary">Create Intent <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-node-plus-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M11 13a5 5 0 1 0-4.975-5.5H4A1.5 1.5 0 0 0 2.5 6h-1A1.5 1.5 0 0 0 0 7.5v1A1.5 1.5 0 0 0 1.5 10h1A1.5 1.5 0 0 0 4 8.5h2.025A5 5 0 0 0 11 13zm.5-7.5a.5.5 0 0 0-1 0v2h-2a.5.5 0 0 0 0 1h2v2a.5.5 0 0 0 1 0v-2h2a.5.5 0 0 0 0-1h-2v-2z" />
                                </svg></button>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export { CreateIntentModal };