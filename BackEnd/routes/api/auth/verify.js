const verifyJWTRoute = require('express').Router();

verifyJWTRoute.get('/', async (req, res) => {
    res.sendStatus(200);
});

module.exports = verifyJWTRoute;