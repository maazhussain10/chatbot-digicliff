const intentRouter = require('express').Router();
const entityRoute = require('./entity');
const intentRoute = require('./intent');
const messageRoute = require('./message');
const multipleReplyRoute = require('./multiple-reply');

intentRouter.use('/', intentRoute);
intentRouter.use('/multiple-reply', multipleReplyRoute);
intentRouter.use('/message', messageRoute);
intentRouter.use('/entity', entityRoute)

module.exports = intentRouter;