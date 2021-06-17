import React, { Component } from 'react';
import axios from 'axios';
import $ from 'jquery';
import './css/buttonAllignment.css'
class DisplayIntent extends Component {
    state = {
    }


    componentDidMount = () => {
        $(document).on('click', ".button-group", function (e) {
            e.stopPropagation();
            e.preventDefault();
        });
    }
    //------------------------------------------------------------------DELETE INTENT AXIOS----------------------------------------------------------------------
    handleDeleteIntent = () => {
        let { intentName } = this.props.intent;
        let { username } = JSON.parse(sessionStorage.getItem('userDetails'));
        let { assistantName } = JSON.parse(sessionStorage.getItem('assistantDetails'));

        try {
            axios({
                method: 'get',
                url: 'http://localhost:5000/intent-delete',
                params: {
                    username: username,
                    assistantName: assistantName,
                    intentName: intentName
                },

            }).then((response) => {
                const { getIntents } = this.props;
                getIntents(assistantName);
            })
        }
        catch (e) {
            console.log(e);
        }
    }

    //------------------------------------------------------------------INTENT DETAILS HANDLING----------------------------------------------------------------------

    handleIntent = () => {
        let { intentName, intentDesc } = this.props.intent;
        let intentDetails = { intentName: intentName, intentDesc: intentDesc }
        // Add current intent details to Session storage.
        sessionStorage.setItem('intentDetails', JSON.stringify(intentDetails))
        // Update time modified here

    }
    //------------------------------------------------------------------Session Storage of Intent Id (Update)----------------------------------------------------------------------

    setUpdateIntentDetails = () => {
        let { intent, setUpdateIntentDetails } = this.props;
        setUpdateIntentDetails(intent)
    }

    setFollowUpIntentDetails = () => {
        let { intent, setFollowUpIntentDetails } = this.props;
        setFollowUpIntentDetails(intent)
    }



    //------------------------------------------------------------------RENDER----------------------------------------------------------------------
    render() {
        let { intent } = this.props;
        // Get the necessary details ( username, assistantName, intentName )
        let { username } = JSON.parse(sessionStorage.getItem('userDetails'));
        let { assistantName } = JSON.parse(sessionStorage.getItem('assistantDetails'));
        const { intentName, intentDesc } = intent;

        return (
            <React.Fragment>
                <div className="card text-center style">
                    <a className="intentCard" onClick={() => this.handleIntent()} href={`/assistant/${username}/${assistantName}/${intentName}`}>
                        <div className="card-body">

                            <div className="row">
                                <h5 className="card-title col-md-3">{intentName}</h5>
                                <p className="card-text col-md-7">{intentDesc} </p>
                                <div className="col-md-2 d-flex justify-content-end">
                                    <div className="button-group" role="group" aria-label="Basic example">
                                        <button onClick={() => this.setFollowUpIntentDetails()} type="button" data-toggle="modal" data-target="#followUpIntent" className="btn btn-sm btn-outline-primary mr-1">
                                            <i className="fas fa-plus"></i>
                                        </button>
                                        <button onClick={() => this.setUpdateIntentDetails()} type="button" data-toggle="modal" data-target="#updateIntent" className="btn btn-sm mr-1 btn-outline-success">
                                            <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-pencil-square" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456l-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                                <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
                                            </svg>
                                        </button>
                                        <button onClick={() => this.handleDeleteIntent()} type="button" className="btn btn-sm btn-outline-danger">
                                            <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-trash-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                <path fillRule="evenodd" d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5a.5.5 0 0 0-1 0v7a.5.5 0 0 0 1 0v-7z" />
                                            </svg>
                                        </button>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </a>
                </div>
            </React.Fragment >
        );
    }
}

export { DisplayIntent };