import React, { Component } from 'react';
import './css/buttonalign.css';
import './css/assistant.css';
import { Navbar } from './navbar';
import axios from 'axios';
import { CreateAssistantModal } from './assistant/createAssistantModal';
import { UpdateAssistantModal } from './assistant/updateAssistantModal';
import { DisplayAssistant } from './assistant/displayAssistant';

class AssistantPage extends Component {
    state = {
        existingAssistants: [],
        updateAssistantDetails: {
            assistantName: "",
            assistantDesc: "",
            assistantId: undefined
        }
    }

    //------------------------------------------------------------------SESSION STORAGE----------------------------------------------------------------------
    componentWillUnmount() {
        this._isMounted = false;
    }

    componentDidMount() {
        this._isMounted = true;

        // Get Assistants from backend 
        let { username } = JSON.parse(sessionStorage.getItem('userDetails'));
        this.getAssistants(username);
    }
    //------------------------------------------------------------------GET ASSISTANTS AXIOS----------------------------------------------------------------------

    getAssistants = (username) => {
        try {
            axios({
                method: 'get',
                url: 'http://localhost:5000/assistant',
                params: {
                    username: username
                },
            }).then((response) => {

                if (this._isMounted) {
                    this.setState({ existingAssistants: response.data });
                }
            });
        }
        catch (e) {
            console.log(e);
        }
    }



    //------------------------------------------------------------------ASSSISTANT DETAILS----------------------------------------------------------------------

    /* Called when update buton of an assistant is clicked.
    Used to determine the Id of the assistant to be updated and to set the default value of input fields in the modal.
    */
    setUpdateAssistantDetails = async (assistant) => {
        await this.setState({
            updateAssistantDetails: assistant,
        })
    }


    //-----------------------------------------------------------------HANDLE BUILD BUTTON OF ASSISTANT---------------------------------------------------------------



    // Called when the user clicks on an intent to enter it.
    handleAssistant = (name, description, id) => {
        let assistantDetails = { assistantName: name, assistantId: id, description: description }

        // Storing Assistants name and id in session storage
        sessionStorage.setItem('assistantDetails', JSON.stringify(assistantDetails))

        // Update last modified here
    }


    //-----------------------------------------------------------------RENDER------------------------------------------------------------------------
    render() {
        let {
            existingAssistants,
            updateAssistantDetails,
        } = this.state;
        return (
            <React.Fragment>
                <Navbar
                    userName={this.state.username}
                />
                <div className="container">
                    <button type="button" className="btn btn-lg btn-primary button" data-toggle="modal" data-target="#createAssistantModal">
                        Create an Assistant
                        </button>
                </div>
                {/* Display 2 cards in a row */}
                {existingAssistants.slice(0, existingAssistants.length / 2 + 1).map((assistant, index) => (
                    <div className="container" style={{ fontFamily: 'Tinos' }} key={index}>
                        <div className="row text-center">
                            <div className="col-sm-6">
                                <DisplayAssistant
                                    assistant={existingAssistants[2 * index]}
                                    setUpdateAssistantDetails={this.setUpdateAssistantDetails}
                                    handleAssistant={this.handleAssistant}
                                    updateAssistant={this.updateAssistant}
                                    getAssistants={this.getAssistants}
                                />
                            </div>
                            <div className="col-sm-6">
                                <DisplayAssistant
                                    assistant={existingAssistants[2 * index + 1]}
                                    setUpdateAssistantDetails={this.setUpdateAssistantDetails}
                                    handleAssistant={this.handleAssistant}
                                    updateAssistant={this.updateAssistant}
                                    getAssistants={this.getAssistants}
                                />
                            </div>
                        </div>
                    </div >
                ))
                }

                {/* Modals */}
                <CreateAssistantModal
                    getAssistants={this.getAssistants} />
                <UpdateAssistantModal
                    updateAssistantDetails={updateAssistantDetails}
                    getAssistants={this.getAssistants}
                    setUpdateAssistantDetails={this.setUpdateAssistantDetails} />
            </React.Fragment>
        );
    }
}

export { AssistantPage };