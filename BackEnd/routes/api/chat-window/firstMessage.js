const firstMessageRoute = require("express").Router();
const db = require("../../../models");

firstMessageRoute.get("/", async (req, res) => {
    let { chatbotId } = req.query;
    try {
        let firstIntent = await db.Intent.findOne({
            where: {
                intentName: "Default Intent"
            }
        })
        let messages = await db.Message.findAll({
            where: {
                intentId: firstIntent.id
            }
        })
        let chips = await db.Chip.findAll({
            where: {
                intentId: firstIntent.id
            }
        })
        return res.status(200).json({ messages });
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});


module.exports = firstMessageRoute;
