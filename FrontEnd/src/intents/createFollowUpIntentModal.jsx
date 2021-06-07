import React, { Component } from 'react';
import axios from 'axios';
import validate from '../home/js/validation';

class CreateFollowUpIntentModal extends Component {
    state = {
        followUpIntentName: "",
        followUpIntentDesc: "",
        followUpIntentNameValidation: {
            message: "Intent name cannot be empty",
            isCorrect: null,
        },
        followUpIntentDescValidation: {
            message: "Description cannot be empty",
            isCorrect: null,
        },
        followUpIntentCreationStatus: null,
    }

    //------------------------------------------------------------------Create folllow up intent.----------------------------------------------------------------------
    createFollowUpIntent = async () => {
        // Get the necessary details ( userId, assistantId, intentId )
        let { userId } = JSON.parse(sessionStorage.getItem('userDetails'));
        let { assistantId } = JSON.parse(sessionStorage.getItem('assistantDetails'));
        let { intentId } = this.props.followUpIntentDetails;

        let { followUpIntentName, followUpIntentDesc } = this.state;
        console.log(assistantId, userId, followUpIntentName, followUpIntentDesc, intentId);

        // Check validation of all input fields.
        let { followUpIntentNameValidation, followUpIntentDescValidation } = this.state;
        if (!followUpIntentNameValidation.isCorrect || !followUpIntentDescValidation.isCorrect) {
            console.log(followUpIntentDesc, followUpIntentName);
            if (followUpIntentName === "") {
                followUpIntentNameValidation.isCorrect = false;
                followUpIntentNameValidation.message = "Intent name cannot be empty";
                document.getElementById('input-followUpName').style.borderColor = "#ff0000";
            }
            if (followUpIntentDesc.trim() === "") {
                followUpIntentDescValidation.isCorrect = false;
                followUpIntentDescValidation.message = "Description cannot be empty";
                document.getElementById('input-followUpDesc').style.borderColor = "#ff0000";
            }
            await this.setState({
                followUpIntentNameValidation: followUpIntentNameValidation,
                followUpIntentDescValidation: followUpIntentDescValidation
            })
            return;
        }
        // Send a post request to the express server ( assistant.js ) to add the assistant to the database
        try {
            axios({
                method: 'post',
                url: 'http://localhost:5000/follow-intent',
                params: {
                    intentName: followUpIntentName,
                    intentDesc: followUpIntentDesc,
                    assistantId: assistantId,
                    userId: userId,
                    previousIntent: intentId,
                },
            }).then((response) => {
                /*
                Has 2 Boolean values as parameters in the response.data object.

                -> responseStatus = True when Intent creation is a success, Else False
                -> doesIntentExist = True when an intent with the given name already exists in the assistant, else False

                */
                let { responseStatus, doesIntentExist } = response.data;
                this.setState({ followUpIntentCreationStatus: responseStatus })

                // Update intents after creating a new intent.
                let { getIntents } = this.props;
                getIntents(assistantId);

                // If the follow up intent was created successfully!
                if (responseStatus) {
                    setTimeout(() => { this.clearState() }, 2000)
                }

                // If Intent already exists, Print error message.
                if (doesIntentExist) {
                    this.setState({
                        followUpIntentNameValidation: {
                            message: "Intent with this name already exists.",
                            isCorrect: false,
                        },
                    })
                    // Set border color of intentName field to red
                    document.getElementById('input-followUpName').style.borderColor = "#ff0000";
                }
            });
        }
        catch (e) {
            console.log(e);
        }
    }

    //-----------------------------------------------Follow Up Intent Handling---------------------------------------------------------------

    intentNameChange = (e) => {
        let text = e.target.value;

        // Validate the input text
        let validationResults = validate(text, 'name', 0);
        let { isNotEmpty, hasCorrectCharacters } = validationResults;

        // If Empty
        if (!isNotEmpty) {
            this.setState({
                followUpIntentNameValidation: {
                    message: "Intent's name cannot be empty.",
                    isCorrect: false,
                },
                followUpIntentName: text
            })
            // Set border color of intentName to red.
            document.getElementById('input-followUpName').style.borderColor = "#ff0000";

        }
        // If input text has invalid characters.
        else if (!hasCorrectCharacters) {
            this.setState({
                followUpIntentNameValidation: {
                    message: "Intent's name should only contain alphabets.",
                    isCorrect: false,
                },
                followUpIntentName: text
            })
            // Set border color of intentName to red.
            document.getElementById('input-followUpName').style.borderColor = "#ff0000";
        }
        // If Valid
        else {
            this.setState({
                followUpIntentNameValidation: {
                    message: "Success",
                    isCorrect: true,
                },
                followUpIntentName: text
            })
            // Set border color of intentName to green.
            document.getElementById('input-followUpName').style.borderColor = "#32cd32";
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
                followUpIntentDescValidation: {
                    message: "Intent's name cannot be empty.",
                    isCorrect: false,
                },
                followUpIntentDesc: text
            })
            // Set border color if assitant description field to red
            document.getElementById('input-followUpDesc').style.borderColor = "#ff0000";
        }
        // If valid
        else {
            this.setState({
                followUpIntentDescValidation: {
                    message: "Success",
                    isCorrect: true,
                },
                followUpIntentDesc: text
            })
            // Set border color if assitant description field to green
            document.getElementById('input-followUpDesc').style.borderColor = "#32cd32";
        }
    }


    //Handle OVer


    //-----------------------------------------------------------------EXTRAS--------------------------------------------------------------------

    // Called when the create/update modal is closed
    clearState = () => {
        // Clears state related to create and update details whenever the modal is closed.
        console.log("Clearing state");
        this.setState({
            followUpIntentCreationStatus: null,
            followUpIntentNameValidation: {
                message: "",
                isCorrect: null,
            },
            followUpIntentName: "",
            followUpIntentDescValidation: {
                message: "",
                isCorrect: null,
            },
            followUpIntentDesc: "",


        })
        // Sets border color of all input fields to the default gray color.
        document.getElementById('input-followUpName').style.borderColor = "#cccccc"
        document.getElementById('input-followUpDesc').style.borderColor = "#cccccc";

        // Clear values in input fields.
        document.getElementById("input-followUpName").value = "";
        document.getElementById("input-followUpDesc").value = "";
    }

    render() {
        let {
            followUpIntentDescValidation,
            followUpIntentNameValidation,
            followUpIntentCreationStatus } = this.state;
        return (
            <React.Fragment>
                {/* Follow up Intent Modal */}
                <div className="modal fade" id="followUpIntent" tabIndex="-1" aria-labelledby="followUpIntentTitle" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="followUpIntentTitle">Create Follow Up Intent</h5>
                                <button onClick={() => this.clearState()} type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                {/* Prints Success alert message if assistant has been created succesffuly */}
                                {followUpIntentCreationStatus === true ?
                                    <div className="alert alert-success alert-dismissible fade show" role="alert">
                                        Follow Up Intent has been created Successfully!
                                    </div>
                                    : null}
                                {/* Prints Error alert message if assistant creation failed */}
                                {followUpIntentCreationStatus === false ?
                                    <div className="alert alert-danger alert-dismissible fade show" role="alert">
                                        Failed to create Follow Up Intent!
                                    </div>
                                    : null}
                                <div className="container" id="bootstrap-override">
                                    <form>
                                        <div className="form-group">
                                            <label htmlFor="input-followUpName">Follow Up Intent Name</label>
                                            <input
                                                onChange={this.intentNameChange}
                                                id="input-followUpName"
                                                type="text"
                                                className="form-control"
                                                aria-describedby="intentName"
                                            />
                                            {/* Prints small red error message if the input is not valid */}
                                            {followUpIntentNameValidation.isCorrect === false ?
                                                <small className="form-text error">{followUpIntentNameValidation.message}</small>
                                                :
                                                null
                                            }
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="intentDesc">Intent purpose</label>
                                            <textarea
                                                onChange={this.intentDescChange}
                                                className="form-control"
                                                id="input-followUpDesc"
                                                rows="3"
                                            ></textarea>
                                            {followUpIntentDescValidation.isCorrect === false ?
                                                <small className="form-text error">{followUpIntentDescValidation.message}</small>
                                                :
                                                null
                                            }
                                        </div>
                                    </form>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button onClick={() => this.clearState()} type="button" className="btn btn-outline-danger" data-dismiss="modal"> <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-backspace-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M15.683 3a2 2 0 0 0-2-2h-7.08a2 2 0 0 0-1.519.698L.241 7.35a1 1 0 0 0 0 1.302l4.843 5.65A2 2 0 0 0 6.603 15h7.08a2 2 0 0 0 2-2V3zM5.829 5.854a.5.5 0 1 1 .707-.708l2.147 2.147 2.146-2.147a.5.5 0 1 1 .707.708L9.39 8l2.146 2.146a.5.5 0 0 1-.707.708L8.683 8.707l-2.147 2.147a.5.5 0 0 1-.707-.708L7.976 8 5.829 5.854z" />
                                </svg> Close</button>
                                <button type="button" onClick={() => this.createFollowUpIntent()} className="btn btn-primary">Create Follow Up Intent <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-node-plus-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M11 13a5 5 0 1 0-4.975-5.5H4A1.5 1.5 0 0 0 2.5 6h-1A1.5 1.5 0 0 0 0 7.5v1A1.5 1.5 0 0 0 1.5 10h1A1.5 1.5 0 0 0 4 8.5h2.025A5 5 0 0 0 11 13zm.5-7.5a.5.5 0 0 0-1 0v2h-2a.5.5 0 0 0 0 1h2v2a.5.5 0 0 0 1 0v-2h2a.5.5 0 0 0 0-1h-2v-2z" />
                                </svg></button>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>);
    }
}

export { CreateFollowUpIntentModal };