import React, { Component } from 'react';
import axios from 'axios';
import $ from 'jquery';

class Entity extends Component {
    state = {
        entityType: ['name', 'number', 'email', 'phoneNumber', 'ordinal', 'date', 'other'],
        entityDetails: ['This is Name Entity. Condition to use: Use in seperate Dialogue',
            'It finds numbers like 1,2,3 and one, two, three',
            'It gets the email from the user message',
            'It takes the phone Number from the user message',
            'It gets the ordinal numbers as 1st, 2nd, 3rd, 4th',
            'It gets the date which the user gives in various formats',
            'Create your own Entity Name and use it anywhere.'],
        selectedColumns: [],
        entityNames:[]
    }

    componentDidMount() {
        this.getEntity();
    }

    deleteEntity = (entity) => {
        let { username } = JSON.parse(sessionStorage.getItem('userDetails'));
        let { assistantName } = JSON.parse(sessionStorage.getItem('assistantDetails'));
        let { intentName } = JSON.parse(sessionStorage.getItem('intentDetails'));
        try {
            axios({
                method: 'get',
                url: 'http://localhost:5000/delete-entity',
                params: {
                    username: username,
                    assistantName: assistantName,
                    intentName: intentName,
                    entityType: entity
                },

            }).then((response)=>{
                this.getEntity();
            })
        }
        catch (e) {
            console.log(e);
        }
    }

    createEntity = () => {
        let { selectedColumns } = this.state;
        let entityName = {}
        for (let i = 0; i < selectedColumns.length; i++) {
            entityName[selectedColumns[i]] = document.getElementById(selectedColumns[i] + '-input').value;
        }

        // Get username, assistantName and intentName.
        let { username } = JSON.parse(sessionStorage.getItem('userDetails'));
        let { assistantName } = JSON.parse(sessionStorage.getItem('assistantDetails'));
        let { intentName } = JSON.parse(sessionStorage.getItem('intentDetails'));
        try {
            axios({
                method: 'post',
                url: 'http://localhost:5000/create-entity',
                params: {
                    username: username,
                    assistantName: assistantName,
                    intentName: intentName,
                    selectedColumns: selectedColumns,
                    entityName: entityName
                },
            })
        }
        catch (e) {
            console.log(e);
        }
    }

    getEntity = () => {
        let { username } = JSON.parse(sessionStorage.getItem('userDetails'));
        let { assistantName } = JSON.parse(sessionStorage.getItem('assistantDetails'));
        let { intentName } = JSON.parse(sessionStorage.getItem('intentDetails'));
        try {
            axios({
                method: 'get',
                url: 'http://localhost:5000/get-entity',
                params: {
                    username: username,
                    assistantName: assistantName,
                    intentName: intentName,
                },

            }).then(async(response) => {
                for (let i = 0; i < response.data.length; i++) {
                    $('#' + response.data[i].entityType + '-input').removeClass('invisible');
                    document.getElementById(response.data[i].entityType + '-select').checked=true;
                    await this.selectColumn(response.data[i].entityType);
                    document.getElementById(response.data[i].entityType + '-input').defaultValue = response.data[i].entityName;
                }
            });
        }
        catch (e) {
            console.log(e);
        }
    }

    handleSelect = (entity) => {
        const selected = document.getElementById(entity + "-select").checked;
        if (selected) {
            this.setState({ selected: true });
            this.selectColumn(entity);
        }
        else {
            this.setState({ selected: false });
            this.removeColumn(entity);
        }
    }

    selectColumn = (entityType) => {
        let { selectedColumns } = this.state;
        if (!selectedColumns.includes(entityType))
            selectedColumns.push(entityType);
        this.setState({ selectedColumns: selectedColumns });
        $('#' + entityType + '-input').removeClass('invisible');
    }

    removeColumn = (entityType) => {
        let { selectedColumns } = this.state;
        const index = selectedColumns.indexOf(entityType);
        if (index > -1) {
            selectedColumns.splice(index, 1);
        }
        this.setState({ selectedColumns: selectedColumns });
        $('#' + entityType + '-input').addClass('invisible');
    }
    functions = () => {
        $(function () {
            $('[data-toggle="tooltip"]').tooltip()
        })
    }

    render() {
        let { entityType, entityDetails } = this.state;
        return (
            <div className="modal fade" id="entity" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">ENTITY</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="container">
                                {entityType.map((entity, index) => (
                                    <React.Fragment key={index}>
                                        <div className="row">
                                            <div className="col-md-5">
                                                <div className="custom-control custom-switch">
                                                    <input type="checkbox" onClick={() => this.handleSelect(entity)} className="custom-control-input" id={entity + "-select"} />
                                                    <label className="custom-control-label" htmlFor={entity + "-select"} >{entity}</label>
                                                    <i className="fa fa-info-circle" aria-hidden="true" data-toggle="tooltip" data-placement="right" title={entityDetails[index]}  ></i>
                                                </div>
                                            </div>
                                            <input id={entity + "-input"} className="col-md-6 form-control invisible" />
                                            <button onClick={() => this.deleteEntity(entity)} type="button" className="btn btn-sm btn-outline-danger col-md-1">
                                            <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-trash-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                <path fillRule="evenodd" d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5a.5.5 0 0 0-1 0v7a.5.5 0 0 0 1 0v-7z" />
                                            </svg>
                                        </button>
                                        </div>
                                        <br />
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-outline-danger" data-dismiss="modal">Close</button>
                            <button type="button" onClick={() => this.createEntity()} className="btn btn-primary">Save</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export { Entity };