const express = require("express");
const sqlFunctions = require('../files/sqlFunctions');


class Settings {

    constructor(app) {
        this.settings(app);
    }

    settings(app) {

        app.get('/settings', async (req, res) => {

            const {
                username,
                assistantName,
            } = req.query;

            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, Accept');

            let chatBoxSettings = await sqlFunctions.getChatboxSettings(username, assistantName);
            res.send(chatBoxSettings);

        });

        app.post('/settings', async (req, res) => {
            const {
                username,
                assistantName,
                settings,
            } = req.query;

            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, Accept');
            console.log("Settings Post",settings);
            let chatBoxSettings = await sqlFunctions.setChatboxSettings(username,assistantName, settings);
            res.send(chatBoxSettings);
        })
    }
}


module.exports = Settings;