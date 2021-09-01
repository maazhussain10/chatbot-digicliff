import React, { useState, useEffect, useReducer, useContext } from 'react';
import { AccessTokenContext } from '../../accessTokenContext.js';
import queryService from '../../services/query.service.js';
import QueryTable from './QueryTable';
import Table from './Table';

const RunQueries = (props) => {
    const { accessToken, setAccessToken } = useContext(AccessTokenContext);
    const [columns, setColumns] = useState([]);
    const [tableName, setTableName] = useState(undefined);

    const [rowState, setRowState] = useReducer(
        (state, newState) => ({ ...state, ...newState }),
        { rows: [], id: 0 }
    )

    useEffect(async () => {
        try {
            let intentId = sessionStorage.getItem('intent');
            const response = await queryService.get(intentId, accessToken, setAccessToken);

            setTableName(response.data.tableName);
            setRowState({ rows: response.data.rows })
            await getColumnNames(undefined, response.data.tableName, response.data.selectedColumns, response.data.distinctColumn);

        } catch (err) {
            console.log(err);
        }
    }, []);

    const getColumnNames = async (e, name, selectedColumns, distinctColumn) => {
        e?.preventDefault();
        try {
            if (tableName)
                name = tableName;
            const response = await queryService.getColumnNames(name, accessToken, setAccessToken);
            let data = response.data.columns.map(column => { return { name: column, select: false, distinct: false, disabled: false } });

            if (distinctColumn) {
                for (let i = 0; i < data.length; i++) {
                    if (data[i].name !== distinctColumn)
                        data[i].disabled = true;
                }
                let index = data.findIndex(column => column.name === distinctColumn);
                data[index].select = true;
                data[index].distinct = true;
            } else if (selectedColumns) {
                for (let i = 0; i < selectedColumns.length; i++) {
                    let index = data.findIndex(column => column.name === selectedColumns[i]);
                    data[index].select = true;
                }
            }
            setColumns(data);
        } catch (err) {
            console.log(err);
        }
    }

    const deleteQuery = () => {

    }

    const saveQuery = async () => {
        let intentId = sessionStorage.getItem('intent');
        let distinctColumn = columns.find(column => column.distinct)?.name;
        let selectedColumns = [];
        if (distinctColumn) {
            selectedColumns.push(distinctColumn);
        } else {
            selectedColumns = columns.filter(column => column.select).map(column => { return column.name });
        }
        try {
            const response = await queryService.createQuery(rowState.rows, selectedColumns, distinctColumn, tableName, intentId, accessToken, setAccessToken);
            console.log(response);
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <React.Fragment>
            <div className="modal fade" id="run-query" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" >
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-body text-center">
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close" >
                                <span aria-hidden="true">&times;</span>
                            </button>
                            <ul className="nav nav-tabs row" id="myTab" role="tablist">
                                <li className="nav-item col-6" role="presentation" >
                                    <a className={'nav-link active'} id="table-tab" data-toggle="tab" href="#table" role="tab" aria-controls="Column" aria-selected="true" >
                                        Table
                                    </a>
                                </li>
                                <li className="nav-item col-6" role="presentation"  >
                                    <a className={"nav-link "} id="query-tab-tab" data-toggle="tab" href="#query-tab" role="tab" aria-controls="Table" aria-selected="false" >
                                        Queries
                                    </a>
                                </li>
                            </ul>
                            <div className="tab-content" id="myTabContent">
                                <div className="tab-pane fade show active" id="table" role="tabpanel" aria-labelledby="coltableumn-tab" >
                                    <Table
                                        columns={columns}
                                        setColumns={setColumns}
                                        tableName={tableName}
                                        setTableName={setTableName}
                                        getColumnNames={getColumnNames} />
                                </div>
                                <div className="tab-pane fade" id="query-tab" role="tabpanel" aria-labelledby="query-tab-tab" >
                                    <QueryTable
                                        rowState={rowState}
                                        setRowState={setRowState}
                                        columns={columns}
                                        tableName={tableName} />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button onClick={() => deleteQuery()} type="button" className="btn btn-outline-danger">
                                    Clear Query
                                </button>
                                <button type="button" className="btn btn-outline-danger" data-dismiss="modal">
                                    Close
                                </button>
                                <button onClick={() => saveQuery()} type="button" className="btn btn-primary">
                                    Save changes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment >
    );
}

export default RunQueries;