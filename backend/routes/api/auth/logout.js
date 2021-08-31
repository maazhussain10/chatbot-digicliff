const logoutRoute = require('express').Router();
const db = require('../../../models');

logoutRoute.put('/', async (req, res) => {
    let { refreshToken } = req.cookies;
    await db.Token.update({ valid: false }, {
        where: {
            refreshToken
        }
    })
    res.sendStatus(204);
});


module.exports = logoutRoute;