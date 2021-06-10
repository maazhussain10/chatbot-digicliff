const express = require("express");
const sqlFunctions = require('../files/sqlFunctions');


class KnowledgeStore {

    constructor(app) {
        this.databaseDetails(app);
    }

    databaseDetails(app) {

        app.post('/addDatabaseDetails', (req, res) => {

            let { username, assistantName, dbUsername, password, databaseName } = req.query;
            console.log(username, password, databaseName);
            // connect with their DB server.
            let hostname = "localhost";
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, Accept');

            sqlFunctions.addDatabaseDetails(username, assistantName,hostname, dbUsername, password, databaseName);

        });
    }
}


module.exports = KnowledgeStore;