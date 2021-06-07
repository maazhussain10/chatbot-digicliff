import React, { Component } from 'react';
import axios from 'axios';
import QueryTable from './queryTable';

class RunQuery extends Component {
    state = {
        rows: [],
        columnNames: [],
        selectedColumns: [],
        distinctColumn: undefined,
        displayTable: false,
        tableName: "",
        queryTable: [],
    }

    componentDidMount = () => {
        this.getQueryDetails();
    }

    getRows = (rows) => {
        this.setState({ rows: rows });
    }

    getQueryDetails = () => {
        // Get intentId from SessionStorage
        let { intentId } = JSON.parse(sessionStorage.getItem('intentDetails'));
        try {
            axios({
                method: 'get',
                url: 'http://localhost:5000/getQueryDetails',
                params: {
                    intentId: intentId
                },

            }).then((response) => {
                let { tableName, queryRows, selectedColumns, distinctColumn } = response.data;
                this.setState({ tableName: tableName, selectedColumns: selectedColumns, distinctColumn: distinctColumn, rows: queryRows });
                if (selectedColumns.length > 0)
                    this.getColumnNames();
            })
        }
        catch (e) {
            console.log(e);
        }
    }

    handleQuery = () => {
        try {
            // const { rows } = this.state
            const { selectedColumns, distinctColumn, tableName, rows } = this.state;
            // Get the necessary details ( userId, assistantId, intentId )
            let { userId } = JSON.parse(sessionStorage.getItem('userDetails'));
            let { assistantId } = JSON.parse(sessionStorage.getItem('assistantDetails'));
            let { intentId } = JSON.parse(sessionStorage.getItem('intentDetails'));

            axios({
                method: 'post',
                url: 'http://localhost:5000/createQuery',
                params: {
                    rows: rows,
                    selectedColumns: selectedColumns,
                    distinctColumn: distinctColumn,
                    userId: userId,
                    assistantId: assistantId,
                    intentId: intentId,
                    tableName: tableName,
                },

            }).then((response) => {
            });
        }
        catch (e) {
            console.log(e);
        }
    }

    deleteQuery = () => {
        try {
            // Get Intent Id from session storage
            let { intentId } = JSON.parse(sessionStorage.getItem('intentDetails'));

            // Send request to express server ( query.js ) to delete query from database.
            axios({
                method: 'get',
                url: 'http://localhost:5000/deleteQuery',
                params: {
                    intentId: intentId,
                },

            }).then((response) => {
                this.setState({
                    rows: [],
                    columnNames: [],
                    selectedColumns: [],
                    distinctColumn: undefined,
                    displayTable: false,
                    tableName: "",
                    queryTable: [],
                })
                // document.getElementById('input-tablename').value = "";
            });
        }
        catch (e) {
            console.log(e);
        }
    }

    getColumnNames = () => {
        const { selectedColumns, distinctColumn, tableName } = this.state;
        try {
            axios({
                method: 'get',
                url: 'http://localhost:5000/getColumnNames',
                params: {
                    tableName: tableName
                },

            }).then((response) => {
                this.setState({ columnNames: response.data, displayTable: true });
                for (let i = 0; i < selectedColumns.length; i++) {
                    document.getElementById(selectedColumns[i] + "-select").checked = true;
                }
                if (distinctColumn)
                    this.makeDistinct(distinctColumn);

            });
        }
        catch (e) {
            console.log(e);
        }
    }
    handleSelect = (columnName, index) => {
        const selected = document.getElementById(columnName + "-select").checked;
        if (selected) {
            this.setState({ selected: true });
            this.selectColumn(columnName);
        }
        else {
            this.setState({ selected: false });
            this.removeColumn(columnName);
        }

    }

    handleDistinct = (columnName, index) => {
        const selected = document.getElementById(columnName + "-distinct").checked;
        if (selected) {
            document.getElementById(columnName + "-select").checked = true;
            this.handleSelect(columnName, index);
            this.makeDistinct(columnName, index);
        }
        else {
            document.getElementById(columnName + "-select").checked = false;
            this.handleSelect(columnName, index);
            this.removeDistinct(columnName, index)
        }
    }

    selectColumn = (columnName) => {
        let { selectedColumns } = this.state;
        if (!selectedColumns.includes(columnName))
            selectedColumns.push(columnName);
        this.setState({ selectedColumns: selectedColumns });
    }

    removeColumn = (columnName) => {
        let { selectedColumns } = this.state;
        const index = selectedColumns.indexOf(columnName);
        if (index > -1) {
            selectedColumns.splice(index, 1);
        }
        this.setState({ selectedColumns: selectedColumns });
    }

    makeDistinct = (columnName) => {
        document.getElementById(columnName + "-distinct").checked = true;
        let tableRows = document.querySelectorAll('input[type = "checkbox"]')
        for (let i = 0; i < tableRows.length; i++) {
            if (tableRows[i].id !== columnName + "-select" && tableRows[i].id !== columnName + "-distinct") {
                tableRows[i].disabled = true;
                tableRows[i].checked = false;
                let tempColumnName = tableRows[i].id.split('-')[0];
                this.removeColumn(tempColumnName);
            }
            if (tableRows[i].id === columnName + "-select") {
                tableRows[i].disabled = true;
            }
        }
        this.setState({ distinctColumn: columnName });
    }

    removeDistinct = (columnName) => {
        let tableRows = document.querySelectorAll('input[type = "checkbox"]')
        for (let i = 0; i < tableRows.length; i++) {
            if (tableRows[i].id !== columnName + "-distinct") {
                tableRows[i].disabled = false;
                tableRows[i].checked = false;
            }
            if (tableRows[i].id === columnName + "-select") {
                tableRows[i].disabled = false;
            }
        }
        this.removeColumn(columnName);
        this.setState({ distinctColumn: undefined });
    }

    tableNameKeyPress = async (e) => {
        if (e.keyCode === 13) {
            let tableName = document.getElementById('input-tablename').value;
            await this.setState({ tableName: tableName })
            this.getColumnNames();
        }
    }

    addTableNameButton = async () => {
        let tableName = document.getElementById('input-tablename').value;
        await this.setState({ tableName: tableName })
        this.getColumnNames();
    }

    queryTabLinkClass = () => {
        let classes = "nav-link disabled";
        if (this.state.displayTable)
            classes = "nav-link"
        return classes;
    }

    render() {
        let { columnNames, displayTable, tableName, rows } = this.state;

        return (
            <div className="modal fade" id="runquery" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-body text-center">
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                            <ul className="nav nav-tabs row" id="myTab" role="tablist">
                                <li className="nav-item col-6" role="presentation">
                                    <a className="nav-link active" id="home-tab" data-toggle="tab" href="#home" role="tab" aria-controls="Column" aria-selected="true">Table</a>
                                </li>
                                <li className="nav-item col-6" role="presentation">
                                    {/* for making it disabled "nav-link disabled" or "nav-link" + {this.something} */}
                                    <a className={this.queryTabLinkClass()} id="profile-tab" data-toggle="tab" href="#profile" role="tab" aria-controls="Table" aria-selected="false">Queries</a>
                                </li>

                            </ul>
                            <div className="tab-content" id="myTabContent">
                                <div className="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
                                    <div className="container">
                                        <br />

                                        <div className="form-group">
                                            <div className="input-group mb-3">
                                                <div className="input-group-prepend">
                                                    <span className="input-group-text">
                                                        <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-file-spreadsheet-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                            <path fillRule="evenodd" d="M12 0H4a2 2 0 0 0-2 2v4h12V2a2 2 0 0 0-2-2zm2 7h-4v2h4V7zm0 3h-4v2h4v-2zm0 3h-4v3h2a2 2 0 0 0 2-2v-1zm-5 3v-3H6v3h3zm-4 0v-3H2v1a2 2 0 0 0 2 2h1zm-3-4h3v-2H2v2zm0-3h3V7H2v2zm4 0V7h3v2H6zm0 1h3v2H6v-2z" />
                                                        </svg>
                                                    </span>
                                                </div>
                                                <input
                                                    defaultValue={tableName}
                                                    id="input-tablename"
                                                    onKeyDown={this.tableNameKeyPress}
                                                    type="text"
                                                    className="form-control" />
                                            </div>
                                        </div>
                                        <button onClick={() => this.addTableNameButton()} type="submit" className="btn btn-primary" >
                                            Add table
                                        </button>

                                        <br />
                                        <br />
                                        {/* this part comes only after user enters table name */}
                                        {(displayTable ?
                                            <table className="table table-responsiv-md table-striped table-borderless">
                                                <thead>
                                                    <tr>
                                                        <th scope="col">S.No</th>
                                                        <th scope="col">Column Name</th>
                                                        <th scope="col">Select</th>
                                                        <th scope="col">Distinct</th>
                                                    </tr>
                                                </thead>

                                                <tbody>
                                                    {/* beginning of map func */}
                                                    {columnNames.map((column, index) => (
                                                        <tr key={index}>
                                                            <th scope="row">{index + 1}</th>
                                                            <td>{column}</td>
                                                            <td>
                                                                <div className="custom-control custom-switch">
                                                                    <input type="checkbox" id={column + "-select"} onClick={() => this.handleSelect(column)} className="custom-control-input" />
                                                                    <label className="custom-control-label" htmlFor={column + "-select"}></label>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div className="custom-control custom-switch">
                                                                    <input type="checkbox" id={column + "-distinct"} onClick={() => this.handleDistinct(column)} className="custom-control-input" />
                                                                    <label className="custom-control-label" htmlFor={column + "-distinct"}></label>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                            : null)}
                                        {/* end of that column part */}
                                    </div>
                                </div>
                                {/* tab 2 */}
                                <div className="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">
                                    <QueryTable
                                        rows={rows}
                                        getRows={this.getRows}
                                        columnNames={columnNames} />
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button onClick={() => this.deleteQuery()} type="button" className="btn btn-outline-danger">Clear Query</button>
                            <button type="button" className="btn btn-outline-danger" data-dismiss="modal">Close</button>
                            <button onClick={() => this.handleQuery()} type="button" className="btn btn-primary">Save changes</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export { RunQuery };