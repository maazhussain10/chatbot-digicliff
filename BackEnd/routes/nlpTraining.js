const sqlFunctions = require("../files/sqlFunctions");
const sqlFunctions2 = require("../files/sqlFunctions2");
const connection = require("../files/connection");

const { NlpManager } = require("node-nlp");

class NLP {
  constructor(app) {
    this.nlp(app);
  }

  // trainIntents = async (assistantId, hasFollowUp, previousIntent, sendMessage) => {

  //     if (hasFollowUp === "false") {
  //         console.log("TEMPO", assistantId, hasFollowUp, previousIntent, sendMessage)
  //         const classifier1 = new natural.BayesClassifier()
  //         let intents = await sqlFunctions.getIntentsWithoutFollow(assistantId);
  //         for (let i = 0; i < intents.existingIntents.length; i++) {
  //             let intentName = intents.existingIntents[i].intentName;
  //             let intentId = intents.existingIntents[i].intentId
  //             let userMessages = await sqlFunctions.getMessages(intentId, 'user');
  //             classifier1.addDocument("abcdefghijklmnopqrstuvwxyz", "Sorry");
  //             for (let j = 0; j < userMessages.length; j++) {
  //                 classifier1.addDocument(`${userMessages[j].message}`, `${intentName}`);
  //             }
  //         }
  //         return new Promise(async resolve => {
  //             await classifier1.train();
  //             let intentName = classifier1.classify(sendMessage);
  //             resolve(intentName);
  //         })
  //     }
  //     //FOLLOW UP INTENT CLASSIFICATION
  //     else {
  //         const classifier = new natural.BayesClassifier()
  //         let intents = await sqlFunctions.getFollowIntents(previousIntent);
  //         for (let i = 0; i < intents.existingIntents.length; i++) {
  //             let intentName = intents.existingIntents[i].intentName;
  //             let intentId = intents.existingIntents[i].intentId
  //             let userMessages = await sqlFunctions.getMessages(intentId, 'user');
  //             classifier.addDocument("abcdefghijklmnopqrstuvwxyz", "Sorry");
  //             for (let j = 0; j < userMessages.length; j++) {
  //                 classifier.addDocument(`${userMessages[j].message}`, `${intentName}`);
  //             }
  //         }
  //         return new Promise(resolve => {
  //             classifier.train();
  //             let intentName = classifier.classify(sendMessage);
  //             resolve(intentName);
  //         })
  //     }
  // }

  //=========================================================NODE NLP =============================================================================

  trainIntents = async (assistantId, hasFollowUp, previousIntent, sendMessage) => {
    if (hasFollowUp === "false") {
      const manager = new NlpManager({
        languages: ["en"],
      });
      let intents = await sqlFunctions.getIntentsWithoutFollow(assistantId);
      if (intents.existingIntents.length !== 1) {
        for (let i = 0; i < intents.existingIntents.length; i++) {
          let intentName = intents.existingIntents[i].intentName;
          let intentId = intents.existingIntents[i].intentId;
          let userMessages = await sqlFunctions.getMessages(intentId, "user");
          for (let j = 0; j < userMessages.length; j++) {
            manager.addDocument("en", `${userMessages[j].message}`, `${intentName}`);
          }
          for (let j = 0; j < userMessages.length; j++) {
            manager.addAnswer("en", `${intentName}`, `${userMessages[j].message}`);
          }
        }
        return new Promise(async (resolve) => {
          await manager.train();
          let intentName = await manager.process("en", sendMessage);
          console.log("CAASCASCASCA", intentName);
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
      let intents = await sqlFunctions.getFollowIntents(previousIntent);
      if (intents.existingIntents.length !== 1) {
        for (let i = 0; i < intents.existingIntents.length; i++) {
          let intentName = intents.existingIntents[i].intentName;
          let intentId = intents.existingIntents[i].intentId;
          let userMessages = await sqlFunctions.getMessages(intentId, "user");
          for (let j = 0; j < userMessages.length; j++) {
            manager2.addDocument("en", `${userMessages[j].message}`, `${intentName}`);
          }
          for (let j = 0; j < userMessages.length; j++) {
            manager2.addAnswer("en", `${intentName}`, `${userMessages[j].message}`);
          }
        }
        return new Promise(async (resolve) => {
          await manager2.train();
          let intentName = await manager2.process("en", sendMessage);
          console.log("CAASCASCASCA", intentName);
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
  trainEntity = (sendMessage, intentName, assistantId) => {
    return new Promise(async (resolve) => {
      const manager = new NlpManager({
        languages: ["en"],
        forceNER: true,
      });
      let existingEntities = [];

      await manager.train();
      manager.save();
      const response = await manager.process("en", sendMessage);
      const intentId = await sqlFunctions.getIntentId(intentName, assistantId);
      existingEntities.push(response.entities);
      await sqlFunctions.entityValue(intentId, existingEntities[0], sendMessage);
      resolve();
    });
  };

  nlp(app) {
    app.post("/nlp", async (req, res) => {
      let { userId, assistantId, sendMessage, hasFollowUp, previousIntent } = req.query;
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
      res.header(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization, Content-Length, X-Requested-With, Accept"
      );

      let getResponses = async () => {
        if (intentName == "None") {
          let data = {
            messages: ["Sorry, I couldn't understand ^_^"],
            cardResponse: [],
            chipResponse: [],
          };
          res.send(data);
        } else {
          const intentId = await sqlFunctions.getIntentId(intentName, assistantId);
          let hasFollowUp = await sqlFunctions.ifFollowUpExists(intentId);
          let responses = await sqlFunctions.getMessages(intentId, "bot");
          let entities = await sqlFunctions.getEntities(intentId);
          let message = undefined;
          let previousIntent = intentId;
          let hasMultipleReply = await sqlFunctions.checkMultipleReply(intentId);
          //Select Random Response
          let messages = [];
          console.log(hasMultipleReply);
          if (hasMultipleReply === "true") {
            for (let i = 0; i < responses.length; i++) {
              message = responses[i].message;
              console.log(message);
              for (let j = 0; j < entities.length; j++) {
                if (
                  message.slice(message.indexOf("$") + 1).split(" ")[0] === entities[j].entity_name
                ) {
                  message = message.replace(
                    message.slice(message.indexOf("$")).split(" ")[0],
                    entities[j].entity_value
                  );
                }
              }
              messages.push(message);
            }
          } else if (hasMultipleReply === "false") {
            if (responses.length != 0) {
              let index = Math.floor(Math.random() * responses.length);
              message = responses[index].message;

              for (let i = 0; i < entities.length; i++) {
                if (
                  message.slice(message.indexOf("$") + 1).split(" ")[0] === entities[i].entity_name
                ) {
                  message = message.replace(
                    message.slice(message.indexOf("$")).split(" ")[0],
                    entities[i].entity_value
                  );
                }
              }
              messages.push(message);
            }
          }

          let queryCard = await sqlFunctions.getQueryCards(intentId);
          let queryChip = await sqlFunctions.getQueryChips(intentId);
          if (!(queryCard.length === 0 && queryChip.length === 0)) {
            let sqlQuery = await sqlFunctions2.getQuery(intentId);
            sqlQuery = sqlQuery[0].query;
            let id = {
              userId: userId,
              assistantId: assistantId,
              intentId: intentId,
            };
            let type,
              cardNo,
              values = {};
            /* If the richresponse type is card, queryCard.length will not be zero.
                        If the rich response type is chip, queryChip.length will not be zero. */
            if (queryCard.length !== 0) {
              type = "card";
              // Add columnName and value to card.
              for (let i = 0; i < queryCard[0].length; i++) {
                values[queryCard[0][i].card_name] = queryCard[0][i].card_value;
              }
              cardNo = queryCard[0][0].card_no;
            } else if (queryChip.length !== 0) {
              type = "chip";
              values = queryChip[0].chip_value;
            }
            await sqlFunctions2.createRichResponses(id, sqlQuery, type, values, cardNo);
          }
          let cards = await sqlFunctions.getCards(intentId);
          let chips = await sqlFunctions.getChips(intentId);

          if (cards.length > 0 || chips.length > 0) {
            for (let i = 0; i < entities.length; i++) {
              if (chips.length != 0) {
                chips.map((chip) => {
                  if (
                    chip.chip_value.slice(chip.chip_value.indexOf("$") + 1).split(" ")[0] ==
                    entities[i].entity_name
                  ) {
                    chip.chip_value = chip.chip_value.replace(
                      chip.chip_value.slice(chip.chip_value.indexOf("$")).split(" ")[0],
                      entities[i].entity_value
                    );
                  }
                });
              }
              if (cards.length != 0) {
                cards[0].map((card) => {
                  if (
                    card.card_value.slice(card.card_value.indexOf("$") + 1).split(" ")[0] ==
                    entities[i].entity_name
                  ) {
                    card.card_value = card.card_value.replace(
                      card.card_value.slice(card.card_value.indexOf("$")).split(" ")[0],
                      entities[i].entity_value
                    );
                  }
                });
              }
            }
          }

          console.log("MESSAGES", messages);
          let data = {
            messages: messages,
            cardResponse: cards,
            chipResponse: chips,
            hasFollowUp: hasFollowUp,
            previousIntent: previousIntent,
          };
          if (queryCard.length !== 0 || queryChip.length !== 0) {
            connection.query(
              'delete from richresponses where intent_id=? and use_query="false";',
              [intentId],
              (err) => {
                if (err) console.log("Deletion Error", err);
                else console.log("RichResponses Deleted Successfully");
              }
            );
          }
          res.send(data);
        }
      };
      let intentName = await this.trainIntents(
        assistantId,
        hasFollowUp,
        previousIntent,
        sendMessage
      );

      if (intentName != "None") {
        await this.trainEntity(sendMessage, intentName, assistantId);
      }
      getResponses();
    });
  }
}

module.exports = NLP;
