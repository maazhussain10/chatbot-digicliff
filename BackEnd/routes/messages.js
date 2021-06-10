const express = require("express");
const sqlFunctions = require('../files/sqlFunctions');


class Messages {

    constructor(app) {
        this.addMessage(app);
        this.getMessages(app);
        this.deleteMessage(app);
        this.updateMessage(app);
    }

    getMessages(app) {

        app.get('/message', async (req, res) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, Accept');

            const { username, assistantName, intentName } = req.query;
            console.log(username, assistantName);
            let userMessages = await sqlFunctions.getMessages(username, assistantName,intentName, "User");
            let botReplies = await sqlFunctions.getMessages(username, assistantName,intentName, "Bot");
            let messages = await sqlFunctions.getAllMessages(username, assistantName,intentName);
            res.send({ userMessages, botReplies, messages });

        })
    }

    addMessage(app) {
        app.post('/message', (req, res) => {

            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, Accept');

            const {
                username,
                assistantName,
                intentName,
                messageType,
                message
            } = req.query;

            sqlFunctions.addMessage(username, assistantName, intentName, messageType, message);
            res.send();
        })
    }

    deleteMessage(app) {
        app.get('/message/delete', (req, res) => {
            let { username, assistantName,intentName, messageType, message } = req.query;
            console.log("Delete in backend");
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, Accept');


            sqlFunctions.deleteMessage(username, assistantName,intentName, messageType, message);
            res.send();
        })
    }

    updateMessage(app) {
        app.get('/message/update', (req, res) => {
            let {username, assistantName,intentName,previousMessage, messageType, message } = req.query;
            console.log(username, assistantName, intentName, previousMessage, messageType, message);
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, Accept');

            if (message === '') {
                sqlFunctions.deleteMessage(username, assistantName,intentName, messageType, message);
            } else {
                sqlFunctions.updateMessage(username, assistantName,intentName, messageType, message,previousMessage);
            }

            res.send();
        });
    }


    deleteResponsePhrase(app) {
        app.get('/response-delete', (req, res) => {
            let {
                responseId
            } = req.query;
            console.log("Delete in backend");
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, Accept');


            sqlFunctions.deleteResponsePhrase(responseId);
            res.send();
        })
    }
}
module.exports = Messages;