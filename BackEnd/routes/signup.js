const md5 = require('md5');
const express = require("express");
const Router = express.Router();
const cors = require('cors');
const sqlFunctions = require('../files/sqlFunctions');
const { response } = require('express');

class SigningUp {   

    constructor(app, connection) {

        this.signingUp(app, connection);
    }

    signingUp(app, connection) {

        app.post('/signingUp', (req, res) => {
            const { firstName, lastName, email, username } = req.query;
            const password = md5(req.query.password);

            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, Accept');

            // -------------------------------------------------USERNAME EXISTS?---------------------------------------------------------
            async function checkExistence() {
                let checkUsername = await sqlFunctions.usernameExists(username);
                let checkEmail = await sqlFunctions.emailExists(email);
                let existenceData = {
                    usernameExists: false,
                    emailExists: false,
                    existenceStatus: false
                }
                if (checkUsername) {
                    existenceData.usernameExists = true;
                    existenceData.existenceStatus = true;
                }
                if (checkEmail) {
                    existenceData.emailExists = true;
                    existenceData.existenceStatus = true;
                }
                let responseData = {
                    responseStatus: false,
                    existenceData: existenceData,
                }
                if (!existenceData.existenceStatus) {
                    sqlFunctions.createUser(firstName, lastName, username, email, password);
                    responseData.responseStatus = true;
                }
                res.send(responseData)

            }
            checkExistence();
        });

        app.get('/deactivate-account', (req, res) => {
            let { userId } = req.query;
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, Accept');
            console.log(userId);
                sqlFunctions.deactivateAccount(userId);
                res.send();
            })
    }
}

module.exports = SigningUp;   