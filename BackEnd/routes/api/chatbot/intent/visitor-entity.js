const visitorEntityRoute = require('express').Router();
const db = require('../../../../models');


visitorEntityRoute.get('/', async (req, res) => {
    let { ipAddress, selectedChatbotId, type } = req.query;
    try {
        if (type === 'entity') {
            let entitiesList = await db.VisitorDetails.findAll({
                raw: true,
                where: {
                    chatbotId: selectedChatbotId,
                    ipAddress
                },
            })
            res.status(200).json(entitiesList);
        }
        else if (type === 'chat') {
            let chatList = await db.VisitorChat.findAll({
                raw: true,
                where: {
                    chatbotId: selectedChatbotId,
                    ipAddress
                },
                order:["createdAt"]
            })
            res.status(200).json(chatList);
        }
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

module.exports = visitorEntityRoute;