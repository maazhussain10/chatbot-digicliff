const hostNameRoute = require('express').Router();
const db = require('../../../models');


hostNameRoute.get('/', async (req, res) => {
    let { chatbotId } = req.body;

    try {
        let chatbots = await db.Chatbot.findAll({
            attributes: [['id', 'chatbotId'], 'chatbotName', 'description', 'createdAt'],
            where: {
                userId: userId
            },
            order: ['createdAt']
        })
        res.status(200).json(chatbots);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});


hostNameRoute.put('/', async (req, res) => {
    let { hostName, chatbotId } = req.body;
    try {
        await db.Chatbot.update({ hostName }, {
            where: {
                id: chatbotId,
            }
        })
        res.sendStatus(204);
    }
    catch (err) {
        res.status(500).send(err);
    }
});

module.exports = hostNameRoute;