const profileRoute = require('express').Router();
const db = require('../../../models');


profileRoute.get('/', async (req, res) => {
    let { userId } = req.body;
    try {
        let user = await db.User.findOne({
            attributes: ['firstName', 'lastName', 'email', 'username', 'createdAt'],
            where: {
                id: userId
            }
        })
        res.status(200).json(user);
    } catch (err) {
        res.status(500).send(err);
    }
});

profileRoute.put('/', async (req, res) => {
    let { firstName, lastName, userId } = req.body;
    try {
        await db.User.update({ firstName, lastName }, {
            where: {
                id: userId
            }
        })
        res.sendStatus(204);
    }
    catch (err) {
        res.status(500).send(err);
    }
});

profileRoute.delete('/', (req, res) => {
    let { userId } = req.body;

    db.User.destroy({
        where: {
            id: userId
        }
    })

    res.sendStatus(202);
});


module.exports = profileRoute;