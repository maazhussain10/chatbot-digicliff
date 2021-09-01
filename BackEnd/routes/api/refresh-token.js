const refrshTokenRoute = require('express').Router();
const jwt = require("jsonwebtoken");
const { Token } = require("../../models");
const createTokens = require("../../helpers/tokens");
let { tokenConfig } = require('../../configs');

let { REFRESH_TOKEN_SECRET } = tokenConfig;

refrshTokenRoute.get('/', async (req, res) => {
    // Gets Refresh Token from Cookie
    let { refreshToken } = req.cookies;
    // If no refresh token is present, The user is asked to login
    if (!refreshToken) return res.status(401).json({ accessToken: null, vaildRefreshToken: false });

    /* 
        Check if Refresh Token is valid
        If the token is not present in the database or if the validity of the token is set to false in the database ( Validity is set to false when user logs out ),
        the user is asked to login.

        Refresh tokens are removed from database after their expiry.
    */
    let tokenInDatabase = await Token.findOne({ where: { refreshToken } });
    if (!tokenInDatabase)
        return res.status(403).json({ accessToken: null, vaildRefreshToken: false });;
    if (tokenInDatabase && !tokenInDatabase.valid) {
        return res.status(403).json({ accessToken: null, vaildRefreshToken: false });;
    }

    // Verify refresh token
    jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, user) => {
        // If refresh token is invalid, ask the user to login
        if (err) return res.status(403).json({ accessToken: null, vaildRefreshToken: false });

        // Else, Generate a new access token and send it to the client side in response.
        const accessToken = createTokens.generateAccessToken(user.id);
        return res.status(200).json({ accessToken, vaildRefreshToken: true });
    });
});


module.exports = refrshTokenRoute;