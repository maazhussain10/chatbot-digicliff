import React, { Component } from 'react';
import axios from 'axios';


class DisplayAssistant extends Component {

    state = {
        checkDelete: false
    }
    //------------------------------------------------------------------DELETE ASSISTANT AXIOS----------------------------------------------------------------------

    deletion = (e) => {
        if (e.target.value === "DELETE") this.setState({ checkDelete: true });
        else this.setState({ checkDelete: false });
    }

    handleDeleteAssistant = (assistantName) => {
        if (!this.state.checkDelete) return;
        let { username } = JSON.parse(sessionStorage.getItem('userDetails'));
        try {
            axios({
                method: 'get',
                url: 'http://localhost:5000/assistant/delete',
                params: {
                    username: username,
                    assistantName: assistantName
                },
            }).then((response) => {
                // get username from sessionStorage.
                let { getAssistants } = this.props;
                getAssistants(username);
            });
        }
        catch (e) {
            console.log(e);
        }
    }
    //------------------------------------------------------------------ADD ASSISTANT ID TO STATE OF PARENT ( UPDATE )----------------------------------------------------------------------

    setUpdateAssistantDetails = () => {
        let { setUpdateAssistantDetails, assistant } = this.props;
        setUpdateAssistantDetails(assistant);
    }

    //------------------------------------------------------------------RENDER----------------------------------------------------------------------
    render() {
        let { assistant, handleAssistant } = this.props;


        // Returns empty span tag if assistant is undefined (When Assistant doesnt exist).
        if (!assistant)
            return (<span></span>);

        // get username from sessionStorage.
        let { username } = JSON.parse(sessionStorage.getItem('userDetails'));
        let { assistantName, assistantId, assistantDesc } = assistant;
        return (
            <React.Fragment>
                <div className="card text-center">
                    <div className="card-body">
                        <div className="d-flex justify-content-end">
                            <div className="btn-group" role="group" aria-label="Basic example">
                                {/* Update Assistant Button */}
                                <button onClick={() => this.setUpdateAssistantDetails(assistantName, assistantDesc)} type="button" data-toggle="modal" data-target="#updateAssistant" className="btn btn-sm btn-outline-success">
                                    <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-pencil-square" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456l-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                        <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
                                    </svg>
                                </button>
                                {/* Delete Assistant Button 
                                    Calls handleDeleteAssitant() function when clicked.
                                */}
                                <button type="button" className="btn btn-sm btn-outline-danger" data-toggle="modal" data-target="#confirmDelete">
                                    <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-person-dash-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm5-.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <h5 className="card-title text-center">{assistantName}</h5>
                        <p className="card-text text-center">{assistantDesc}</p>
                        <a href={`/assistant/${username}/${assistantName}`} onClick={() => handleAssistant(assistantName, assistantDesc, assistantId)} className="btn btn-primary text-center">Build</a>
                    </div>
                    <div className="card-footer text-muted">
                        {/* Add time here */}
                        2 days ago
                    </div>

                </div>
                <div className="modal fade" id="confirmDelete" tabIndex="-1" data-backdrop="static" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Are you sure you want to delete this assistant?</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <p>Type <strong>DELETE</strong> to delete this assitant</p>
                                <input
                                    onChange={this.deletion}
                                    type="text"
                                    className="form-control"
                                    id="inputDeleteConfirmation"
                                />

                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-success" data-dismiss="modal">Cancel</button>
                                <button type="button" onClick={() => this.handleDeleteAssistant(assistantName)} className="btn btn-outline-danger" data-dismiss="modal">Delete</button>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment >
        );
    }
}

export { DisplayAssistant };