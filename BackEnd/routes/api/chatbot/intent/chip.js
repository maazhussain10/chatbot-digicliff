const chipRoute = require("express").Router();
const db = require("../../../../models");

chipRoute.post("/", async (req, res) => {
    let { intentId, chipValue, useQuery, order } = req.body;
    try {
        db.Chip.create({
            intentId,
            useQuery,
            chipValue,
            chipOrder: order
        });
        res.sendStatus(201);
    } catch (err) {
        res.status(500).send(err);
    }
});

chipRoute.get("/", async (req, res) => {
    let { intentId } = req.query;
    try {
        let existingChips = await db.Chip.findAll({
            attributes: [
                "intentId",
                "useQuery",
                "chipValue",
                "chipOrder"
            ],
            where: {
                intentId,
            },
            order: ['chipOrder']
        });
        res.status(200).json(existingChips);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

chipRoute.put("/", async (req, res) => {
    let { intentId, chipValue, chips } = req.body;
    try {
        console.log(chips)
        if (chips) {
            for (let i = 0; i < chips.length; i++) {
                console.log(chips[i], i)
                db.Chip.update(
                    { chipOrder: i },
                    {
                        where: {
                            intentId,
                            chipValue: chips[i].chipValue
                        }
                    }
                )
            }
            res.sendStatus(202);
        } else {

            await db.Chip.update(
                { chipValue },
                {
                    where: {
                        intentId,
                    },
                }
            );
            return res.sendStatus(204);
        }
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

chipRoute.delete("/", async (req, res) => {
    let { intentId, chipValue } = req.body;
    try {
        await db.Chip.destroy(
            {
                where: {
                    intentId,
                    chipValue
                },
            }
        );
        res.sendStatus(204);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

module.exports = chipRoute;
