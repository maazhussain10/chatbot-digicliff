const express = require("express");
const sqlFunctions = require('../files/sqlFunctions');


class Entity {

    constructor(app) {
        this.entity(app);
    }

    entity(app) {

        app.post('/create-entity', (req, res) => {

            const {
                username,
                assistantName,
                intentName,
                selectedColumns,
                entityName
            } = req.query;
            console.log("Details (Create - Entity ):", username, assistantName, intentName, selectedColumns, entityName);

            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, Accept');

            sqlFunctions.createEntity(username, assistantName, intentName, selectedColumns, entityName);
            res.send();

        });
        app.get('/get-entity', async (req, res) => {

            const {username, assistantName,intentName } = req.query;
            console.log(intentName);
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, Accept');

            let entities = await sqlFunctions.getEntities(username, assistantName,intentName);
            console.log("Entities:", entities);
            res.send(entities);
        });
    }
}


module.exports = Entity;