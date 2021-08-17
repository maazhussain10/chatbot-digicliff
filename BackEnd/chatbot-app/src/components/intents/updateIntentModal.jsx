import React, { Component } from 'react';
import axios from 'axios';
import $ from 'jquery';
import validate from '../home/js/validation';
import URL from '../../websiteURL';

class UpdateIntentModal extends Component {
    state = {
        updateIntentNameValidation: {
            message: "Intent's name cannot be empty.",
            isCorrect: true,
        },
        updateIntentDescValidation: {
            message: "Description cannot be empty.",
            isCorrect: true,
        },
        intentUpdateStatus: null,
        updateIntentName: null,
        updateIntentDesc: null,
    }

    componentDidUpdate = () => {
        let { intentName, intentDesc } = this.props.updateIntentDetails;
        let { updateIntentName, updateIntentDesc } = this.state;
        if (updateIntentName === null) {
            document.getElementById('update-intentName').value = intentName;
        }
        else {
            document.getElementById('update-intentName').value = updateIntentName;
        }
        if (updateIntentDesc === null) {
            document.getElementById('update-intentDesc').value = intentDesc;
        }
        else {
            document.getElementById('update-intentDesc').value = updateIntentDesc;
        }
    }

    //------------------------------------------------------------------UPDATE INTENT AXIOS----------------------------------------------------------------------
    updateIntent = () => {

        // Get intentName of current card and assistantName from session storage.
        let { intentName } = this.props.updateIntentDetails;
        let { username } = JSON.parse(sessionStorage.getItem('userDetails'));
        let { assistantName } = JSON.parse(sessionStorage.getItem('assistantDetails'));


        // Get the name and description of the updated bot.
        let {
            updateIntentNameValidation,
            updateIntentDescValidation,
            updateIntentName,
            updateIntentDesc } = this.state;

        let { intentDesc } = this.props.updateIntentDetails;

        // Validate the input
        if (!updateIntentNameValidation.isCorrect || !updateIntentDescValidation.isCorrect) {
            if (updateIntentName.trim() === "") {
                updateIntentNameValidation.isCorrect = false;
                document.getElementById('update-intentName').style.borderColor = "#ff0000";
            }
            if (updateIntentDesc.trim() === "") {
                updateIntentDescValidation.isCorrect = false;
                document.getElementById('update-intentDesc').style.borderColor = "#ff0000";
            }
            this.setState({
                updateIntentNameValidation: updateIntentNameValidation,
                updateIntentDescValidation: updateIntentDescValidation
            })
            // Return if any input is not valid
            return;
        }

        if (updateIntentName === null && intentName !== "") {
            updateIntentName = intentName;
        }
        if (updateIntentDesc === null && intentDesc !== "") {
            updateIntentDesc = intentDesc;
        }

        // Send post request to express server ( Route in intent.js ) to update in database.
        try {
            axios({
                method: 'post',
                url: 'http://' + URL + ':5000/intent/update',
                params: {
                    username: username,
                    assistantName: assistantName,
                    intentName: updateIntentName,
                    description: updateIntentDesc,
                    previousIntentName: intentName,
                },

            }).then((response) => {
                let { responseStatus, doesIntentExist } = response.data;
                this.setState({ intentUpdateStatus: responseStatus })


                // Get getIntent method from props and call the function.
                let { getIntents } = this.props;
                getIntents(assistantName);

                if (responseStatus) {
                    setTimeout(() => { this.clearState() }, 1000)
                }

                // If Intent already exists, Print error message.
                if (doesIntentExist) {
                    this.setState({
                        updateIntentNameValidation: {
                            message: "Intent with this name already exists.",
                            isCorrect: false,
                        },
                    })
                    // Set border color of intentName field to red
                    document.getElementById('update-intentName').style.borderColor = "#ff0000";
                }
            });
        }
        catch (e) {
            console.log(e);
        }
    }

    // -------------------------------------------------------------Handler functions for update -----------------------------------------------

    // Handler function for update intent name textfield.
    updateIntentNameChange = (e) => {
        let text = document.getElementById('update-intentName').value;
        // Validate the text entered
        let validationResults = validate(text, 'name', 0);
        let { isNotEmpty, hasCorrectCharacters } = validationResults;

        // If Empty
        if (!isNotEmpty) {
            this.setState({
                updateIntentNameValidation: {
                    message: "Intent's name cannot be empty.",
                    isCorrect: false,
                },
                updateIntentName: text
            })
            // Set border color of assitant name field in update modal to red
            document.getElementById('update-intentName').style.borderColor = "#ff0000";

            // If invalid characters are used
        } else if (!hasCorrectCharacters) {
            this.setState({
                updateIntentNameValidation: {
                    message: "Intent's name should only contain alphabets.",
                    isCorrect: false,
                },
                updateIntentName: text
            })
            // Set border color of assitant name field in update modal to red
            document.getElementById('update-intentName').style.borderColor = "#ff0000";
            // If valid
        } else {
            this.setState({
                updateIntentNameValidation: {
                    message: "Success",
                    isCorrect: true,
                },
                updateIntentName: text
            })
            // Set border color of assitant name field in update modal to green
            document.getElementById('update-intentName').style.borderColor = "#32cd32";
        }
    }

    // Handler function for update description textarea
    updateIntentDescChange = (e) => {
        let text = e.target.value;
        let validationResults = validate(text, 'name', 0);
        let { isNotEmpty } = validationResults;
        if (!isNotEmpty) {
            this.setState({
                updateIntentDescValidation: {
                    message: "Intent's name cannot be empty.",
                    isCorrect: false,
                },
                updateIntentDesc: text
            })
            // Set border color of assitant description field in update modal to red
            document.getElementById('update-intentDesc').style.borderColor = "#ff0000";
        } else {
            this.setState({
                updateIntentDescValidation: {
                    message: "Success",
                    isCorrect: true,
                },
                updateIntentDesc: text
            })
            // Set border color of assitant description field in update modal to green
            document.getElementById('update-intentDesc').style.borderColor = "#32cd32";
        }
    }

    //-----------------------------------------------------------------EXTRAS--------------------------------------------------------------------

    // Called when the create/update modal is closed
    clearState = () => {
        // Clears state related to create and update details whenever the modal is closed.
        this.setState({
            intentUpdateStatus: null,
            updateIntentDescValidation: {
                message: "",
                isCorrect: true,
            },
            updateIntentDesc: null,
            updateIntentNameValidation: {
                message: "",
                isCorrect: true,
            },
            updateIntentName: null,

        })
        // Sets border color of all input fields to the default gray color.
        document.getElementById('update-intentName').style.borderColor = "#cccccc";
        document.getElementById('update-intentDesc').style.borderColor = "#cccccc";
        document.getElementById('update-intentName').value = "";
        document.getElementById('update-intentDesc').value = "";

        $("#updateIntent").modal("hide");

    }
    render() {
        const {
            updateIntentDescValidation,
            updateIntentNameValidation,
            intentUpdateStatus } = this.state;

        let { intentName, intentDesc } = this.props.updateIntentDetails;
        return (
            <React.Fragment>
                {/* Modal for Updating Intent */}
                <div className="modal fade" id="updateIntent" tabIndex="-1" aria-labelledby="updateIntentModel" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="updateIntentModel">Update Intent</h5>
                                <button onClick={() => this.clearState()} type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                {intentUpdateStatus === true ?
                                    <div className="alert alert-success alert-dismissible fade show" role="alert">
                                        Intent has been updated Successfully!
                                    </div>
                                    : null}
                                {/* Prints error alert message if intent was not updated. */}
                                {intentUpdateStatus === false ?
                                    <div className="alert alert-danger alert-dismissible fade show" role="alert">
                                        Failed to update Intent!
                                    </div>
                                    : null}
                                <div className="container" id="override-bootstrap">
                                    <form>
                                        <div className="form-group">
                                            <label htmlFor="update-intentName">Intent Name</label>
                                            <input
                                                onChange={this.updateIntentNameChange}
                                                defaultValue={intentName}
                                                type="text"
                                                className="form-control"
                                                id="update-intentName"
                                                aria-describedby="updateIntentName"
                                            />
                                            {updateIntentNameValidation.isCorrect === false ?
                                                <small className="form-text error">{updateIntentNameValidation.message}</small>
                                                :
                                                null
                                            }
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="update-intentDesc">Intent purpose</label>
                                            <textarea
                                                onChange={this.updateIntentDescChange}
                                                defaultValue={intentDesc}
                                                className="form-control"
                                                id="update-intentDesc"
                                                aria-describedby="updateIntentDesc"
                                                rows="3"
                                            ></textarea>
                                            {updateIntentDescValidation.isCorrect === false ?
                                                <small className="form-text error">{updateIntentDescValidation.message}</small>
                                                :
                                                null
                                            }
                                        </div>
                                    </form>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button onClick={() => this.clearState()} type="button" className="btn btn-outline-danger" data-dismiss="modal">Close</button>
                                <button onClick={() => this.updateIntent()} type="button" className="btn btn-primary">Update Intent</button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* End of Modal for updating Intent */}
            </React.Fragment>);
    }
}

export { UpdateIntentModal };