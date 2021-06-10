const express = require("express");
const sqlFunctions = require('../files/sqlFunctions');


class Assistant {

    constructor(app) {
        this.createAssistant(app);
        this.existingAssistants(app);
        this.deleteAssistant(app);
        this.updateAssistant(app);
    }

    existingAssistants(app) {
        app.get('/assistant', async (req, res) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, Accept');

            const { username } = req.query;
            const assistantData = await sqlFunctions.getExistingAssistants(username);
            res.send(assistantData.existingAssistants);

        })
    }

    updateAssistant(app) {
        app.get('/assistant/update', async (req, res) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, Accept');
            let {
                username,
                assistantName,
                assistantDesc,
                previousAssistantName
            } = req.query;

            let doesAssistantExist = await sqlFunctions.doesAssistantExist(username, assistantName);

            // doesassistantExist is true if assistant with the given name already exists, else false.

            // Update assistant if another assistant with the given name doesn't exist already

            if (!doesAssistantExist) {
                sqlFunctions.updateAssistant(username,assistantName, assistantDesc, previousAssistantName);
                res.send({ responseStatus: true, doesAssistantExist: doesAssistantExist });
            } else {
                res.send({ responseStatus: false, doesAssistantExist: doesAssistantExist });
            }

        })
    }

    deleteAssistant(app) {
        app.get('/assistant/delete', (req, res) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, Accept');
            let {
                username,
                assistantName
            } = req.query;
            sqlFunctions.deleteAssistant(username,assistantName);
            res.send();
        })
    }

    createAssistant(app) {

        app.post('/assistant', async (req, res) => {
            let { username, assistantName, assistantDesc } = req.query;

            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, Accept');

            // doesassistantExist is true if assistant with the given name already exists, else false.
            let doesAssistantExist = await sqlFunctions.doesAssistantExist(username, assistantName);

            // Create assistant if another assistant with the given name doesn't exist already
            if (!doesAssistantExist) {
                sqlFunctions.createAssistant(username, assistantName, assistantDesc);
                res.send({ responseStatus: true, doesAssistantExist: doesAssistantExist });
            } else {
                res.send({ responseStatus: false, doesAssistantExist: doesAssistantExist });
            }
        });
    }
}


module.exports = Assistant;