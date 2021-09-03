const { NlpManager } = require("node-nlp");
const db = require('../models');
const { QueryTypes, Op } = require('sequelize');
const WordPOS = require('wordpos')
const wordpos = new WordPOS();



module.exports = {
    identifyIntent: async (chatbotId, message, hasFollowUp, previousIntent) => {
        const manager = new NlpManager({ languages: ["en"], forceNER: true, });
        // console.log(hasFollowUp, previousIntent);
        // Get the intents that doesnt have a follow up.
        let intents;
        if (!hasFollowUp) {
            intents = await db.Intent.findAll({
                attributes: [['id', 'intentId']],
                raw: true,
                where: {
                    chatbotId,
                    previousIntent: null
                }
            });
        }
        // Get the intents that have a follow up.
        else {
            intents = await db.Intent.findAll({
                attributes: [['id', 'intentId']],
                raw: true,
                where: {
                    chatbotId,
                    previousIntent,
                }
            });
        }
        // Loop till all the intents are iterated.
        for (let i = 0; i < intents.length; i++) {
            let intentId = intents[i].intentId;
            // Get the user messages for each intent.
            let userMessages = await db.Message.findAll({
                attributes: ['message'],
                raw: true,
                where: {
                    intentId,
                    messageType: 'user'
                }
            });
            // Train the model with every user message present inside that intent.
            for (let j = 0; j < userMessages.length; j++) {
                manager.addDocument(
                    "en",
                    `${userMessages[j].message}`,
                    `${intentId}`
                );
                manager.addAnswer(
                    "en",
                    `${intentId}`,
                    `${userMessages[j].message}`
                );
            }
        }

        await manager.train();
        manager.save()

        // Pass the users message as a parameter and process the model to find which intent it classified.
        let identifiedIntent = await manager.process("en", message);

        return identifiedIntent;
    },
    storeVisitorInfo: async (chatbotId, identifiedEntities, definedEntities, message, ipAddress) => {
        for (let i = 0; i < definedEntities.length; i++) {
            let entityType = definedEntities[i].entityType;
            let entityName = definedEntities[i].entityName;
            let value = message;
            if (definedEntities[i].entityType === "name") {
                let results = await wordpos.getPOS(value);
                value = results.rest.join(' ');
            } else if (definedEntities[i].entityType === "other") {
                value = message;

            } else {
                let hasEntity = identifiedEntities.find((entity) => entity.entity === entityType);
                value = hasEntity.sourceText;
                message = message.replace(value, '');
                identifiedEntities = identifiedEntities.filter(entity => hasEntity.sourceText !== entity.sourceText);
            }
            await db.VisitorDetails.upsert({
                chatbotId, entityType, entityName, entityValue: value, ipAddress
            })
        }
        return;
    },

    getRichResponses: async (intentId, queryCards, queryChips, query, entities) => {
        try {
            let queryResults = [];
            if (query)
                queryResults = await db.sequelize.query(query,
                    {
                        raw: true,
                        type: QueryTypes.SELECT,
                    })

            // Declare non Query Cards
            let cards = await db.Card.findAll({
                raw: true,
                where: {
                    intentId,
                    useQuery: false
                }
            })

            cards = cards.length !== 0 ? cards.map((card) => card.cardValues) : [];
            // Declare Non - Query Chips
            let chips = await db.Chip.findAll({
                raw: true,
                where: {
                    intentId,
                    useQuery: false
                },
                order: ['chipOrder']
            })

            chips = chips.length !== 0 ? chips.map((chip) => chip.chipValue) : [];

            if (queryResults?.length === 0)
                return (cards.length !== 0 ? cards : (chips.length !== 0 ? chips : []));

            let queryFields = Object.keys(queryResults[0]);

            if (queryCards) {
                // Run the Query here
                for (let i = 0; i < queryResults.length; i++) {
                    let queryValues = Object.values(queryResults[i]);
                    let card = { ...queryCards };
                    for (let j = 0; j < queryFields.length; j++) {
                        let regex = new RegExp(`{${queryFields[j]}}`, "gi");
                        card.cardValues = card.cardValues.replace(regex, queryValues[j]);
                    }

                    for (let j = 0; j < entities.length; j++) {
                        let regex = new RegExp(`\\$${entities[j].entityName}`, "gi");
                        card.cardValues = card.cardValues.replace(regex, entities[j].entityValue)
                    }
                    cards.push(card.cardValues)
                }
            }

            // Query Chips
            if (queryChips) {
                // Run the Query here
                for (let i = 0; i < queryResults.length; i++) {
                    let queryValues = Object.values(queryResults[i]);
                    let chip = { ...queryChips };

                    for (let j = 0; j < queryFields.length; j++) {
                        let regex = new RegExp(`{${queryFields[j]}}`, "gi");
                        chip.chipValue = chip.chipValue.replace(regex, queryValues[j]);
                    }

                    for (let j = 0; j < entities.length; j++) {
                        let regex = new RegExp(`\\$${entities[j].entityName}`, "gi");
                        chip.chipValue = chip.chipValue.replace(regex, entities[j].entityValue)
                    }
                    chips.push(chip.chipValue)
                }
            }

            return (cards.length !== 0 ? { cards, type: "cards" } : (chips.length !== 0 ? { chips, type: "chips" } : []));
        } catch (err) {
            console.log(err);
        }
    }
}