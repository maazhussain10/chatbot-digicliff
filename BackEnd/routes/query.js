const express = require("express");
const sqlFunctions = require('../files/sqlFunctions');
const sqlFunctions2 = require('../files/sqlFunctions2');

class Query {

    constructor(app) {
        this.runQuery(app);
    }

    runQuery(app) {

        app.get('/getColumnNames', (req, res) => {
            let { username, assistantName,tableName } = req.query;
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, Accept');

            let columnNames = async () => {
                const tempValues = await sqlFunctions.getColumnNames(username, assistantName, tableName);
                let values = [];
                for (let i = 0; i < tempValues.length; i++) {
                    values.push(tempValues[i].COLUMN_NAME);
                }
                res.send(values);
            }
            columnNames();
        })

        app.get('/getQueryDetails', async (req, res) => {
            let {username, assistantName, intentName } = req.query;
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, Accept');

            let queryDetails = await sqlFunctions.getQueryDetails(username, assistantName, intentName);
            res.send(queryDetails);
        })

        app.get('/deleteQuery', (req, res) => {
            let { intentName } = req.query;

            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, Accept');

            sqlFunctions.deleteExistingQuery(intentName);
            res.send();
        });

        app.post('/createQuery', (req, res) => {
            let { rows, selectedColumns, distinctColumn, username, assistantName, intentName, tableName } = req.query;

            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, Accept');

            //Add query details into the table
            sqlFunctions.addQueryDetails(rows, selectedColumns, distinctColumn, username, assistantName, intentName, tableName);

            /*--------------------------------------------------- Create the query string----------------------------------------------------*/
            // Create a string for the selected columns
            let selectedColumnsString = "";
            if (distinctColumn) {
                selectedColumnsString += "distinct(" + distinctColumn + ")";
            }
            else {
                for (let i = 0; i < selectedColumns.length; i++) {
                    selectedColumnsString += selectedColumns[i];
                    if (i !== selectedColumns.length - 1) {
                        selectedColumnsString += ', ';
                    }
                }
            }

            // Create a string for the condition
            let conditionString = "";
            if (rows) {
                for (let i = 0; i < rows.length; i++) {
                    let { selectedColumn, selectedOperator, compareValue, logic } = JSON.parse(rows[i]);
                    conditionString += selectedColumn + " " + selectedOperator + " " + `"${compareValue}"`;
                    if (logic === 'And') {
                        conditionString += " and ";
                    }
                    if (logic === 'Or') {
                        conditionString += " or ";
                    }
                }
            }

            // Construct the query using selectedColumns and Conditions
            let query = `select ${selectedColumnsString} from ${tableName}`;
            if (conditionString.length !== 0) {
                query += " where " + conditionString;
            }
            query += ";";

            sqlFunctions.addQuery(username, assistantName, intentName, query);
        });
    }
}


module.exports = Query;