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

            const { assistantId } = req.query;
            const intentData = await sqlFunctions.getExistingIntents(assistantId);
            console.log(intentData.existingIntents);
            res.send(intentData.existingIntents);
        })
    }

    intent(app) {
        app.post('/intent', async (req, res) => {
            let { assistantId, userId, intentName, intentDesc } = req.query;

            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, Accept');



            let intentId = uuid();
            let doesIntentExist = await sqlFunctions.doesIntentExist(assistantId, intentName, intentId);

            // Create intent if another intent with the given name doesn't exist already
            if (!doesIntentExist) {
                sqlFunctions.createIntent(userId, assistantId, intentId, "null", intentName, intentDesc);
                res.send({ responseStatus: true, doesIntentExist: doesIntentExist });
            } else {
                res.send({ responseStatus: false, doesIntentExist: doesIntentExist });
            }
        });
    }

    followIntent(app) {
        app.post('/follow-intent', async (req, res) => {
            let { assistantId, userId, intentName, intentDesc, previousIntent } = req.query;

            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, Accept');

            let intentId = uuid();
            let doesIntentExist = await sqlFunctions.doesIntentExist(assistantId, intentName, intentId);

            // Create intent if another intent with the given name doesn't exist already
            if (!doesIntentExist) {
                sqlFunctions.createIntent(userId, assistantId, intentId, previousIntent, intentName, intentDesc);
                res.send({ responseStatus: true, doesIntentExist: doesIntentExist });
            } else {
                res.send({ responseStatus: false, doesIntentExist: doesIntentExist });
            }
        });
    }

    multipleReply(app) {
        app.get("/intent/multiple-reply", (req, res) => {
            let { intentId, multipleReply } = req.query;

            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, Accept');

            sqlFunctions.handleMultipleReply(intentId, multipleReply);
            res.send();
        })
    }

    updateIntent(app) {
        app.post('/intent/update', async (req, res) => {
            let { assistantId, intentName, description, intentId } = req.query;

            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, Accept');



            let doesIntentExist = await sqlFunctions.doesIntentExist(assistantId, intentName, intentId);

            // Update intent if another intent with the given name doesn't exist already
            if (!doesIntentExist) {
                console.log("Update: ", intentName, description, intentId)
                sqlFunctions.updateIntent(intentName, description, intentId);
                res.send({ responseStatus: true, doesIntentExist: doesIntentExist });
            } else {
                res.send({ responseStatus: false, doesIntentExist: doesIntentExist });
            }
        });
    }

    deleteIntent(app) {
        app.get('/intent-delete', (req, res) => {
            let { intentId } = req.query;
            console.log("Delete in backend");
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, Accept');


            sqlFunctions.deleteIntent(intentId);
            res.send();
        })
    }
}


module.exports = Intent;