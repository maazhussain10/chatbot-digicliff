const chatbotRouter = require('express').Router();
const intentRouter = require('./intent');
const chatbotRoute = require('./chatbot');
const databaseConnectionRoute = require('./database-connection');
const settingsRoute = require('./settings');
const queryRoute = require('./query');
const visitorRoute = require('./visitor');
const hostNameRoute = require('./hostname');

chatbotRouter.use('/', chatbotRoute);
chatbotRouter.use('/intent', intentRouter);
chatbotRouter.use('/database-connection', databaseConnectionRoute);
chatbotRouter.use('/settings', settingsRoute);
chatbotRouter.use('/query', queryRoute);
chatbotRouter.use('/visitor', visitorRoute);
chatbotRouter.use('/hostname', hostNameRoute);


module.exports = chatbotRouter;