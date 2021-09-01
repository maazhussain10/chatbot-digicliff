const multipleReplyRoute = require('express').Router();
const db = require('../../../../models');


multipleReplyRoute.get('/', async (req, res) => {
    let { intentId } = req.query;
    try {
        let intent = await db.Intent.findOne({
            attributes: ['multipleReply'],
            where: {
                id: intentId,
            }
        })
        if (!intent)
            res.sendStatus(404);

        res.status(200).json(intent.multipleReply);;
    }
    catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

multipleReplyRoute.put('/', async (req, res) => {
    let { multipleReply, intentId } = req.body;
    try {
        await db.Intent.update({ multipleReply }, {
            where: {
                id: intentId,
            }
        })
        res.sendStatus(204);
    }
    catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});


module.exports = multipleReplyRoute;