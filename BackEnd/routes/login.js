const md5 = require('md5');
const express = require("express");
const sqlFunctions = require('../files/sqlFunctions');


class LoggingIn {

    constructor(app, connection) {
        this.loggingIn(app, connection);
    }

    loggingIn(app, connection) {

        app.post('/loggingIn', (req, res) => {

            let usernameEmail = req.query.usernameEmail;
            let password = md5(req.query.password);

            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, Accept');

            async function checkExistence() {
                let userData = await sqlFunctions.userExists(usernameEmail, usernameEmail);
                let responseData = {};
                if (password === userData.password) {
                    responseData = {
                        responseMessage: "Successfull login",
                        responseStatus: true,
                        username: userData.username,
                        userId: userData.userId,
                        firstName: userData.firstName,
                        lastName: userData.lastName,
                        emailId: userData.emailId
                    };
                    console.log(responseData);
                }
                else {
                    responseData = {
                        responseMessage: "Login failure",
                        responseStatus: false,
                    };
                }
                res.send(responseData);
            }
            checkExistence();
        });
    }
}
module.exports = LoggingIn;