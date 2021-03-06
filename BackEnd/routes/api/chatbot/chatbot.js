const chatbotRoute = require('express').Router();
const { UniqueConstraintError } = require('sequelize');
const db = require('../../../models');


chatbotRoute.get('/', async (req, res) => {
    let { userId } = req.body;

    try {
        let chatbots = await db.Chatbot.findAll({
            attributes: [['id', 'chatbotId'], 'chatbotName', 'description', 'createdAt', 'hostName'],
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

chatbotRoute.post('/', async (req, res) => {

    let { userId, chatbotName, description } = req.body;
    try {
        let chatbot = await db.Chatbot.create({
            userId, chatbotName, description
        })

        let chatbotId = chatbot.id;
        await db.Settings.create({ chatbotId });
        await db.Intent.create({
            id: undefined,
            chatbotId, intentName: "Default Intent", description: "Bot initiates conversation with this message", previousIntent: null
        })

        res.status(201).json({
            chatbotId: chatbot.id,
            chatbotName: chatbot.chatbotName,
            description: chatbot.description,
            createdAt: chatbot.createdAt
        });
    } catch (err) {
        console.log(err.message);
        if (err instanceof UniqueConstraintError) {
            let { type: errorType } = err.errors[0];
            let errorField = Object.keys(err.fields)[0];
            if (errorType === 'unique violation' && errorField === "chatbots.userChatbotIndex")
                return res.status(409).json({ errorField: "chatbots.chatbotName" })
        }
        res.status(500).send(err);
    }
});

chatbotRoute.put('/', async (req, res) => {
    let { chatbotName, description, chatbotId } = req.body;
    try {
        await db.Chatbot.update({ chatbotName, description }, {
            where: {
                id: chatbotId,
            }
        })
        res.sendStatus(204);
    }
    catch (err) {
        if (err instanceof UniqueConstraintError) {
            let { type: errorType } = err.errors[0];
            let errorField = Object.keys(err.fields)[0];
            if (errorType === 'unique violation' && errorField === "chatbots.userChatbotIndex")
                return res.status(409).json({ errorField: "chatbots.chatbotName" })
        }
        res.status(500).send(err);
    }
});

chatbotRoute.delete('/', async (req, res) => {
    let { chatbotId } = req.body;
    await db.Chatbot.destroy({
        where: {
            id: chatbotId
        }
    })

    res.sendStatus(204);
});


module.exports = chatbotRoute;