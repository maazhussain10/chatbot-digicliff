import React, { Component } from 'react';

class QueryTable extends Component {
    state = {
        rows: [],
        selectedOption: "Operator",
        columnName: "Column Name",
        compareValue: "",
        logic: "And/Or",
    }

    componentDidMount = () => {
        let { rows } = this.props;
        if (!rows)
            this.setState({ rows: rows });
    }

    handleDelete = (id) => {
        let { rows } = this.state;
        rows.splice(id - 1, 1);
        for (let i = id - 1; i < rows.length; i++) {
            rows[i].id -= 1;
            if (i === rows.length - 1) {
                rows[i].logic = "---";
            }
        }
        if (rows.length !== 0 && id - 1 === rows.length) {
            rows[id - 2].logic = "---";
        }
        this.setState({ rows: rows });
        let { getRows } = this.props;
        getRows(rows);
    }

    selectColumn = (column, id) => {
        let { rows } = this.state;
        rows[id - 1].selectedColumn = column;
        this.setState({ rows: rows });
        let { getRows } = this.props;
        getRows(rows);
    }

    selectOperator = (operator, id) => {
        let { rows } = this.state;
        rows[id - 1].selectedOperator = operator;
        this.setState({ rows: rows });
        let { getRows } = this.props;
        getRows(rows);
    }

    selectLogic = (logic, id) => {
        let { rows } = this.state;
        rows[id - 1].logic = logic;
        this.setState({ rows: rows });
        let { getRows } = this.props;
        getRows(rows);
    }

    setCompareValue = (htmlElement) => {
        // Sets the compare value of the row. 
        let compareValue = htmlElement.value;
        let id = parseInt(htmlElement.id.replace("compareValue", ""));
        let { rows } = this.state;
        rows[id - 1].compareValue = compareValue;
        this.setState({ rows: rows });
        let { getRows } = this.props;
        getRows(rows);
    }

    compareValueChange = (e) => {
        this.setCompareValue(e.target);
    }

    handleAdd = () => {
        // Add a row to the table
        let { rows } = this.state;

        // Set Default values for the row to be added
        let tempRow = {
            id: rows.length + 1,
            selectedColumn: "Column Name",
            selectedOperator: " Operator",
            compareValue: undefined,
            logic: "And/ Or",
        }

        rows.push(tempRow);
        this.setState({ rows: rows });

        // Send rows to the parent component ( runQueries )
        let { getRows } = this.props;
        getRows(rows);
    }

    render() {
        let { columnNames } = this.props;
        let { rows } = this.props;
        let operators = ["=", "!=", ">", ">=", "<", "<="];
        let logicOperators = ["And", "Or"];
        return (
            <div className="container text-center">
                <br />
                <div className="table-responsive-lg">
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Column</th>
                                <th scope="col">Condition</th>
                                <th scope="col">Value</th>
                                <th scope="col">And/Or</th>
                                <th scope="col">
                                    <button onClick={() => this.handleAdd()} className="btn btn-sm btn-outline-success"><svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-plus-circle-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z" />
                                    </svg></button>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map(row => (
                                <tr key={row.id}>
                                    <th scope="row">{row.id}</th>
                                    <td>
                                        {/* id harcoded */}
                                        <div className="dropdown-toggle" href="/intents" id="navbarDropdow" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                            {row.selectedColumn}
                                        </div>
                                        {/* should have id in the aria-labelledby */}
                                        <div className="dropdown-menu" aria-labelledby="navbarDropdow">
                                            {columnNames.map((column, index) => (
                                                <span key={index} onClick={() => this.selectColumn(column, row.id)} className="dropdown-item"> {column} </span>

                                            ))}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="dropdown-toggle" href="/intents" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                            {row.selectedOperator}
                                        </div>
                                        <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                                            {operators.map((operator, index) => (
                                                <span key={index} onClick={() => this.selectOperator(operator, row.id)} className="dropdown-item" > {operator} </span>

                                            ))}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="form-group">
                                            <input
                                                onChange={this.compareValueChange}
                                                defaultValue={row.compareValue}
                                                type="text"
                                                className="form-control"
                                                id={"compareValue" + row.id}
                                                aria-describedby="emailHelp" />
                                        </div>
                                    </td>
                                    <td>
                                        {(() => {
                                            if (row.id === rows.length)
                                                return (
                                                    <span>---</span>
                                                )
                                            else
                                                return (
                                                    <React.Fragment>
                                                        <div className="dropdown-toggle" href="/intents" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                            {row.logic}
                                                        </div>
                                                        <div className="dropdown-menu" aria-labelledby="navbarDropdow">
                                                            {logicOperators.map((logic, index) => (
                                                                <span key={index} onClick={() => this.selectLogic(logic, row.id)} className="dropdown-item"> {logic} </span>
                                                            ))}
                                                        </div>
                                                    </React.Fragment>
                                                )

                                        })()}
                                    </td>
                                    <td>
                                        <button onClick={() => this.handleDelete(row.id)} className="btn btn-sm btn-outline-danger"><svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-dash-circle-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                            <path fillRule="evenodd" d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM4.5 7.5a.5.5 0 0 0 0 1h7a.5.5 0 0 0 0-1h-7z" />
                                        </svg></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

export default QueryTable;