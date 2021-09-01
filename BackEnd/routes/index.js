const router = require('express').Router();
const apiRouter = require('./api');
const path = require('path');

router.use('/api', apiRouter);
// Point to index.html whenever the route does not match with api routes, so that react can handle the client side routing
router.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, '../build/index.html'), function (err) {
        if (err) {
            res.status(500).send(err)
        }
    })
})

module.exports = router;