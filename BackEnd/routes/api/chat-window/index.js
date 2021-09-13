const chatWindowRouter = require('express').Router();
const chatWindowRoute = require('./chat-window');
const scriptRoute = require('./script');


chatWindowRouter.use('/', chatWindowRoute);
chatWindowRouter.use('/script', scriptRoute);

module.exports = chatWindowRouter;