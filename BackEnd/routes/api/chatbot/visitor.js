const visitorRoute = require("express").Router();
const db = require("../../../models");

visitorRoute.get("/", async (req, res) => {
    let { userId } = req.body;
    try {
        let chatbots = await db.Chatbot.findAll({
            attributes: [
                ["id", "chatbotId"],
                "chatbotName",
                "description",
                "createdAt",
            ],
            raw: true,
            where: {
                userId: userId,
            },
            order: ["createdAt"],
        });

        for (let i = 0; i < chatbots.length; i++) {
            let chatbotId = chatbots[i].chatbotId;
            let response = await db.VisitorDetails.findAll({
                raw: true,
                where: {
                    chatbotId,
                },
            });
            var output = await response.reduce((result, currentValue) => {
                result[currentValue.ipAddress] =
                    result[currentValue.ipAddress] || [];
                result[currentValue.ipAddress].push(currentValue);
                return result;
            }, {});
            chatbots[i].visitorDetails = output;
            chatbots[i].status = true;
        }
        console.log(chatbots);
        res.status(200).json(chatbots);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

module.exports = visitorRoute;
