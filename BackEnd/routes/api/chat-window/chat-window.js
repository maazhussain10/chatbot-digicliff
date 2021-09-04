const chatWindowRoute = require('express').Router();
const { UniqueConstraintError } = require('sequelize');
const db = require('../../../models')
const NLP = require('../../../helpers/NLP');
const { getRichResponses } = require('../../../helpers/NLP');


chatWindowRoute.get('/', async (req, res) => {
    let { chatbotId } = req.query;
    try {
        let results = await db.Settings.findOne({
            attributes: ['cardTheme', 'chipTheme', 'messageTheme', 'chatboxTheme'],
            where: {
                chatbotId,
            }
        })
        if (!results)
            res.sendStatus(404);

        let [cardBgColor, cardTextColor, cardBorder, cardFont] = results.cardTheme.split(',');
        let [chipBgColor, chipTextColor, chipBorder, chipShape, chipFont] = results.chipTheme.split(',');
        let [userTextBgcolor, userFont, userTextColor, botTextBgcolor, botFont, botTextColor] = results.messageTheme.split(',');
        let [chatboxColor, chatboxFont, chatboxFontColor, sendMessageColor] = results.chatboxTheme.split(',');
        let settings = {
            cardBgColor, cardTextColor, cardBorder, cardFont,
            chipBgColor, chipTextColor, chipBorder, chipShape, chipFont,
            userTextBgcolor, userFont, userTextColor, botTextBgcolor, botFont, botTextColor,
            chatboxColor, chatboxFont, chatboxFontColor, sendMessageColor
        }


        let chatbot = await db.Chatbot.findByPk(chatbotId, {
            attributes: [['id', 'chatbotId'], 'chatbotName', 'description', 'createdAt'],
        })

        res.status(200).json({ theme: settings, chatbot });;
    }
    catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

chatWindowRoute.post('/', async (req, res) => {
    try {
        let { chatbotId, message, hasFollowUp, previousIntent } = req.body;
        let ipAddress = "48.0.10.1";
        let identifiedIntent = await NLP.identifyIntent(chatbotId, message, hasFollowUp, previousIntent);

        let intentId = identifiedIntent.intent;
        // If theres no matching intent for the given message
        if (intentId === "None") {
            console.log("No Intent");
            let data = {
                messages: ["Sorry, I couldn't understand ^_^"],
                cardResponse: [],
                chipResponse: [],
            };
            return res.status(200).json(data);
        }

        let identifiedEntities = identifiedIntent.entities;
        // Check if there are any entities for the selected intent.
        let definedEntities = await db.Entity.findAll({
            raw: true,
            where: {
                intentId,
            },
            order: ['order']
        });
        if (definedEntities.length !== 0) {
            // Call the entityStorage method to check the entities user has selected and add the values to it from the existingEntities.
            await NLP.storeVisitorInfo(chatbotId, identifiedEntities, definedEntities, message, ipAddress);
        }

        let nextIntent = {}
        console.log("1", hasFollowUp, previousIntent)
        // Check if the intent triggered has a follow up.
        let hasFollowUpResponse = await db.Intent.findAll({ where: { previousIntent: intentId } });
        console.log("hasFollowUpResponse", hasFollowUpResponse);
        nextIntent.hasFollowUp = (hasFollowUpResponse.length !== 0);
        nextIntent.previousIntent = intentId;
        //   Get All the Bot Messages for the particular intent triggered.
        let botMessages = await db.Message.findAll({
            attributes: ['message'],
            raw: true,
            where: {
                intentId,
                messageType: 'bot'
            },
            order: ['createdAt']
        });

        // Get all values available related to the user.
        let entities = await db.VisitorDetails.findAll({
            attributes: ['entityName', 'entityValue'],
            raw: true,
            where: {
                chatbotId,
                ipAddress
            }
        });

        //   Check if the multiple replies option is enabled for the intent.
        let { multipleReply: hasMultipleReply } = await db.Intent.findOne({
            raw: true,
            where: {
                id: intentId
            }
        })
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
        let query = ""
        console.log(result);
        if(result!==null) query = result.query;
        // Add entity value to message from visitor deta
        for (let i = 0; i < messages.length; i++) {
            for (let j = 0; j < entities.length; j++) {
                let regex = new RegExp(`\\$${entities[j].entityName}`, "gi");
                messages[i] = messages[i].replace(regex, entities[j].entityValue)

                if (query && i == 0)
                    query = query.replace(regex, entities[j].entityValue)
            }
        }
        console.log(messages);

        console.log("Query:", query);
        let queryCards = [], queryChips = [];
        if (query) {
            queryCards = await db.Card.findAll({
                raw: true,
                where: {
                    intentId,
                    useQuery: true
                }
            })
            queryChips = await db.Chip.findAll({
                raw: true,
                where: {
                    intentId,
                    useQuery: true
                }
            })
        }

        let richResponses = await getRichResponses(intentId, queryCards[0], queryChips[0], query, entities);
        res.status(200).json(
            {
                messages,
                richResponses,
                nextIntent
            }
        )
    } catch (err) {
        console.log(err);
    }
})


module.exports = chatWindowRoute;