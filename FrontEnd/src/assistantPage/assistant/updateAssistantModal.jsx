import React, { Component } from 'react';
import axios from 'axios';
import validate from '../../home/js/validation';
import $ from 'jquery';

class UpdateAssistantModal extends Component {
    state = {
        updateAssistantNameValidation: {
            message: "Assistant's name cannot be empty.",
            isCorrect: true,
        },
        updateAssistantDescValidation: {
            message: "Description cannot be empty.",
            isCorrect: true,
        },

        assistantUpdateStatus: null,
        updateAssistantName: null,
        updateAssistantDesc: null,
    }

    componentDidUpdate = () => {
        let { assistantName, assistantDesc } = this.props.updateAssistantDetails;
        let { updateAssistantName, updateAssistantDesc } = this.state;
        if (updateAssistantName === null) {
            document.getElementById('update-assistantName').value = assistantName.slice(0, -5);
        }
        else {
            document.getElementById('update-assistantName').value = updateAssistantName;
        }
        if (updateAssistantDesc === null) {
            document.getElementById('update-assistantDesc').value = assistantDesc;
        }
        else {
            document.getElementById('update-assistantDesc').value = updateAssistantDesc;
        }
    }

    //-----------------------------------------------------------------UPDATE ASSISTANT AXIOS-------------------------------------------------------------



    updateAssistant = () => {
        // get userId from sessionStorage.
        let { userId } = JSON.parse(sessionStorage.getItem('userDetails'));

        let { assistantId, assistantName, assistantDesc } = this.props.updateAssistantDetails;
        let {
            updateAssistantNameValidation,
            updateAssistantDescValidation,
            updateAssistantName,
            updateAssistantDesc } = this.state;

        if (!updateAssistantNameValidation.isCorrect || !updateAssistantDescValidation.isCorrect) {
            if (updateAssistantName === "") {
                updateAssistantNameValidation.isCorrect = false;
                document.getElementById('update-assistantName').style.borderColor = "#ff0000";
            }
            if (updateAssistantDesc && updateAssistantDesc.trim() === "") {
                updateAssistantDescValidation.isCorrect = false;
                document.getElementById('update-assistantDesc').style.borderColor = "#ff0000";
            }
            this.setState({
                updateAssistantNameValidation: updateAssistantNameValidation,
                updateAssistantDescValidation: updateAssistantDescValidation
            })
            // Return if any input is not valid
            return;
        }

        if (updateAssistantName === null && assistantName !== "") {
            updateAssistantName = assistantName;
        }
        if (updateAssistantDesc === null && assistantDesc !== "") {
            updateAssistantDesc = assistantDesc;
        }
        try {
            axios({
                method: 'get',
                url: 'http://localhost:5000/assistant/update',
                params: {
                    userId: userId,
                    assistantName: updateAssistantName,
                    assistantDesc: updateAssistantDesc,
                    assistantId: assistantId,

                },

            }).then((response) => {
                /*
                Has 2 Boolean values as parameters in the response.data object.

                -> responseStatus = True when Assistant has been upadted successfully, Else False
                -> doesAssistantExist = True when an assistant with the given name already exists, else False

                */
                let { responseStatus, doesAssistantExist } = response.data;
                this.setState({ assistantUpdateStatus: responseStatus })

                // Get getAssistant method from props and call the function.
                let { getAssistants } = this.props;
                getAssistants(userId);


                if (responseStatus) {
                    setTimeout(() => { this.clearState() }, 1000)
                }

                // If Assistant already exists, Print error message.
                if (doesAssistantExist) {
                    this.setState({
                        updateAssistantNameValidation: {
                            message: "Assistant with this name already exists.",
                            isCorrect: false,
                        },
                    })
                    // Set border color of assistantName field to red
                    document.getElementById('update-assistantName').style.borderColor = "#ff0000";
                }
            });
        }
        catch (e) {
            console.log(e);
        }
    }

    // -------------------------------------------------------------NECESSARY HANDLER FUNCTIONS FOR UPDATE -----------------------------------------------

    // Handler function for update assistant name textfield.
    updateAssistantNameChange = (e) => {
        let text = e.target.value;
        // Validate the text entered
        let validationResults = validate(text, 'name', 0);
        let { isNotEmpty, hasCorrectCharacters } = validationResults;

        // If Empty
        if (!isNotEmpty) {
            this.setState({
                updateAssistantNameValidation: {
                    message: "Assistant's name cannot be empty.",
                    isCorrect: false,
                },
                updateAssistantName: text
            })
            // Set border color of assitant name field in update modal to red
            document.getElementById('update-assistantName').style.borderColor = "#ff0000";

            // If invalid characters are used
        } else if (!hasCorrectCharacters) {
            this.setState({
                updateAssistantNameValidation: {
                    message: "Assistant's name should only contain alphabets.",
                    isCorrect: false,
                },
                updateAssistantName: text
            })
            // Set border color of assitant name field in update modal to red
            document.getElementById('update-assistantName').style.borderColor = "#ff0000";
            // If valid
        } else {
            this.setState({
                updateAssistantNameValidation: {
                    message: "Success",
                    isCorrect: true,
                },
                updateAssistantName: text
            })
            // Set border color of assitant name field in update modal to green
            document.getElementById('update-assistantName').style.borderColor = "#32cd32";
        }
    }

    // Handler function for update description textarea
    updateAssistantDescChange = (e) => {
        let text = e.target.value;
        let validationResults = validate(text, 'name', 0);
        let { isNotEmpty } = validationResults;
        if (!isNotEmpty) {
            this.setState({
                updateAssistantDescValidation: {
                    message: "Assistant's name cannot be empty.",
                    isCorrect: false,
                },
                updateAssistantDesc: text
            })
            // Set border color of assitant description field in update modal to red
            document.getElementById('update-assistantDesc').style.borderColor = "#ff0000";
        } else {
            this.setState({
                updateAssistantDescValidation: {
                    message: "Success",
                    isCorrect: true,
                },
                updateAssistantDesc: text
            })
            // Set border color of assitant description field in update modal to green
            document.getElementById('update-assistantDesc').style.borderColor = "#32cd32";
        }
    }

    // Called when the create/update modal is closed
    clearState = () => {
        // Clears state related to create and update details whenever the modal is closed.
        let { setUpdateAssistantDetails } = this.props;
        let updateAssistantDetails = {
            assistantName: "",
            assistantDesc: "",
            assistantId: undefined
        }
        setUpdateAssistantDetails(updateAssistantDetails)
        this.setState({
            assistantUpdateStatus: null,
            updateAssistantDescValidation: {
                message: "",
                isCorrect: true,
            },
            updateAssistantDesc: null,
            updateAssistantNameValidation: {
                message: "",
                isCorrect: true,
            },
            updateAssistantName: null,
        })
        // Sets border color of all input fields to the default gray color.
        document.getElementById('update-assistantName').style.borderColor = "#cccccc";
        document.getElementById('update-assistantDesc').style.borderColor = "#cccccc";;
        document.getElementById('update-assistantName').value = "";
        document.getElementById('update-assistantDesc').value = "";

        $("#updateAssistant").modal("hide");
    }
    render() {

        let {
            updateAssistantNameValidation,
            updateAssistantDescValidation,
            assistantUpdateStatus } = this.state;

        let { assistantName, assistantDesc } = this.props.updateAssistantDetails;

        return (
            <React.Fragment>
                {/* Modal to update Assistant */}
                < div className="modal fade" id="updateAssistant" tabIndex="-1" aria-labelledby="updateAssistantModal" aria-hidden="true" >
                    <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="updateAssistantModal">Update Assistant Info</h5>
                                <button onClick={() => this.clearState()} type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>

                            </div>
                            {/* Displays success or failure alert. */}
                            <div className="modal-body">
                                {/* Prints Success alert message if assistant has been updated succesffuly */}
                                {assistantUpdateStatus === true ?
                                    <div className="alert alert-success alert-dismissible fade show" role="alert">
                                        Assistant has been updated Successfully!
                            </div>
                                    : null}
                                {/* Prints error alert message if assistant was not updated. */}
                                {assistantUpdateStatus === false ?
                                    <div className="alert alert-danger alert-dismissible fade show" role="alert">
                                        Failed to update Assistant!
                            </div>
                                    : null}

                                <div className="container" id="override-boostrap">
                                    {/* Input Fields */}
                                    <form>
                                        <div className="form-group">
                                            <label htmlFor="update-assistantName">Assistant's Name </label>
                                            <input
                                                onChange={this.updateAssistantNameChange}
                                                defaultValue={assistantName.slice(0, -5)}
                                                type="text"
                                                className="form-control"
                                                id="update-assistantName"
                                                aria-describedby="update-assistantName"
                                            />

                                            {/* Prints small red error message if the input is not valid */}
                                            {updateAssistantNameValidation.isCorrect === false ?
                                                <small className="form-text error">{updateAssistantNameValidation.message}</small>
                                                :
                                                null
                                            }
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="update-assistantDesc"> Description</label>
                                            <textarea
                                                onChange={this.updateAssistantDescChange}
                                                defaultValue={assistantDesc}
                                                className="form-control"
                                                id="update-assistantDesc"
                                                rows="3" />
                                            {/* Prints small red error message if the input is not valid */}
                                            {updateAssistantDescValidation.isCorrect === false ?
                                                <small className="form-text error">{updateAssistantDescValidation.message}</small>
                                                :
                                                null
                                            }
                                        </div>
                                    </form>
                                </div>
                            </div>
                            {/* Footer */}
                            <div className="modal-footer">
                                <button type="button" onClick={() => this.clearState()} className="btn btn-outline-danger" data-dismiss="modal">Cancel</button>
                                <button type="button" onClick={this.updateAssistant} className="btn btn-primary">Update</button>
                            </div>
                        </div>
                    </div >
                </div >
                {/* End of Modal to update assistant */}
            </React.Fragment>
        );
    }
}

export { UpdateAssistantModal };