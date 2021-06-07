const express = require("express");
const sqlFunctions = require('../files/sqlFunctions');


class Entity {

    constructor(app) {
        this.entity(app);
    }

    entity(app) {

        app.post('/create-entity', (req, res) => {

            const {
                userId,
                assistantId,
                intentId,
                selectedColumns,
                entityName
            } = req.query;
            console.log("Details (Create - Entity ):", userId, assistantId, intentId, selectedColumns, entityName);

            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, Accept');

            sqlFunctions.createEntity(userId, assistantId, intentId, selectedColumns, entityName);
            res.send();

        });
        app.get('/get-entity', async (req, res) => {

            const {
                intentId
            } = req.query;
            console.log(intentId);
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, Accept');

            let entities = await sqlFunctions.getEntities(intentId);
            console.log("Entities:", entities);
            res.send(entities);
        });
    }
}


module.exports = Entity;