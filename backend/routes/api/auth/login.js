const loginRoute = require('express').Router();
const bcrypt = require('bcrypt');
const db = require('../../../models');
const createTokens = require('../../../helpers/tokens');


loginRoute.post('/', async (req, res) => {
    let { username, password } = req.body;
    try {
        let user = await db.User.findOne({
            where: {
                username
            }
        })
        if (!user)
            return res.sendStatus(404);

        if (await bcrypt.compare(password, user.password)) {

            let refreshTokenDuration = 604800;

            // generate accessToken and refreshToken
            console.log(user.id);
            const accessToken = createTokens.generateAccessToken(user.id);
            const refreshToken = createTokens.generateRefreshToken(user.id, refreshTokenDuration);

            let expiresAt = (new Date().setMilliseconds(0) / 1000) + refreshTokenDuration;

            // Create Refresh Token in Database
            await db.Token.create({ userId: user.id, refreshToken, valid: true, expiresAt });

            // Set Refresh Token in cookie and send AccessToken in response
            res.cookie('refreshToken', refreshToken, { httpOnly: true })
            res.status(200).json({ accessToken });
        }
        else
            res.sendStatus(401);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});


module.exports = loginRoute;