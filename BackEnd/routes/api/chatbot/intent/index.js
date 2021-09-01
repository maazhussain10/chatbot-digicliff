const intentRouter = require('express').Router();
const entityRoute = require('./entity');
const intentRoute = require('./intent');
const messageRoute = require('./message');
const multipleReplyRoute = require('./multiple-reply');
const cardRoute = require('./card');
const chipRoute = require('./chip');

intentRouter.use('/', intentRoute);
intentRouter.use('/multiple-reply', multipleReplyRoute);
intentRouter.use('/message', messageRoute);
intentRouter.use('/entity', entityRoute)
intentRouter.use('/card', cardRoute)
intentRouter.use('/chip', chipRoute)

module.exports = intentRouter;