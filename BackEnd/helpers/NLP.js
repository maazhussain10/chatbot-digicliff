const { NlpManager } = require("node-nlp");
const db = require('../models');
const { QueryTypes } = require('sequelize');
const WordPOS = require('wordpos')
const wordpos = new WordPOS();



module.exports = {
    identifyIntent: async (chatbotId, message, hasFollowUp, previousIntent) => {
        const manager = new NlpManager({ languages: ["en"], forceNER: true, });

        // Get the intents that doesnt have a follow up.
        let intents;
        if (!hasFollowUp) {
            intents = await db.Intent.findAll({
                attributes: [['id', 'intentId']],
                raw: true,
                where: {
                    chatbotId
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
                    previousIntent: {
                        [Op.not]: null
                    }
                }
            });
        }
        // Loop till all the intents are iterated.
        for (let i = 0; i < intents.length; i++) {
            let intentId = intents[i].intentId;
            // Get the user messages for each intent.
            let userMessages = await db.Message.findAll({
                attributes: ['message'],
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
            let queryResults = await db.sequelize.query(query,
                {
                    raw: true,
                    type: QueryTypes.SELECT,
                })

            if (queryResults?.length === 0)
                return;

            let queryFields = Object.keys(queryResults[0]);

            let cards = [];
            if (queryCards) {
                // Run the Query here
                for (let i = 0; i < queryResults.length; i++) {
                    let queryValues = Object.values(queryResults[i]);
                    let card = { ...queryCards };
                    // console.log(queryValues);
                    for (let j = 0; j < queryFields.length; j++) {
                        let regex = new RegExp(`{${queryFields[j]}}`, "gi");
                        card.cardValues = card.cardValues.replace(regex, queryValues[j]);
                    }

                    cards.push(card)

                    for (let j = 0; j < entities.length; j++) {
                        let regex = new RegExp(`\\$${entities[j].entityName}`, "gi");
                        card.cardValues = card.cardValues.replace(regex, entities[j].entityValue)
                    }
                    // let data = { cardFields: "", cardValues: "" }
                }

                let nonQueryCards = await db.Card.findAll({
                    raw: true,
                    where: {
                        intentId,
                        useQuery: false
                    }
                })
                for (let i = 0; i < nonQueryCards.length; i++)
                    cards.push(nonQueryCards[i]);

                cards = cards.map((card) => card.cardValues.split(','));
            }
            let chips = [];
            if (queryChips) {

                console.log(queryChips);
                // Run the Query here
                for (let i = 0; i < queryResults.length; i++) {
                    let queryValues = Object.values(queryResults[i]);
                    let chip = { ...queryChips };

                    for (let j = 0; j < queryFields.length; j++) {
                        let regex = new RegExp(`{${queryFields[j]}}`, "gi");
                        chip.chipValue = chip.chipValue.replace(regex, queryValues[j]);
                    }

                    chips.push(chip)

                    for (let j = 0; j < entities.length; j++) {
                        let regex = new RegExp(`\\$${entities[j].entityName}`, "gi");
                        chip.chipValue = chip.chipValue.replace(regex, entities[j].entityValue)
                    }
                }
                let nonQueryChips = await db.Chip.findAll({
                    raw: true,
                    where: {
                        intentId,
                        useQuery: false
                    },
                    order: ['chipOrder']
                })
                for (let i = 0; i < nonQueryChips.length; i++)
                    chips.push(nonQueryChips[i]);

                chips = chips.map(chip => chip.chipValue);
                console.log(chips);
            }
        } catch (err) {
            console.log(err);
        }
    }
}

// messages[i] = messages[i].replace(regex, entities[j].entityValue)