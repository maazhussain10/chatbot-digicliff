const scriptRoute = require("express").Router();
const path = require('path');


scriptRoute.get("/", async (req, res) => {
    res.sendFile(path.join(__dirname + '../../../../helpers/script.js'));
});

module.exports = scriptRoute;
