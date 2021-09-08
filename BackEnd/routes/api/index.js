const apiRouter = require('express').Router();
const authRouter = require('./auth');
const userRouter = require('./user');
const verifyJWT = require('../../middleware/verifyJWT');
const refrshTokenRoute = require('./refresh-token');
const chatWindowRouter = require('./chat-window');
const chatbotRouter = require('./chatbot');


apiRouter.use('/auth', authRouter);
apiRouter.use('/user', verifyJWT, userRouter);
apiRouter.use('/chatbot', verifyJWT, chatbotRouter);
apiRouter.use('/chat-window', chatWindowRouter);
apiRouter.use('/refresh-token', refrshTokenRoute);

module.exports = apiRouter;