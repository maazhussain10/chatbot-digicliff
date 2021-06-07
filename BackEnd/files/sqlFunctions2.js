const DatabaseConnection = require('./DBconnection');
const connection = require('./connection');
const DataBaseConnection = require('../files/DBConnection');
const sqlFunctions = require('../files/sqlFunctions');
const uuid = require('uuid-random');

const {
    response
} = require('express');

exports.saveQuery = async (columnNames, columnName, selectedOption, compareValue, tableName, userId, assistantId, intentId) => {
    let queryId = uuid();

    let columns = "";
    columnNames.map((column, index) => {
        columns += column;
        if (index !== columnNames.length - 1)
            columns += ', ';
    })


    let sql = `select ${columns} from ${tableName} where ${columnName} ${selectedOption} "${compareValue}";`;
    // Add User ID and Assistant ID
    connection.query('insert into queries values(?, ?, ?, ?, ?)', [userId, assistantId, intentId, queryId, sql], (err) => {
        if (err) console.log(err);
    })
}

exports.getQuery = async (intentId) => {
    let sql = "select query_id, query from queries where intent_id=?";
    return new Promise((resolve, reject) => {
        connection.query(sql, [intentId], (err, results) => {
            if (err) console.log(err);
            else {
                console.log(results);
                resolve(results);
            }
        })
    })
}

exports.getDatabaseDetails = (assistantId) => {
    let sql = "select * from database_connection where assistant_id=?;";
    return new Promise(resolve => {
        connection.query(sql, [assistantId], (err, results) => {
            if (err) console.log(err);
            else if (results.length !== 0) {
                resolve(
                    {
                        username: results[0].username,
                        password: results[0].password,
                        databaseName: results[0].database_name
                    }
                )
            } else {
                resolve();
            }
        })
    })
}

exports.createRichResponses = async (id, sqlQuery, type, values, cardNo) => {
    const { userId, assistantId, intentId } = id;

    //Soft code knowledge Store, Please <3 ^_^
    let databaseDetails = await this.getDatabaseDetails(assistantId);
    let { username, password, databaseName } = databaseDetails;
    let DBconnection = await DataBaseConnection.DataBaseConnection(username, password, databaseName);
    return new Promise((resolve) => {
        DBconnection.query(sqlQuery, (err, results) => {
            if (err) console.log("Run Query:", err);
            else if (results.length !== 0) {

                if (type === "chip") {
                    //Get Column Names
                    for (let i = 0; i < results.length; i++) {
                        let start = values.indexOf('{') + 1;
                        let end = values.indexOf('}');
                        let chipValue = values.replace(/{.*}/, results[i][values.slice(start, end)]);

                        //Insert Chip
                        sqlFunctions.insertCreateChip(userId, assistantId, intentId, uuid(), "false", chipValue);
                    }
                }
                else if (type === "card") {
                    let columnNames = Object.keys(values);
                    let columnValues = Object.values(values);

                    for (let i = 0; i < results.length; i++) {
                        let cardValues = [];
                        for (let j = 0; j < columnNames.length; j++) {
                            if (results[i][columnValues[j].slice(1, -1)])
                                cardValues.push(results[i][columnValues[j].slice(1, -1)]);
                            else {
                                cardValues.push(columnValues[j]);
                            }
                        }
                        //Insert Card
                        sqlFunctions.insertCreateCard(userId, assistantId, intentId, uuid(), "false", cardNo, columnNames, cardValues);

                    }
                }
                resolve("true");
            }
            else {
                resolve("false");
                console.log("No Results");
            }
        })
    })
}