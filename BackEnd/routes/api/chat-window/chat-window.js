const chatWindowRoute = require("express").Router();
const db = require("../../../models");
const NLP = require("../../../helpers/NLP");
const { getRichResponses } = require("../../../helpers/NLP");
var geoip = require('geoip-lite');

chatWindowRoute.get("/", async (req, res) => {
    let { chatbotId } = req.query;
    try {
        let results = await db.Settings.findOne({
            attributes: [
                "cardTheme",
                "chipTheme",
                "messageTheme",
                "chatboxTheme",
            ],
            where: {
                chatbotId,
            },
        });
        if (!results) return res.sendStatus(404);

        let [cardBgColor, cardTextColor, cardBorder, cardFont] =
            results.cardTheme.split(",");
        let [chipBgColor, chipTextColor, chipBorder, chipShape, chipFont] =
            results.chipTheme.split(",");
        let [
            userTextBgcolor,
            userFont,
            userTextColor,
            botTextBgcolor,
            botFont,
            botTextColor,
        ] = results.messageTheme.split(",");
        let [chatboxColor, chatboxFont, chatboxFontColor, sendMessageColor] =
            results.chatboxTheme.split(",");
        let settings = {
            cardBgColor,
            cardTextColor,
            cardBorder,
            cardFont,
            chipBgColor,
            chipTextColor,
            chipBorder,
            chipShape,
            chipFont,
            userTextBgcolor,
            userFont,
            userTextColor,
            botTextBgcolor,
            botFont,
            botTextColor,
            chatboxColor,
            chatboxFont,
            chatboxFontColor,
            sendMessageColor,
        };

        let chatbot = await db.Chatbot.findByPk(chatbotId, {
            attributes: [
                ["id", "chatbotId"],
                "chatbotName",
                "description",
                "createdAt",
                'hostName'
            ],
        });

        return res.status(200).json({ theme: settings, chatbot });
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

chatWindowRoute.post("/", async (req, res) => {
    try {
        let { chatbotId, message, hasFollowUp, previousIntent, firstIntent } = req.body;
        console.log("ID:", chatbotId);
        const ipAddress = (req.headers['x-forwarded-for'] || req.socket.remoteAddress)?.slice(7);

        let intentId, entities = [];
        if (!firstIntent) {
            await db.VisitorChat.upsert({
                chatbotId,
                ipAddress,
                messageType: "user",
                message,
            });
            let identifiedIntent = await NLP.identifyIntent(
                chatbotId,
                message,
                hasFollowUp,
                previousIntent
            );

            intentId = identifiedIntent.intent;
            // If theres no matching intent for the given message





            let identifiedEntities = identifiedIntent.entities;

            // Check if there are any entities for the selected intent.
            let definedEntities = await db.Entity.findAll({
                raw: true,
                where: {
                    intentId,
                },
                order: ["order"],
            });
            if (definedEntities.length !== 0) {
                // Call the entityStorage method to check the entities user has selected and add the values to it from the existingEntities.
                await NLP.storeVisitorInfo(
                    chatbotId,
                    identifiedEntities,
                    definedEntities,
                    message,
                    ipAddress
                );
            }



            // Get all values available related to the user.
            entities = await db.VisitorDetails.findAll({
                attributes: ["entityName", "entityValue"],
                raw: true,
                where: {
                    chatbotId,
                    ipAddress,
                },
            });
            console.log("ENTITIES", entities);
        } else {
            let firstIntent = await db.Intent.findOne({
                where: {
                    intentName: "Default Intent",
                    chatbotId
                }
            })
            intentId = firstIntent.id;
        }

        let nextIntent = {};
        // Check if the intent triggered has a follow up.
        let hasFollowUpResponse = await db.Intent.findAll({
            where: { previousIntent: intentId },
        });

        nextIntent.hasFollowUp = hasFollowUpResponse.length !== 0;
        nextIntent.previousIntent = (nextIntent.hasFollowUp) ? intentId : undefined;

        if (intentId === "None") {
            console.log("No Intent");
            let data = {
                messages: ["Sorry, I couldn't understand ^_^", "Please contact the hospital desk for further queries"],
                richResponses: [],
                nextIntent,
            };
            return res.status(200).json(data);
        }

        //   Get All the Bot Messages for the particular intent triggered.
        let botMessages = await db.Message.findAll({
            attributes: ["message"],
            raw: true,
            where: {
                intentId,
                messageType: "bot",
            },
            order: ["createdAt"],
        });
        console.log(chatbotId, botMessages);

        // Check if the multiple replies option is enabled for the intent.
        let { multipleReply: hasMultipleReply } = await db.Intent.findOne({
            raw: true,
            where: {
                id: intentId,
            },
        });
        let messages = [];
        //   If Multiple replies is true then add all the responses. Else pick a random message from the set of messages.
        if (hasMultipleReply) {
            for (let i = 0; i < botMessages.length; i++) {
                messages.push(botMessages[i].message);
            }
        } else if (!hasMultipleReply && botMessages.length != 0) {
            let index = Math.floor(Math.random() * botMessages.length);
            messages.push(botMessages[index].message);
        }

        let result = await db.Query.findByPk(intentId);
        let query = "";

        if (result !== null) query = result.query;
        // Add entity value to message from visitor deta

        for (let i = 0; i < messages.length; i++) {
            for (let j = 0; j < entities.length; j++) {
                console.log(`\\$${entities[j].entityName}`)
                let regex = new RegExp(`\\$${entities[j].entityName}`, "gi");
                messages[i] = messages[i].replace(
                    regex,
                    entities[j].entityValue
                );
                console.log(messages[i]);
                if (query && i == 0)
                    query = query.replace(regex, entities[j].entityValue);
            }
        }
        console.log(query);
        let queryCards = [],
            queryChips = [];
        if (query) {
            queryCards = await db.Card.findAll({
                raw: true,
                where: {
                    intentId,
                    useQuery: true,
                },
            });
            queryChips = await db.Chip.findAll({
                raw: true,
                where: {
                    intentId,
                    useQuery: true,
                },
            });
        }

        let richResponses = await getRichResponses(
            intentId,
            queryCards[0],
            queryChips[0],
            query,
            entities
        );
        for (let i = 0; i < messages.length; i++) {
            await db.VisitorChat.upsert({ chatbotId, ipAddress, messageType: 'bot', message: messages[i] });
        }
        res.status(200).json({
            messages,
            richResponses,
            nextIntent,
        });
    } catch (err) {
        console.log(err);
    }
});

module.exports = chatWindowRoute;
