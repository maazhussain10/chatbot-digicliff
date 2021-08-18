const { connection, DataBaseConnection } = require("./connection");
const { getDatabaseDetails } = require("./SQL-database");
const { createChip } = require("./SQL-chip");
const { createCard } = require("./SQL-card");
const { getTime } = require("./utilityFunctions");

//----------------------------------------------------Get Column Names of Users Database-----------------------------------------------------------------------

exports.getColumnNames = async (username, assistantName, tableName) => {
    let sql =
        "select column_name from information_schema.columns where table_name=?;";
    let databaseDetails = await getDatabaseDetails(username, assistantName);
    let { hostname, dbUsername, dbPassword, databaseName } = databaseDetails;
    let DBconnection = await DataBaseConnection(
        hostname,
        dbUsername,
        dbPassword,
        databaseName
    );
    return new Promise((resolve) => {
        DBconnection.query(sql, [tableName], (err, results) => {
            if (err) console.log(err);
            else {
                resolve(results);
            }
        });
    });
};

//------------------------------------------------------------Add Query Details-----------------------------------------------------------------------

exports.addQueryDetails = (
    rows,
    selectedColumns,
    distinctColumn,
    username,
    assistantName,
    intentName,
    tableName
) => {
    this.deleteExistingQuery(username, assistantName, intentName);
    let sql;
    if (rows) {
        for (let i = 0; i < rows.length; i++) {
            let { selectedColumn, selectedOperator, compareValue, logic } =
                JSON.parse(rows[i]);
            sql =
                "insert into queryTable (username, assistant, intent, tableName, columnName, compareCondition, compareValue, logic) values(?, ?, ?, ?, ?, ?, ?, ?)";
            connection.query(
                sql,
                [
                    username,
                    assistantName,
                    intentName,
                    tableName,
                    selectedColumn,
                    selectedOperator,
                    compareValue,
                    logic,
                ],
                (err) => {
                    if (err) console.log(err);
                }
            );
        }
    }
    for (let i = 0; i < selectedColumns.length; i++) {
        sql =
            "insert into queryTable(username, assistant, intent, tableName, selectedColumn) values(?, ?, ?, ?, ?);";
        connection.query(
            sql,
            [
                username,
                assistantName,
                intentName,
                tableName,
                selectedColumns[i],
            ],
            (err) => {
                if (err) console.log(err);
            }
        );
    }
    if (distinctColumn) {
        sql =
            "insert into queryTable(username, assistant, intent, tableName, distinctColumn) values(?, ?, ?, ?, ?);";
        connection.query(
            sql,
            [username, assistantName, intentName, tableName, distinctColumn],
            (err) => {
                if (err) console.log(err);
            }
        );
    }
};

//------------------------------------------------------------Create Query-----------------------------------------------------------------------

exports.addQuery = (username, assistantName, intentName, query) => {
    let sql = "insert into queries values(?, ?, ?, ?);";
    connection.query(
        sql,
        [username, assistantName, intentName, query],
        (err) => {
            if (err) console.log(err);
        }
    );
};

//------------------------------------------------------------Get Table Name-----------------------------------------------------------------------

exports.getTableName = (username, assistantName, intentName) => {
    let sql =
        "select tableName from queryTable where username=? and assistant=? and intent=? group by intent;";
    return new Promise((resolve) => {
        connection.query(
            sql,
            [username, assistantName, intentName],
            (err, results) => {
                if (err) console.log(err);
                else if (results.length != 0) {
                    resolve(results[0].tableName);
                } else {
                    resolve(undefined);
                }
            }
        );
    });
};

//------------------------------------------------------------Get Query Rows-----------------------------------------------------------------------
exports.getQueryRows = (username, assistantName, intentName) => {
    let sql =
        "select * from queryTable where username=? and assistant=? and intent=? and selectedColumn is null;";
    return new Promise((resolve) => {
        connection.query(
            sql,
            [username, assistantName, intentName],
            (err, results) => {
                if (err) console.log(err);
                else {
                    let queryRows = [];
                    for (let i = 0; i < results.length; i++) {
                        if (results[i].columnName != null) {
                            let queryRow = {
                                id: i + 1,
                                selectedColumn: results[i].columnName,
                                selectedOperator: results[i].compareCondition,
                                compareValue: results[i].compareValue,
                                logic: results[i].logic,
                            };
                            queryRows.push(queryRow);
                        }
                    }
                    resolve(queryRows);
                }
            }
        );
    });
};

//------------------------------------------------------------Get Selected Columns-----------------------------------------------------------------------

exports.getSelectedColumns = (username, assistantName, intentName) => {
    let sql =
        "select * from queryTable where username=? and assistant=? and intent =? and selectedColumn is not null;";
    return new Promise((resolve) => {
        connection.query(
            sql,
            [username, assistantName, intentName],
            (err, results) => {
                if (err) console.log(err);
                else {
                    let selectedColumns = [];
                    for (let i = 0; i < results.length; i++) {
                        selectedColumns.push(results[i].selectedColumn);
                    }
                    resolve(selectedColumns);
                }
            }
        );
    });
};

//------------------------------------------------------------Get Distinct Columns-----------------------------------------------------------------------

exports.getDistinctColumn = (username, assistantName, intentName) => {
    let sql =
        'select * from queryTable where username=? and assistant=? and intent =? and distinctColumn != "null";';
    return new Promise((resolve) => {
        connection.query(
            sql,
            [username, assistantName, intentName],
            (err, results) => {
                if (err) console.log(err);
                else if (results.length != 0) {
                    resolve(results[0].distinctColumn);
                } else {
                    resolve(undefined);
                }
            }
        );
    });
};

//------------------------------------------------------------Get Query Details-----------------------------------------------------------------------

exports.getQueryDetails = async (username, assistantName, intentName) => {
    return new Promise(async (resolve) => {
        //Database Exists
        let databaseExist = await getDatabaseDetails(
            username,
            assistantName
        );
        // Table name
        let tableName = await this.getTableName(
            username,
            assistantName,
            intentName
        );
        // Query Rows ( Condition )
        let queryRows = await this.getQueryRows(
            username,
            assistantName,
            intentName
        );
        // Selected Columns
        let selectedColumns = await this.getSelectedColumns(
            username,
            assistantName,
            intentName
        );
        // Distinct Column
        let distinctColumn = await this.getDistinctColumn(
            username,
            assistantName,
            intentName
        );
        resolve({
            databaseExist,
            tableName,
            queryRows,
            selectedColumns,
            distinctColumn,
        });
    });
};

//------------------------------------------------------------Delete Query-----------------------------------------------------------------------

exports.deleteExistingQuery = (username, assistantName, intentName) => {
    let sql =
        "delete from queryTable where username=? and assistant=? and intent=?;";
    connection.query(sql, [username, assistantName, intentName], (err) => {
        if (err) console.log(err);
    });
};

exports.saveQuery = async (
    columnNames,
    columnName,
    selectedOption,
    compareValue,
    tableName,
    username,
    assistantName,
    intentName
) => {
    let queryId = uuid();

    let columns = "";
    columnNames.map((column, index) => {
        columns += column;
        if (index !== columnNames.length - 1) columns += ", ";
    });

    let sql = `select ${columns} from ${tableName} where ${columnName} ${selectedOption} "${compareValue}";`;
    // Add User ID and Assistant ID
    connection.query(
        "insert into queries values(?, ?, ?, ?, ?)",
        [username, assistantName, intentName, queryId, sql],
        (err) => {
            if (err) console.log(err);
        }
    );
};

exports.getQuery = async (username, assistantName, intentName) => {
    let sql =
        "select query from queries where username=? and assistant=? and intent=?";
    return new Promise((resolve, reject) => {
        connection.query(
            sql,
            [username, assistantName, intentName],
            (err, results) => {
                if (err) console.log(err);
                else {
                    resolve(results);
                }
            }
        );
    });
};

exports.createQueryRichResponses = async (
    id,
    sqlQuery,
    type,
    values,
    cardNo
) => {
    const { username, assistantName, intentName } = id;

    //Soft code knowledge Store, Please <3 ^_^
    let databaseDetails = await getDatabaseDetails(username, assistantName);
    let { hostname, dbUsername, dbPassword, databaseName } = databaseDetails;
    let DBconnection = await DataBaseConnection(
        hostname,
        dbUsername,
        dbPassword,
        databaseName
    );
    return new Promise((resolve) => {
        DBconnection.query(sqlQuery, (err, results) => {
            if (err) console.log("Run Query:", err);
            else if (results.length !== 0) {
                if (type === "chip") {
                    //Get Column Names
                    for (let i = 0; i < results.length; i++) {
                        let start = values.indexOf("{") + 1;
                        let end = values.indexOf("}");
                        let chipValue = values.replace(
                            /{.*}/,
                            results[i][values.slice(start, end)]
                        );

                        //Insert Chip
                        createChip(
                            username,
                            assistantName,
                            intentName,
                            "false",
                            chipValue
                        );
                    }
                } else if (type === "card") {
                    let columnNames = Object.keys(values);
                    let columnValues = Object.values(values);

                    for (let i = 0; i < results.length; i++) {
                        let cardValues = [];
                        for (let j = 0; j < columnNames.length; j++) {
                            if (results[i][columnValues[j].slice(1, -1)])
                                cardValues.push(
                                    results[i][columnValues[j].slice(1, -1)]
                                );
                            else {
                                cardValues.push(columnValues[j]);
                            }
                        }
                        //Insert Card
                        createCard(
                            username,
                            assistantName,
                            intentName,
                            "false",
                            cardNo,
                            columnNames,
                            cardValues
                        );
                    }
                }
                resolve("true");
            } else {
                resolve("false");
            }
        });
    });
};
