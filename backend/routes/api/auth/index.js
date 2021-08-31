const authRouter = require('express').Router();
const verifyToken = require('../../../middleware/verifyJWT');
const loginRoute = require('./login');
const logoutRoute = require('./logout');
const signupRoute = require('./signup');
const verifyJWTRoute = require('./verify');

authRouter.use('/login', loginRoute);
authRouter.use('/logout', logoutRoute);
authRouter.use('/signup', signupRoute);
authRouter.use('/verify', verifyToken, verifyJWTRoute);

module.exports = authRouter;