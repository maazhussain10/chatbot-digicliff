import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import URL from '../../websiteURL';

class Profile extends Component {
    state = {
        assistant: false,
        existingAssistant: [],
        conformDeactivate: false
    }

    handleLogout = () => {
        sessionStorage.clear();
    }

    componentDidMount() {
        let { username } = JSON.parse(sessionStorage.getItem('userDetails'));
        if (username)
            this.getAssistant(username);
    }

    getAssistant = (username) => {
        try {
            axios({
                method: 'get',
                url: 'http://' + URL + ':5000/assistant',
                params: {
                    username: username
                },

            }).then((response) => {

                this.setState({ existingAssistant: response.data });

            });
        }
        catch (e) {
            console.log(e);
        }
    }

    deactivateAccount = () => {
        let { username } = JSON.parse(sessionStorage.getItem('userDetails'));
        try {
            axios({
                method: 'get',
                url: 'http://' + URL + ':5000/deactivate-account',
                params: {
                    username: username
                },

            }).then((response) => {
                this.handleLogout();
            });
        }
        catch (e) {
            console.log(e);
        }
    }
    renderAssistant = () => {
        if (this.state.assistant === false) {
            this.setState({ assistant: true });
            // this.setState({ states: false });
        }
        else
            this.setState({ assistant: false });
    }
    render() {
        let userDetails = JSON.parse(sessionStorage.getItem("userDetails"));
        if (!userDetails) {
            return (
                <Redirect to="/#" />
            )
        }
        else {
            const { username, firstName, lastName, email } = userDetails;
            const { existingAssistant } = this.state;

            return (
                <React.Fragment>
                    <nav className="navbar navbar-expand-lg navbar-light sticky-to container">
                        <a className="brandname" href="/#">AnyBot</a>
                        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>

                        <div className="collapse navbar-collapse" id="navbarSupportedContent">

                            <ul className="ml-auto navbar-na text-center nav nav-pills" id="pills-tab" role="tablist">
                                <li className="nav-item" role="presentation">
                                    <a className="nav-link active navlinks" id="pills-profile-tab" data-toggle="pill" href="#pills-profile" role="tab" aria-controls="pills-profile" aria-selected="true">Profile</a>
                                </li>
                                <li className="nav-item" role="presentation">
                                    <a className="nav-link navlinks" id="pills-assistant-tab" data-toggle="pill" href="#pills-assistant" role="tab" aria-controls="pills-assistant" aria-selected="false">Assitants   <span className="badge badge-light">{existingAssistant.length}</span></a>
                                </li>
                                <li className="nav-item" role="presentation">
                                    <a
                                        className="nav-link navlinks" id="pills-integs-tab" data-toggle="pill" href="#pills-integs" role="tab" aria-controls="pills-integs" aria-selected="false">Integrations</a>
                                </li>
                                <li className="nav-item" role="presentation">
                                    <a
                                        className="nav-link navlinks" id="pills-stats-tab" data-toggle="pill" href="#pills-stats" role="tab" aria-controls="pills-stats" aria-selected="false">Stats</a>
                                </li>
                            </ul>

                        </div>
                    </nav>
                    <div className="tab-content" id="pills-tabContent">
                        <div className="tab-pane fade show active" id="pills-profile" role="tabpanel" aria-labelledby="pills-profile-tab">
                            <div className="mt-5 container">
                                <div className="card shadow-lg text-center">
                                    <div className="card-body pb-5">
                                        <div className="d-flex justify-content-end">
                                            <button className="btn btn-sm btn-outline-warning">
                                                <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-pencil-square" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456l-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                                    <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
                                                </svg>
                                            </button>
                                        </div>
                                        <h3 className="card-title mb-2 text-muted"><b>User Information</b></h3>
                                        <h5 className="card-title pt-3"><b>Name:   </b> {firstName} {lastName}</h5>
                                        <h6 className="card-subtitle mb-2 "><b>Username:   </b> {username}</h6>
                                        <p className="card-text"><b>E-Mail:   </b> {email}</p>

                                        <div className="container">
                                            <button type="button" className="btn btn-outline-danger" data-toggle="modal" data-target="#createDeactivateModal">
                                                Deactivate Account
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal fade" id="createDeactivateModal" tabIndex="-1" aria-labelledby="deactiveAccount" aria-hidden="true">
                            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title" id="deactiveAccount">Deactivate Account</h5>
                                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                    <div className="modal-body">
                                        Are you sure you want to deactivate your account. Deactivating your account will remove all Assistants and All datas created till now.
                                        Remember this decision cannot be undone.
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-outline-danger" data-dismiss="modal">Close</button>
                                        <a type="button" href="/#" onClick={() => this.deactivateAccount()} className="btn btn-primary">Yes, Deactivate</a>
                                    </div>
                                </div>
                            </div >
                        </div >

                        <div className="tab-pane fade" id="pills-assistant" role="tabpanel" aria-labelledby="pills-assistant-tab">
                            <div className="mt-5 container">
                                <div className="list-group text-center">
                                    {existingAssistant.map((assistant, index) => (
                                        <a href={`/assistant/${username}/${assistant.assistantName}`} className="list-group-item list-group-item-action" key={index}>{assistant.assistantName}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="tab-pane fade" id="pills-integs" role="tabpanel" aria-labelledby="pills-integs-tab">
                            <div className="mt-5 text-center container">
                                <h1>UNDER CONSTRUCTION</h1>
                            </div>
                        </div>
                        <div className="tab-pane fade" id="pills-stats" role="tabpanel" aria-labelledby="pills-stats-tab">
                            <div className="mt-5 text-center container">
                                <h1>UNDER CONSTRUCTION</h1>
                            </div>
                        </div>
                    </div>
                </React.Fragment>
            );
        }
    }
}
export { Profile };