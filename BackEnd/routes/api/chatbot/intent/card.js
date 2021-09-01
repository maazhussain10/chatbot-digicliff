const card = require("express").Router();
const db = require("../../../../models");

card.post("/", async (req, res) => {
    let { intentId, cardDetails, useQuery } = req.body;
    let { cardType, cardFields, cardValues } = cardDetails;
    try {
        db.Entity.create({
            intentId,
            useQuery,
            cardType,
            cardFields,
            cardValues,
        });
        res.sendStatus(201);
    } catch (err) {
        res.status(500).send(err);
    }
});

card.get("/", async (req, res) => {
    let { intentId } = req.query;
    try {
        let existingCards = await db.Card.findAll({
            attributes: [
                "intentId",
                "useQuery",
                "cardType",
                "cardFields",
                "cardValues",
                "cardOrder",
            ],
            where: {
                intentId,
            },
        });
        res.status(200).json(existingCards);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

card.put("/", async (req, res) => {
    let { intentId, cardFields, cardValues } = req.body;
    try {
        await db.Card.update(
            { cardFields, cardValues },
            {
                where: {
                    intentId,
                },
            }
        );
        res.sendStatus(204);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

card.delete("/", async (req, res) => {
    let { intentId, cardValue } = req.body;
    try {
        await db.Card.destroy(
            {},
            {
                where: {
                    intentId,
                    cardValue,
                },
            }
        );
        res.sendStatus(204);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

module.exports = card;
