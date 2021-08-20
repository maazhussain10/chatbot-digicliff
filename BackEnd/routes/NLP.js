const { createQueryRichResponses } = require("../files/SQL-query");
const {
    ifFollowUpExists,
    getIntentsWithoutFollow,
    getFollowIntents,
    checkMultipleReply,
} = require("../files/SQL-intent");
const { getMessages } = require("../files/SQL-messages");
const {
    entityValue,
    getEntities,
    getAllEntities,
    getAllDetailsOfVisitor,
} = require("../files/SQL-entity");
const { getQueryCards, getCards } = require("../files/SQL-card");
const { getQueryChips, getChips } = require("../files/SQL-chip");
const { getQuery } = require("../files/SQL-query");
const { connection } = require("../files/connection");

const { NlpManager } = require("node-nlp");

class NLP {
    constructor(app) {
        this.nlp(app);
    }

    //=========================================================NODE NLP =============================================================================

    trainIntents = async (
        username,
        assistantName,
        hasFollowUp,
        previousIntent,
        sendMessage
    ) => {
        if (hasFollowUp === "false") {
            const manager = new NlpManager({
                languages: ["en"],
            });
            // Get the intents that doesnt have a follow up.
            let intents = await getIntentsWithoutFollow(
                username,
                assistantName
            );

            // If more than 1 intent is there without follow do this else send the intent name.
            if (intents.existingIntents.length !== 1) {
                // Loop till all the intents are iterated.
                for (let i = 0; i < intents.existingIntents.length; i++) {
                    let intentName = intents.existingIntents[i].intentName;
                    // Get the user messages for each intent.
                    let userMessages = await getMessages(
                        username,
                        assistantName,
                        intentName,
                        "user"
                    );
                    // Train the model with every user message present inside that intent.

                    for (let j = 0; j < userMessages.length; j++) {
                        manager.addDocument(
                            "en",
                            `${userMessages[j].message}`,
                            `${intentName}`
                        );
                    }
                    for (let j = 0; j < userMessages.length; j++) {
                        manager.addAnswer(
                            "en",
                            `${intentName}`,
                            `${userMessages[j].message}`
                        );
                    }
                }
                return new Promise(async (resolve) => {
                    await manager.train();
                    // Pass the users message as a parameter and process the model to find which intent it classified.
                    let intentName = await manager.process("en", sendMessage);
                    // Resolve the intent Name.
                    resolve(intentName.intent);
                });
            } else {
                return new Promise((resolve) => {
                    resolve(intents.existingIntents[0].intentName);
                });
            }
        }

        //FOLLOW UP INTENT CLASSIFICATION
        else {
            const manager2 = new NlpManager({
                languages: ["en"],
            });
            // Get the intents that has a follow up.
            let intents = await getFollowIntents(
                username,
                assistantName,
                previousIntent
            );
            // If more than 1 intent is there without follow do this else send the intent name.
            if (intents.existingIntents.length !== 1) {
                // Loop till all the intents are iterated.
                for (let i = 0; i < intents.existingIntents.length; i++) {
                    let intentName = intents.existingIntents[i].intentName;
                    // Get the user messages for each intent.
                    let userMessages = await getMessages(
                        username,
                        assistantName,
                        intentName,
                        "user"
                    );
                    // Train the model with every user message present inside that intent.
                    for (let j = 0; j < userMessages.length; j++) {
                        manager2.addDocument(
                            "en",
                            `${userMessages[j].message}`,
                            `${intentName}`
                        );
                    }
                    for (let j = 0; j < userMessages.length; j++) {
                        manager2.addAnswer(
                            "en",
                            `${intentName}`,
                            `${userMessages[j].message}`
                        );
                    }
                }
                return new Promise(async (resolve) => {
                    await manager2.train();
                    // Pass the users message as a parameter and process the model to find which intent it classified.
                    let intentName = await manager2.process("en", sendMessage);
                    // Resolve the intent Name.
                    resolve(intentName.intent);
                });
            } else {
                return new Promise((resolve) => {
                    resolve(intents.existingIntents[0].intentName);
                });
            }
        }
    };

    //===========================================================ENTITY============================================================================
    trainEntity = (username, assistantName, sendMessage, intentName) => {
        return new Promise(async (resolve) => {
            const manager = new NlpManager({
                languages: ["en"],
                forceNER: true,
            });
            let existingEntities = [];

            await manager.train();
            manager.save();
            // Train the model with the message user sends.
            const response = await manager.process("en", sendMessage);
            // Push all the entities the NLP model recognized inside the existingEntities array.
            existingEntities.push(response.entities);
            // Call the entityValue method to check the entities user has selected and add the values to it from the existingEntities.
            await entityValue(
                username,
                assistantName,
                intentName,
                existingEntities[0],
                sendMessage
            );
            resolve();
        });
    };

    nlp(app) {
        app.post("/nlp", async (req, res) => {
            let {
                username,
                assistantName,
                sendMessage,
                hasFollowUp,
                previousIntent,
            } = req.query;
            let intentName = await this.trainIntents(
                username,
                assistantName,
                hasFollowUp,
                previousIntent,
                sendMessage
            );

            // If an Intent is triggered then store the entities from the user's message in the entities table.
            if (intentName != "None") {
                await this.trainEntity(
                    username,
                    assistantName,
                    sendMessage,
                    intentName
                );
            }

            // If there is no intent triggered then send the message Sorry I couldnt understand Message.
            if (intentName == "None") {
                let data = {
                    messages: ["Sorry, I couldn't understand ^_^"],
                    cardResponse: [],
                    chipResponse: [],
                };
                res.send(data);
            }
            // If the intent is triggered execute this.
            else {
                // Check if the intent triggered has a follow up.
                let hasFollowUp = await ifFollowUpExists(
                    username,
                    assistantName,
                    intentName
                );
                //   Get All the Bot Messages for the particular intent triggered.
                let responses = await getMessages(
                    username,
                    assistantName,
                    intentName,
                    "bot"
                );
                //   Get the entities belonging to the particular Intent.
                // let entities = await getEntities(username, assistantName, intentName);
                let ipAddress = "171.0.10.1";
                let entities = await getAllDetailsOfVisitor(username, assistantName,ipAddress);
                let message = undefined;
                let previousIntent = intentName;
                //   Check if the multiple replies option is enabled for the intent.
                let hasMultipleReply = await checkMultipleReply(
                    username,
                    assistantName,
                    intentName
                );
                let messages = [];
                //   If Multiple replies is true then add all the responses.
                if (hasMultipleReply === "true") {
                    for (let i = 0; i < responses.length; i++) {
                        message = responses[i].message;
                        // Count the number of times the symbol $ has occured and replace it in the array of index k < countOfDollar.
                        let countOfDollar = (message.match(/$/g) || []).length;
                        //   Check if the selected Message of the Bot has any $ symbol in it and entities enabled.
                        for (let k = 0; k < entities.length; k++) {
                            for (let j = 0; j < entities.length; j++) {
                                if (
                                    message
                                        .slice(message.indexOf("$") + 1)
                                        .split(" ")[0] ===
                                    entities[j].entityName
                                ) {
                                    //   Replace the message containing $entityName with the entityValue we stored in the table above.
                                    message = message.replace(
                                        message
                                            .slice(message.indexOf("$"))
                                            .split(" ")[0],
                                        entities[j].entityValue
                                    );
                                    break;
                                }
                            }
                        }
                        messages.push(message);
                    }
                }
                // 	If Multiple Replies is false then enable any one random response
                else if (hasMultipleReply === "false") {
                    if (responses.length != 0) {
                        let index = Math.floor(
                            Math.random() * responses.length
                        );
                        message = responses[index].message;
                        // Count the number of times the symbol $ has occured and replace it in the array of index k < countOfDollar.
                        let countOfDollar = (message.match(/$/g) || []).length;

                        //   Check if the selected Message of the Bot has any $ symbol in it and entities enabled.
                        for (let k = 0; k < entities.length; k++) {
                            for (let i = 0; i < entities.length; i++) {
                                if (
                                    message
                                        .slice(message.indexOf("$") + 1)
                                        .split(" ")[0] ===
                                    entities[i].entityName
                                ) {
                                    //   Replace the message containing $entityName with the entityValue we stored in the table above.
                                    message = message.replace(
                                        message
                                            .slice(message.indexOf("$"))
                                            .split(" ")[0],
                                        entities[i].entityValue
                                    );
                                }
                            }
                        }
                        messages.push(message);
                    }
                }

                // Get Cards and Chips that have been connected with the users Database..

                let queryCard = await getQueryCards(
                    username,
                    assistantName,
                    intentName
                );
                let queryChip = await getQueryChips(
                    username,
                    assistantName,
                    intentName
                );
                let cardNo;
                if (!(queryCard.length === 0 && queryChip.length === 0)) {
                    //	Get the sql query the user has created.
                    let sqlQuery = await getQuery(
                        username,
                        assistantName,
                        intentName
                    );
                    sqlQuery = sqlQuery[0].query;
                    let id = {
                        username: username,
                        assistantName: assistantName,
                        intentName: intentName,
                    };
                    let type,
                        values = {};
                    /* If the richresponse type is card, queryCard.length will not be zero.
                        If the rich response type is chip, queryChip.length will not be zero. */
                    if (queryCard.length !== 0) {
                        type = "card";
                        for (let i = 0; i < queryCard.length; i++) {
                            cardNo = queryCard[0].cardNo;
                            for (
                                let j = 0;
                                j < queryCard[i].cardName.length;
                                j++
                            ) {
                                // Add columnName and value to card.
                                values[queryCard[i].cardName[j]] =
                                    queryCard[i].cardValue[j];
                            }
                        }
                    } else if (queryChip.length !== 0) {
                        type = "chip";
                        values = queryChip[0].chipValue;
                    }
                    await createQueryRichResponses(
                        id,
                        sqlQuery,
                        type,
                        values,
                        cardNo
                    );
                }

                // Get Cards and Chips values that doesnt have any Queries..

                let cards = await getCards(username, assistantName, intentName);
                let chips = await getChips(username, assistantName, intentName);
                if (cards.length > 0 || chips.length > 0) {
                    for (let i = 0; i < entities.length; i++) {
                        if (chips.length != 0) {
                            chips.map((chip) => {
                                //   Check if the Chip Message of the Bot has any $ symbol in it and entities enabled.
                                if (
                                    chip.chipValue
                                        .slice(chip.chipValue.indexOf("$") + 1)
                                        .split(" ")[0] == entities[i].entityName
                                ) {
                                    //   Replace the message containing $entityName with the entityValue we stored in the table above.
                                    chip.chipValue = chip.chipValue.replace(
                                        chip.chipValue
                                            .slice(chip.chipValue.indexOf("$"))
                                            .split(" ")[0],
                                        entities[i].entityValue
                                    );
                                }
                            });
                        }
                        if (cards.length != 0) {
                            //   Check if the Card Message of the Bot has any $ symbol in it and entities enabled.
                            cards.map((card) => {
                                let cardValue = JSON.stringify(
                                    card.cardValue
                                ).replace(/"/g, " %");
                                if (
                                    cardValue
                                        .slice(cardValue.indexOf("$") + 1)
                                        .split(" ")[0] == entities[i].entityName
                                ) {
                                    //   Replace the message containing $entityName with the entityValue we stored in the table above.
                                    card.cardValue = JSON.parse(
                                        cardValue
                                            .replace(
                                                cardValue
                                                    .slice(
                                                        cardValue.indexOf("$")
                                                    )
                                                    .split(" ")[0],
                                                entities[i].entityValue
                                            )
                                            .replace(/ %/g, '"')
                                    );
                                }
                            });
                        }
                    }
                }

                //   Final Data is stored in the data object.
                let data = {
                    messages: messages,
                    cardResponse: cards,
                    chipResponse: chips,
                    hasFollowUp: hasFollowUp,
                    previousIntent: previousIntent,
                };

                //   Delete the Queries that are created in the rich responses table  of both card and chips
                if (queryCard.length !== 0) {
                    connection.query(
                        'delete from richResponseCard where username=? and assistant=? and intent=? and useQuery="false";',
                        [username, assistantName, intentName],
                        (err) => {
                            if (err) console.log("Deletion Error", err);
                        }
                    );
                } else if (queryChip.length !== 0) {
                    connection.query(
                        'delete from richResponseChip where username=? and assistant=? and intent=? and useQuery="false";',
                        [username, assistantName, intentName],
                        (err) => {
                            if (err) console.log("Deletion Error", err);
                        }
                    );
                }
                res.send(data);
            }
        });
    }
}

module.exports = NLP;
