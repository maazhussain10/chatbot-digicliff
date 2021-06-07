import React, { Component } from 'react';
import axios from 'axios';
import $ from 'jquery';

class Entity extends Component {
    state = {
        entityType: ['Name', 'Number', 'Email', 'PhoneNumber', 'Ordinal', 'Date', 'Other'],
        entityDetails: ['This is Name Entity. Condition to use: Use in seperate Dialogue',
            'It finds numbers like 1,2,3 and one, two, three',
            'It gets the email from the user message',
            'It takes the phone Number from the user message',
            'It gets the ordinal numbers as 1st, 2nd, 3rd, 4th',
            'It gets the date which the user gives in various formats',
            'Create your own Entity Name and use it anywhere.'],
        selectedColumns: [],
    }

    componentDidMount() {
        this.getEntity();
    }
    createEntity = () => {
        let { selectedColumns } = this.state;
        let entityName = {}
        for (let i = 0; i < selectedColumns.length; i++) {
            entityName[selectedColumns[i]] = document.getElementById(selectedColumns[i] + '-input').value;
        }
        console.log(entityName);

        // Get userId, assistantId and intentId.
        let { userId } = JSON.parse(sessionStorage.getItem('userDetails'));
        let { assistantId } = JSON.parse(sessionStorage.getItem('assistantDetails'));
        let { intentId } = JSON.parse(sessionStorage.getItem('intentDetails'));
        try {
            axios({
                method: 'post',
                url: 'http://localhost:5000/create-entity',
                params: {
                    userId: userId,
                    assistantId: assistantId,
                    intentId: intentId,
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
        let { intentId } = JSON.parse(sessionStorage.getItem('intentDetails'));
        try {
            axios({
                method: 'get',
                url: 'http://localhost:5000/get-entity',
                params: {
                    intentId: intentId,
                },

            }).then((response) => {
                console.log("Response: ", response.data);
                for (let i = 0; i < response.data.length; i++) {
                    this.selectColumn(response.data[i].entity_type);
                    $('#' + response.data[i].entity_type + '-input').removeClass('invisible');
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
        console.log("COLUMN1", this.state.selectedColumns);
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
                                            <input id={entity + "-input"} className="col-md-7 form-control invisible" />
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