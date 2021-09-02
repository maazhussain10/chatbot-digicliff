const chatWindowRouter = require('express').Router();
const chatWindowRoute = require('./chat-window');


chatWindowRouter.use('/', chatWindowRoute);


module.exports = chatWindowRouter;