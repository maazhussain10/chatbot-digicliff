const intentRoute = require('express').Router();
const { UniqueConstraintError } = require('sequelize');
const db = require('../../../../models');


intentRoute.get('/', async (req, res) => {
    let { chatbotId } = req.query;
    try {

        let intents = await db.Intent.findAll({
            raw: true,
            attributes: [['id', 'intentId'], 'intentName', 'description', 'multipleReply', 'previousIntent', 'createdAt'],
            where: {
                chatbotId
            },
            order: [['id'], ['createdAt']]
        })
        console.log(intents);
        res.status(200).json(intents);
    } catch (err) {
        res.status(500).send(err);
    }
});

intentRoute.post('/', async (req, res) => {
    let { chatbotId, intentName, description, previousIntent } = req.body;
    try {
        let intent = await db.Intent.create({
            id: previousIntent ? previousIntent + Math.floor(1000 + Math.random() * 9000) : undefined,
            chatbotId, intentName, description, previousIntent
        })
        res.status(201).json({
            intentId: intent.id,
            intentName: intent.intentName,
            description: intent.description,
            multipleReply: intent.multipleReply,
            previousIntent: intent.previousIntent,
            createdAt: intent.createdAt
        });
    } catch (err) {
        console.log(err);

        if (err instanceof UniqueConstraintError) {
            let { type: errorType } = err.errors[0];
            let errorField = Object.keys(err.fields)[0];
            if (errorType === 'unique violation' && errorField === "intents.chatbotIntentIndex")
                return res.status(409).json({ errorField: "intents.intentName" })
        }
        res.status(500).send(err);
    }
});

intentRoute.put('/', async (req, res) => {
    let { intentName, description, intentId, previousIntent } = req.body;
    try {
        await db.Intent.update({ intentName, description, previousIntent }, {
            where: {
                id: intentId,
            }
        })
        res.sendStatus(204);
    }
    catch (err) {
        if (err instanceof UniqueConstraintError) {
            let { type: errorType } = err.errors[0];
            let errorField = Object.keys(err.fields)[0];
            if (errorType === 'unique violation' && errorField === "intents.chatbotIntentIndex")
                return res.status(409).json({ errorField: "intents.intentName" })
        }
        res.status(500).send(err);
    }
});

intentRoute.delete('/', async (req, res) => {
    let { intentId } = req.body;
    await db.Intent.destroy({
        where: {
            id: intentId
        }
    })

    res.sendStatus(204);
});


module.exports = intentRoute;