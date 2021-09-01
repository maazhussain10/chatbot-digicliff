const apiRouter = require('express').Router();
const authRouter = require('./auth');
const userRouter = require('./user');
const chatbotRouter = require('./chatbot');
const verifyJWT = require('../../middleware/verifyJWT');
const refrshTokenRoute = require('./refresh-token');


apiRouter.use('/auth', authRouter);
apiRouter.use('/user', verifyJWT, userRouter);
apiRouter.use('/chatbot', verifyJWT, chatbotRouter);
apiRouter.use('/refresh-token', refrshTokenRoute);

module.exports = apiRouter;