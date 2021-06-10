const DatabaseConnection = require('./DBconnection');
const connection = require('./connection');
const DataBaseConnection = require('../files/DBConnection');
const sqlFunctions = require('../files/sqlFunctions');
const uuid = require('uuid-random');

const {
    response
} = require('express');

exports.saveQuery = async (columnNames, columnName, selectedOption, compareValue, tableName, username, assistantName, intentName) => {
    let queryId = uuid();

    let columns = "";
    columnNames.map((column, index) => {
        columns += column;
        if (index !== columnNames.length - 1)
            columns += ', ';
    })


    let sql = `select ${columns} from ${tableName} where ${columnName} ${selectedOption} "${compareValue}";`;
    // Add User ID and Assistant ID
    connection.query('insert into queries values(?, ?, ?, ?, ?)', [username, assistantName, intentName, queryId, sql], (err) => {
        if (err) console.log(err);
    })
}

exports.getQuery = async (username, assistantName,intentName) => {
    let sql = "select query from queries where username=? and assistant=? and intent=?";
    return new Promise((resolve, reject) => {
        connection.query(sql, [username, assistantName,intentName], (err, results) => {
            if (err) console.log(err);
            else {
                resolve(results);
            }
        })
    })
}

exports.getDatabaseDetails = (username, assistantName) => {
    let sql = "select * from databaseConnection where username=? and assistant=?;";
    return new Promise(resolve => {
        connection.query(sql, [username, assistantName], (err, results) => {
            if (err) console.log(err);
            else if (results.length !== 0) {
                resolve(
                    {
                        hostname: results[0].hostname,
                        dbUsername: results[0].dbUsername,
                        password: results[0].dbPassword,
                        databaseName: results[0].databaseName
                    }
                )
            } else {
                resolve();
            }
        })
    })
}

exports.createRichResponses = async (id, sqlQuery, type, values, cardNo) => {
    const { username, assistantName, intentName } = id;
    console.log(assistantName);
    //Soft code knowledge Store, Please <3 ^_^
    let databaseDetails = await this.getDatabaseDetails(username, assistantName);
    let { hostname,dbUsername, password, databaseName } = databaseDetails;
    let DBconnection = await DataBaseConnection.DataBaseConnection(hostname,dbUsername, password, databaseName);
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
                        sqlFunctions.insertCreateChip(username, assistantName, intentName, "false", chipValue);
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
                        sqlFunctions.insertCreateCard(username, assistantName, intentName, uuid(), "false", cardNo, columnNames, cardValues);

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