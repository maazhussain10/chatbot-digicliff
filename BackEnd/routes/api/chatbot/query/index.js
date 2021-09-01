const columnNamesRoute = require('./column-names');
const queryRowsRoute = require('./query-rows');

const queryRouter = require('express').Router();


queryRouter.use('/column-names', columnNamesRoute);
queryRouter.use('/query-rows', queryRowsRoute);

module.exports = queryRouter;