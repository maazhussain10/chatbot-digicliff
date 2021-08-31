import React, { Component } from 'react';
import axios from 'axios';
import $ from 'jquery';
import URL from '../../websiteURL';

class CreateChip extends Component {
    state = {
    }

    componentDidMount = () => {
        let { getExistingChips } = this.props;
        getExistingChips();
    }

    createChip = () => {
        // Get the necessary details ( username, assistantName, intentName )
        let { username } = JSON.parse(sessionStorage.getItem('userDetails'));
        let { assistantName } = JSON.parse(sessionStorage.getItem('assistantDetails'));
        let { intentName } = JSON.parse(sessionStorage.getItem('intentDetails'));

        let chipValue = document.getElementById('input-chipvalue').value;
        let useQuery = document.getElementById('useQueryChip').checked;

        if (chipValue.length === 0) {
            return;
        }
        try {
            axios({
                method: 'post',
                url: 'http://' + URL + ':5000/chip',
                params: {
                    username: username,
                    assistantName: assistantName,
                    intentName: intentName,
                    chipResponse: chipValue,
                    usingQueries: useQuery,
                },

            }).then((response) => {
                document.getElementById('input-chipvalue').value = "";
                let { getExistingChips, disable } = this.props;
                getExistingChips();
                disable();
            })
        }
        catch (e) {
            console.log(e);
        }
    }

    chipValueKeyPress = (e) => {
        if (e.keyCode === 13) {
            this.createChip();
            $('#createChip').modal("hide");
        }
    }

    render() {
        return (
            <React.Fragment>
                <button type="button" className="btn btn-primary" data-toggle="collapse" data-target="#createChip" disabled={this.props.disableChip}>
                    Add chips
                </button>
                <div className="collapse" id="createChip">
                    <div className="card card-body">
                        <div className="input-group mb-3">
                            <div className="input-group-prepend">
                                <span className="input-group-text"><svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-view-list" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M3 4.5h10a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2zm0 1a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1H3zM1 2a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13A.5.5 0 0 1 1 2zm0 12a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13A.5.5 0 0 1 1 14z" />
                                </svg></span>
                            </div>
                            <input
                                onKeyDown={this.chipValueKeyPress}
                                id="input-chipvalue"
                                type="text" className="form-control" aria-label="create chips" />

                        </div>
                        <div className="custom-control custom-switch">
                            <input type="checkbox" className="custom-control-input" id="useQueryChip" />
                            <label className="custom-control-label" htmlFor="useQueryChip">Use Query</label>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export { CreateChip };