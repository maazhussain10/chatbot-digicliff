import React, { useState, useEffect } from 'react';

const QueryTable = (props) => {

    let operators = ["=", "!=", ">", ">=", "<", "<="];
    let logicOperators = ["And", "Or"];


    const addRow = () => {
        let row = {
            id: props.rowState.id,
            column: "Column",
            operator: "Operator",
            value: undefined,
            logic: "Logical",
        }
        props.setRowState({ rows: [...props.rowState.rows, row], id: props.rowState.id + 1 });
    }

    const deleteRow = (id) => {
        const rows = props.rowState.rows.filter(row => row.id !== id);
        props.setRowState({ rows });
    }

    const handleChange = (e) => {
        let index = e.target.dataset.id;

        const rows = [...props.rowState.rows];
        rows[index][e.target.name] = e.target.value;

        props.setRowState({ rows });
    }


    return (
        <React.Fragment>
            <div className="container text-center" >
                <br />
                <div className="table-responsive-lg" style={{ width: 'inherit' }}>
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Column</th>
                                <th scope="col">Condition</th>
                                <th scope="col">Value</th>
                                <th scope="col">And/Or</th>
                                <th scope="col">
                                    <button onClick={() => addRow()} className="btn btn-sm btn-outline-success"><svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-plus-circle-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z" />
                                    </svg></button>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {props.rowState.rows.map((row, index) => (
                                <tr key={row.id}>
                                    <th scope="row">{index + 1}</th>
                                    <td>
                                        <div className="input-group mb-3">
                                            <select defaultValue={row.column} onChange={handleChange} data-id={index} name="column"
                                                className="custom-select shadow-none" id="inputGroupSelect01">
                                                <option>{row.column}</option>
                                                {props.columns.map((column, index) => (
                                                    <option key={index} value={column.name}> {column.name} </option>
                                                ))}
                                            </select>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="input-group mb-3">
                                            <select defaultValue={row.operator} onChange={handleChange} data-id={index} name="operator"
                                                className="custom-select shadow-none" id="inputGroupSelect01">
                                                <option>{row.operator}</option>
                                                {operators.map((operator, index) => (
                                                    <option key={index} value={operator}> {operator} </option>
                                                ))}
                                            </select>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="form-group">
                                            <input
                                                data-id={index}
                                                onChange={handleChange}
                                                defaultValue={row.value}
                                                name="value"
                                                type="text"
                                                className="form-control"
                                                id={"value" + row.id}
                                                aria-describedby="emailHelp" />
                                        </div>
                                    </td>
                                    <td>
                                        {index + 1 !== props.rowState.rows.length ?
                                            <div className="input-group mb-3">
                                                <select defaultValue={row.logic} onChange={handleChange} data-id={index} name="logic"
                                                    className="custom-select shadow-none" id="inputGroupSelect01">
                                                    <option>{row.logic}</option>
                                                    {logicOperators.map((logic, index) => (
                                                        <option key={index} value={logic}> {logic} </option>
                                                    ))}
                                                </select>
                                            </div>
                                            : <span> --- </span>}
                                    </td>
                                    <td>
                                        <button onClick={() => deleteRow(row.id)} className="btn btn-sm btn-outline-danger"><svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-dash-circle-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                            <path fillRule="evenodd" d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM4.5 7.5a.5.5 0 0 0 0 1h7a.5.5 0 0 0 0-1h-7z" />
                                        </svg></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </React.Fragment>);
}

export default QueryTable;