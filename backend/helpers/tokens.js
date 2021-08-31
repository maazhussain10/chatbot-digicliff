const jwt = require('jsonwebtoken');
let { tokenConfig } = require('../configs');

let { REFRESH_TOKEN_SECRET, ACCESS_TOKEN_SECRET } = tokenConfig;
module.exports = {
    generateAccessToken: (userId, duration) => {
        if (!duration)
            duration = "5m";
        return jwt.sign({ id: userId }, ACCESS_TOKEN_SECRET, {
            expiresIn: duration
        });
    },

    generateRefreshToken: (userId, duration) => {
        if (!duration)
            duration = "7d";
        return jwt.sign({ id: userId }, REFRESH_TOKEN_SECRET, {
            expiresIn: duration
        });
    },
}