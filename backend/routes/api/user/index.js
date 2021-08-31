const userRouter = require('express').Router();
const profileRoute = require('./profile');

userRouter.use('/profile', profileRoute);

module.exports = userRouter;