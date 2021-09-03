const cardRoute = require("express").Router();
const db = require("../../../../models");

cardRoute.post("/", async (req, res) => {
    let { intentId, cardDetails, useQuery } = req.body;
    let { option, cardValues } = cardDetails;
    let cardFields = Object.keys(cardValues).slice(0, option).join("|||");
    let cardData = Object.values(cardValues).slice(0, option).join("|||");
    try {
        let card = await db.Card.create({
            intentId,
            useQuery,
            cardType: option,
            cardFields: cardFields,
            cardValues: cardData,
            cardOrder: option
        });
        res.status(201).json(card);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

cardRoute.get("/", async (req, res) => {
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

cardRoute.put("/", async (req, res) => {
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

cardRoute.delete("/", async (req, res) => {
    let { intentId, cardValues } = req.body;
    try {
        await db.Card.destroy(
            {
                where: {
                    intentId,
                    cardValues
                },
            }
        );
        res.sendStatus(204);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

module.exports = cardRoute;
