const databaseConnectionRoute = require('express').Router();
const db = require('../../../models');


databaseConnectionRoute.post('/', async (req, res) => {
    let { chatbotId, hostName, dbUsername, dbPassword, dbName } = req.body;
    try {
        let databaseConnection = await db.DatabaseConnection.upsert({ chatbotId, hostName, dbUsername, dbPassword, dbName });
        res.status(201).json(databaseConnection);;
    }
    catch (err) {
        res.status(500).send(err);
    }
});

databaseConnectionRoute.delete('/', async (req, res) => {
    let { chatbotId } = req.body;
    try {
        db.DatabaseConnection.destroy({
            where: {
                chatbotId,
            }
        })
        res.sendStatus(202);
    }
    catch (err) {
        res.status(500).send(err);
    }
});


module.exports = databaseConnectionRoute;