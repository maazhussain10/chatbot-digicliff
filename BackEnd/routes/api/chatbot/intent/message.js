const messageRoute = require('express').Router();
const { UniqueConstraintError } = require('sequelize');
const db = require('../../../../models');


messageRoute.get('/', async (req, res) => {
    let { intentId } = req.query;
    try {

        let messages = await db.Message.findAll({
            attributes: ['intentId', ['messageType', 'type'], ['message', 'text'], 'updatedAt'],
            where: {
                intentId
            },
            order: ['createdAt']
        })
        res.status(200).json(messages);
    } catch (err) {
        res.status(500).send(err);
    }
});

messageRoute.post('/', async (req, res) => {
    let { intentId, messageType, message } = req.body;
    try {
        let newMessage = await db.Message.create({
            intentId, messageType, message
        })
        res.status(201).json(newMessage);
    } catch (err) {
        console.log(err);
        if (err instanceof UniqueConstraintError) {
            let { type: errorType } = err.errors[0];
            let errorField = Object.keys(err.fields)[0];
            if (errorType === 'unique violation' && errorField === "messages.PRIMARY")
                return res.status(409).json({ errorField: "messages.message" })
        }
        res.status(500).send(err);
    }
});

messageRoute.put('/', async (req, res) => {
    let { intentId, messageType, message, previousMessage } = req.body;
    try {
        await db.Message.update({ message }, {
            where: {
                message: previousMessage,
                messageType,
                intentId
            }
        })
        res.sendStatus(204);
    }
    catch (err) {
        if (err instanceof UniqueConstraintError) {
            let { type: errorType } = err.errors[0];
            let errorField = Object.keys(err.fields)[0];
            console.log(errorField);
            if (errorType === 'unique violation' && errorField === "messages.PRIMARY")
                return res.status(409).json({ errorField: "messages.message" })
        }
        res.status(500).send(err);
    }
});

messageRoute.delete('/', async (req, res) => {
    let { intentId, messageType, message } = req.body;
    try {
        await db.Message.destroy({
            where: {
                message,
                messageType,
                intentId
            }
        })

        res.sendStatus(204);
    } catch (err) {
        res.status(500).send(err);
    }
});


module.exports = messageRoute;