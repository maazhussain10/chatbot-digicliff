import React, { useState, useEffect, useContext } from 'react';
import { AccessTokenContext } from '../../accessTokenContext';
import queryService from '../../services/query.service.js';

const Table = (props) => {
    const { accessToken, setAccessToken } = useContext(AccessTokenContext);


    const handleChange = (e) => {
        if (e.target.type === 'checkbox') {
            let type = e.target.dataset.type;
            const index = props.columns.findIndex(column => column.name === e.target.name)
            const columns = [...props.columns];
            if (type === 'select') {
                columns[index].select = e.target.checked;
            }
            else if (type === 'distinct') {
                if (e.target.checked) {
                    // Set selection of all other columns to false
                    for (let i = 0; i < columns.length; i++) {
                        columns[i].select = false;
                        columns[i].distinct = false;
                        columns[i].disabled = true;
                    }
                    // Select the distinct column (To ensure that it is selected if its not already selected)
                    columns[index].select = true;
                    columns[index].disabled = false;
                } else {
                    // Enable the columns that were disabled.
                    for (let i = 0; i < columns.length; i++) {
                        columns[i].disabled = false;
                    }
                }
                columns[index].distinct = e.target.checked;
            }
            props.setColumns(columns);
        } else if (e.target.type === 'text')
            props.setTableName(e.target.value);
    }


    return (
        <React.Fragment>
            <div className="container mt-4 mb-4">
                <form className="form-group" style={{ width: 'inherit' }} onSubmit={props.getColumnNames}>
                    <div className="input-group mb-3">
                        <div className="input-group-prepend">
                            <span className="input-group-text">
                                <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-file-spreadsheet-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M12 0H4a2 2 0 0 0-2 2v4h12V2a2 2 0 0 0-2-2zm2 7h-4v2h4V7zm0 3h-4v2h4v-2zm0 3h-4v3h2a2 2 0 0 0 2-2v-1zm-5 3v-3H6v3h3zm-4 0v-3H2v1a2 2 0 0 0 2 2h1zm-3-4h3v-2H2v2zm0-3h3V7H2v2zm4 0V7h3v2H6zm0 1h3v2H6v-2z" />
                                </svg>
                            </span>
                        </div>
                        <input
                            defaultValue={props.tableName}
                            id="input-tablename"
                            onChange={handleChange}
                            type="text"
                            className="form-control shadow-none" />
                    </div>
                    <button id="add-table-btn" type="submit" className="btn btn-primary">
                        Add table
                    </button>
                </form>
                {props.columns.length !== 0 ? (
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
                            {props.columns.map(
                                (column, index) => (
                                    <tr key={column.name}>
                                        <th scope="row"> {index + 1}</th>
                                        <td>{column.name}</td>
                                        <td>
                                            <div className="custom-control custom-switch">
                                                <input
                                                    type="checkbox"
                                                    name={column.name}
                                                    data-type="select"
                                                    id={column.name + "-select"}
                                                    checked={column.select}
                                                    disabled={column.disabled || column.distinct}
                                                    onChange={handleChange}
                                                    className="custom-control-input"
                                                />
                                                <label className="custom-control-label" htmlFor={column.name + "-select"}></label>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="custom-control custom-switch">
                                                <input
                                                    disabled={column.disabled}
                                                    type="checkbox"
                                                    name={column.name}
                                                    data-type="distinct"
                                                    id={column.name + "-distinct"}
                                                    checked={column.distinct}
                                                    onChange={handleChange}
                                                    className="custom-control-input" />
                                                <label className="custom-control-label" htmlFor={column.name + "-distinct"}></label>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            )}
                        </tbody>
                    </table>
                ) : null}
            </div>
        </React.Fragment>
    );
}

export default Table;