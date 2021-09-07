const visitorRoute = require("express").Router();
const db = require("../../../models");
var geoip = require('geoip-lite');

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
            let response = await db.VisitorChat.findAll({
                attributes:["ipAddress"],
                raw: true,
                where: {
                    chatbotId,
                },
                group:["ipAddress"]
            });
            chatbotDuration = 0;
            for (let i = 0; i < response.length; i++){
                response[i].city = geoip.lookup(response[i].ipAddress).city;
                let durationResponse = await db.VisitorChat.findAll({
                    raw: true,
                    where: {
                        chatbotId,
                        ipAddress:response[i].ipAddress
                    },
                    order:["createdAt"]

                });
                let seconds = Math.abs(durationResponse[0].createdAt - durationResponse[durationResponse.length - 1].createdAt) / 1000;
                chatbotDuration += seconds;
                // Hours, minutes and seconds
                var hrs = ~~(seconds / 3600);
                var mins = ~~((seconds % 3600) / 60);
                var secs = ~~seconds % 60;
                var duration = "";

                if (hrs > 0) {
                    duration += "" + hrs + ":" + (mins < 10 ? "0" : "");
                }
                if(mins>0)
                    duration += "" + mins + ":" + (secs < 10 ? "0" : "");
                duration += "" + secs;
                response[i].duration = duration;
            }
            chatbots[i].botDuration = chatbotDuration;
            chatbots[i].status = true;
            chatbots[i].visitors = response;
        }
        res.status(200).json(chatbots);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

module.exports = visitorRoute;
