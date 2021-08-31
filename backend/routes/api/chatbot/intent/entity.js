const entityRoute = require('express').Router();
const { UniqueConstraintError } = require('sequelize');
const db = require('../../../../models');


entityRoute.get('/', async (req, res) => {
    let { intentId } = req.query;
    try {

        let entities = await db.Entity.findAll({
            attributes: [['entityType', 'type'], ['entityName', 'name']],
            where: {
                intentId
            }
        })
        res.status(200).json(entities);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

entityRoute.post('/', async (req, res) => {
    let { chatbotId, intentId, entities } = req.body;
    try {
        // Clear Existing Entity first.
        await db.Entity.destroy({
            where: {
                intentId
            }
        })

        for (let i = 0; i < entities.length; i++) {
            db.Entity.create({
                chatbotId, intentId, entityType: entities[i].type, entityName: entities[i].name
            })
        }
        res.sendStatus(201);
    } catch (err) {
        res.status(500).send(err);
    }
});

module.exports = entityRoute;