import React, { Component } from 'react';
import axios from 'axios';

class DatabaseConnection extends Component {
    state = {}

    //------------------------------------------------------------KNOWLEDGE STORE AXIOS------------------------------------------------------------
    connectDatabase = () => {
        // Get the necessary details ( userId, assistantId )
        let { userId } = JSON.parse(sessionStorage.getItem('userDetails'));
        let { assistantId } = JSON.parse(sessionStorage.getItem('assistantDetails'));

        // Get the values entered by the user.
        let username = document.getElementById('dbUsername').value;
        let password = document.getElementById('dbPassword').value;
        let databaseName = document.getElementById('databaseName').value;

        // Send a request to the express server ()
        try {
            axios({
                method: 'post',
                url: 'http://localhost:5000/addDatabaseDetails',
                params: {
                    userId: userId,
                    assistantId: assistantId,
                    username: username,
                    databaseName: databaseName,
                    password: password
                },

            }).then((response) => {
            });
        }
        catch (e) {
            console.log(e);
        }
    }


    render() {
        return (
            <div className="modal fade" id="databaseModal" tabIndex="-1" aria-labelledby="databaseConnectionModal" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="databaseConnectionModal">Database Connection</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="container ">
                                <form>
                                    <div className="form-group">
                                        <small id="db-username" className="form-text text-muted"><svg width="0.5em" height="0.5em" viewBox="0 0 16 16" className="bi bi-asterisk" fill="red" xmlns="http://www.w3.org/2000/svg">
                                            <path fillRule="evenodd" d="M8 0a1 1 0 0 1 1 1v5.268l4.562-2.634a1 1 0 1 1 1 1.732L10 8l4.562 2.634a1 1 0 1 1-1 1.732L9 9.732V15a1 1 0 1 1-2 0V9.732l-4.562 2.634a1 1 0 1 1-1-1.732L6 8 1.438 5.366a1 1 0 0 1 1-1.732L7 6.268V1a1 1 0 0 1 1-1z" />
                                        </svg> Note that this only supports SQL DB <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-table" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                <path fillRule="evenodd" d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm15 2h-4v3h4V4zm0 4h-4v3h4V8zm0 4h-4v3h3a1 1 0 0 0 1-1v-2zm-5 3v-3H6v3h4zm-5 0v-3H1v2a1 1 0 0 0 1 1h3zm-4-4h4V8H1v3zm0-4h4V4H1v3zm5-3v3h4V4H6zm4 4H6v3h4V8z" />
                                            </svg></small>
                                        <br />
                                        <label htmlFor="dbUsername">Username</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="dbUsername"
                                            aria-describedby="db-username"
                                        />
                                        <small id="db-username" className="form-text text-muted">Type the username of your SQL DB</small>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="assistantDesc">Password</label>
                                        <input
                                            type="password"
                                            id="dbPassword"
                                            className="form-control"
                                        />
                                        {/* <small id="emailHelp" className="form-text text-muted">Describe The purpose of this intent</small> */}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="assistantDesc">Database Name</label>
                                        <input
                                            id="databaseName"
                                            type="text"
                                            className="form-control"
                                        />
                                        <small id="emailHelp" className="form-text text-muted">Enter the Database Name</small>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-outline-danger" data-dismiss="modal">Close</button>
                            <button type="button" onClick={() => this.connectDatabase()} data-dismiss="modal" className="btn btn-primary">Connect</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export { DatabaseConnection };