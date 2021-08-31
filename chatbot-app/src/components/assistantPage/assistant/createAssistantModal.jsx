import React, { Component } from 'react';
import axios from 'axios';
import validate from '../../home/js/validation';
import URL from '../../../websiteURL';


class CreateAssistantModal extends Component {
    state = {
        assistantNameValidation: {
            message: "Assistant's name cannot be empty.",
            isCorrect: null,
        },
        assistantDescValidation: {
            message: "Description cannot be empty.",
            isCorrect: null,
        },
        assistantName: "",
        assistantDesc: "",
        assistantCreationStatus: null,
    }



    //------------------------------------------------------------------CREATE ASSISTANTS AXIOS----------------------------------------------------------------------

    createAssistant = () => {
        // get username from sessionStorage.
        let { username } = JSON.parse(sessionStorage.getItem('userDetails'));
        let { assistantName, assistantDesc } = this.state;


        // Check validation of all input fields.
        let { assistantNameValidation, assistantDescValidation } = this.state;
        if (!assistantNameValidation.isCorrect || !assistantDescValidation.isCorrect) {
            if (assistantName === "") {
                assistantNameValidation.isCorrect = false;
                assistantNameValidation.message = "Assistant's name cannot be empty.";
                document.getElementById('input-assistantName').style.borderColor = "#ff0000";
            }
            if (assistantDesc.trim() === "") {
                assistantDescValidation.isCorrect = false;
                assistantDescValidation.message = "Description cannot be empty.";
                document.getElementById('input-assistantDesc').style.borderColor = "#ff0000";
            }
            this.setState({
                assistantNameValidation: assistantNameValidation,
                assistantDescValidation: assistantDescValidation
            })
            return;
        }

        // Send a post request to the express server ( assistant.js ) to add the assistant to the database
        try {
            axios({
                method: 'post',
                url: 'http://' + URL + ':5000/assistant',
                params: {
                    assistantName: assistantName,
                    assistantDesc: assistantDesc,
                    username: username
                },

            }).then((response) => {
                /*
                Has 2 Boolean values as parameters in the response.data object.

                -> responseStatus = True when Assistant creation is a success, Else False
                -> doesAssistantExist = True when an assistant with the given name already exists, else False

                */
                let { responseStatus, doesAssistantExist } = response.data;
                this.setState({ assistantCreationStatus: responseStatus })



                // Get getAssistant method from props and call the function.
                let { getAssistants } = this.props;
                getAssistants(username);


                if (responseStatus) {

                    document.getElementById("input-assistantName").value = "";
                    document.getElementById("input-assistantDesc").value = "";
                    setTimeout(() => { this.clearState() }, 2000)
                }

                // If Assistant already exists, Print error message.
                if (doesAssistantExist) {
                    this.setState({
                        assistantNameValidation: {
                            message: "Assistant with this name already exists.",
                            isCorrect: false,
                        },
                    })
                    // Set border color of assistantName field to red
                    document.getElementById('input-assistantName').style.borderColor = "#ff0000";
                }
            });
        }
        catch (e) {
            console.log(e);
        }
    }

    //------------------------------------------------------------------NECESSARY HANDLING FUNCTIONS TO CREATE ASSISTANT----------------------------------------------------------------------

    assistantNameChange = (e) => {
        let text = e.target.value;

        // Validate the input text
        let validationResults = validate(text, 'name', 0);
        let { isNotEmpty, hasCorrectCharacters } = validationResults;

        // If Empty
        if (!isNotEmpty) {
            this.setState({
                assistantNameValidation: {
                    message: "Assistant's name cannot be empty.",
                    isCorrect: false,
                },
                assistantName: text
            })
            // Set border color of assistantName to red.
            document.getElementById('input-assistantName').style.borderColor = "#ff0000";

        }
        // If input text has invalid characters.
        else if (!hasCorrectCharacters) {
            this.setState({
                assistantNameValidation: {
                    message: "Assistant's name should only contain alphabets.",
                    isCorrect: false,
                },
                assistantName: text
            })
            // Set border color of assistantName to red.
            document.getElementById('input-assistantName').style.borderColor = "#ff0000";
        }
        // If Valid
        else {
            this.setState({
                assistantNameValidation: {
                    message: "Success",
                    isCorrect: true,
                },
                assistantName: text
            })
            // Set border color of assistantName to green.
            document.getElementById('input-assistantName').style.borderColor = "#32cd32";
        }
    }

    assistantDescChange = (e) => {
        let text = e.target.value;

        // Validate entered text
        let validationResults = validate(text, 'name', 0);
        let { isNotEmpty } = validationResults;

        // If Empty
        if (!isNotEmpty) {
            this.setState({
                assistantDescValidation: {
                    message: "Assistant's name cannot be empty.",
                    isCorrect: false,
                },
                assistantDesc: text
            })
            // Set border color if assitant description field to red
            document.getElementById('input-assistantDesc').style.borderColor = "#ff0000";
        }
        // If valid
        else {
            this.setState({
                assistantDescValidation: {
                    message: "Success",
                    isCorrect: true,
                },
                assistantDesc: text
            })
            // Set border color if assitant description field to green
            document.getElementById('input-assistantDesc').style.borderColor = "#32cd32";
        }
    }

    // Called when the create/update modal is closed
    clearState = () => {
        // Clears state related to create and update details whenever the modal is closed.
        this.setState({
            assistantCreationStatus: null,
            assistantNameValidation: {
                message: "",
                isCorrect: null,
            },
            assistantName: "",
            assistantDescValidation: {
                message: "",
                isCorrect: null,
            },
            assistantDesc: "",
        })
        // Sets border color of all input fields to the default gray color.
        document.getElementById('input-assistantName').style.borderColor = "#cccccc"
        document.getElementById('input-assistantDesc').style.borderColor = "#cccccc";
    }
    render() {
        let {
            assistantNameValidation,
            assistantDescValidation,
            assistantCreationStatus,
        } = this.state;
        return (
            <React.Fragment>
                {/* Modal to create Assistant */}
                <div className="modal fade" id="createAssistantModal" tabIndex="-1" aria-labelledby="createAssistant" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="createAssistant">Create Assistant</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                {/* Prints Success alert message if assistant has been created succesffuly */}
                                {assistantCreationStatus === true ?
                                    <div className="alert alert-success alert-dismissible fade show" role="alert">
                                        Assistant has been created Successfully!
                                    </div>
                                    : null}
                                {/* Prints Error alert message if assistant creation failed */}
                                {assistantCreationStatus === false ?
                                    <div className="alert alert-danger alert-dismissible fade show" role="alert">
                                        Failed to create Assistant!
                                    </div>
                                    : null}

                                <div className="container" id="bootstrap-override">
                                    <form>
                                        <div className="form-group">
                                            <label htmlFor="assistantName">Assistant's Name</label>
                                            <input
                                                onChange={this.assistantNameChange}
                                                type="text"
                                                className="form-control"
                                                id="input-assistantName"
                                                aria-describedby="input-assistantName"
                                            />
                                            {/* Prints small red error message if the input is not valid */}
                                            {assistantNameValidation.isCorrect === false ?
                                                <small id="assistantName" className="form-text error">{assistantNameValidation.message}</small>
                                                :
                                                null
                                            }
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="input-assistantDesc">Description</label>
                                            <textarea onChange={this.assistantDescChange} className="form-control" id="input-assistantDesc" rows="3"></textarea>
                                            {/* Prints small red error message if the input is not valid */}
                                            {assistantDescValidation.isCorrect === false ?
                                                <small id="assistantName" className="form-text error">{assistantDescValidation.message}</small>
                                                :
                                                null

                                            }

                                        </div>
                                    </form>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" onClick={() => this.clearState()} className="btn btn-outline-danger" data-dismiss="modal">Close</button>
                                <button type="button" onClick={() => this.createAssistant()} className="btn btn-primary">Create</button>

                            </div>
                        </div>
                    </div >
                </div >
            </React.Fragment>
        );
    }
}

export { CreateAssistantModal };