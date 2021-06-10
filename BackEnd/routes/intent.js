const express = require('express');
const sqlFunctions = require('../files/sqlFunctions');
const uuid = require('uuid-random');



class Intent {

    constructor(app) {
        this.intent(app);
        this.followIntent(app);
        this.multipleReply(app);
        this.existingIntents(app);
        this.updateIntent(app);
        this.deleteIntent(app);
    }
    existingIntents(app) {
        app.get('/intent', async (req, res) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, Accept');

            const { username, assistantName } = req.query;
            const intentData = await sqlFunctions.getExistingIntents(username,assistantName);
            console.log(intentData.existingIntents);
            res.send(intentData.existingIntents);
        })
    }

    intent(app) {
        app.post('/intent', async (req, res) => {
            let { assistantName, username, intentName, intentDesc } = req.query;

            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, Accept');

            let doesIntentExist = await sqlFunctions.doesIntentExist(username,assistantName, intentName);

            // Create intent if another intent with the given name doesn't exist already
            if (!doesIntentExist) {
                sqlFunctions.createIntent(username, assistantName, "null", intentName, intentDesc);
                res.send({ responseStatus: true, doesIntentExist: doesIntentExist });
            } else {
                res.send({ responseStatus: false, doesIntentExist: doesIntentExist });
            }
        });
    }

    followIntent(app) {
        app.post('/follow-intent', async (req, res) => {
            let { assistantName, username, intentName, intentDesc, previousIntent } = req.query;

            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, Accept');

            let doesIntentExist = await sqlFunctions.doesIntentExist(username, assistantName, intentName);

            // Create intent if another intent with the given name doesn't exist already
            if (!doesIntentExist) {
                sqlFunctions.createIntent(username, assistantName, previousIntent, intentName, intentDesc);
                res.send({ responseStatus: true, doesIntentExist: doesIntentExist });
            } else {
                res.send({ responseStatus: false, doesIntentExist: doesIntentExist });
            }
        });
    }

    multipleReply(app) {
        app.get("/intent/multiple-reply", (req, res) => {
            let { username,assistantName,intentName, multipleReply } = req.query;

            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, Accept');

            sqlFunctions.handleMultipleReply(username, assistantName, intentName, multipleReply);
            res.send();
        })
    }

    updateIntent(app) {
        app.post('/intent/update', async (req, res) => {
            let {username, assistantName, intentName, description, previousIntentName } = req.query;

            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, Accept');



            let doesIntentExist = await sqlFunctions.doesIntentExist(username, assistantName, intentName);

            // Update intent if another intent with the given name doesn't exist already
            if (!doesIntentExist) {
                sqlFunctions.updateIntent(username, assistantName, intentName, description, previousIntentName);
                res.send({ responseStatus: true, doesIntentExist: doesIntentExist });
            } else {
                res.send({ responseStatus: false, doesIntentExist: doesIntentExist });
            }
        });
    }

    deleteIntent(app) {
        app.get('/intent-delete', (req, res) => {
            let { username,assistantName, intentName } = req.query;
            console.log("Delete in backend");
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, Accept');


            sqlFunctions.deleteIntent(username,assistantName, intentName);
            res.send();
        })
    }
}


module.exports = Intent;