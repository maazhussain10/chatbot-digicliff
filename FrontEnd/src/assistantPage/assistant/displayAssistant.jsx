import React, { Component } from 'react';
import axios from 'axios';


class DisplayAssistant extends Component {


    //------------------------------------------------------------------DELETE ASSISTANT AXIOS----------------------------------------------------------------------
    handleDeleteAssistant = (id) => {
        try {
            axios({
                method: 'get',
                url: 'http://localhost:5000/assistant/delete',
                params: {
                    assistantId: id
                },

            }).then((response) => {
                // get userId from sessionStorage.
                let { userId } = JSON.parse(sessionStorage.getItem('userDetails'));
                let { getAssistants } = this.props;
                getAssistants(userId);

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
                                <button type="button" onClick={() => this.handleDeleteAssistant(assistantId)} className="btn btn-sm btn-outline-danger">
                                    <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-person-dash-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm5-.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <h5 className="card-title text-center">{assistantName.slice(0, -5)}</h5>
                        <p className="card-text text-center">{assistantDesc}</p>
                        <a href={`/assistant/${username}/${assistantName}`} onClick={() => handleAssistant(assistantName, assistantDesc, assistantId)} className="btn btn-primary text-center">Build</a>
                    </div>
                    <div className="card-footer text-muted">
                        {/* Add time here */}
                        2 days ago
                            </div>
                </div>
            </React.Fragment >
        );
    }
}

export { DisplayAssistant };