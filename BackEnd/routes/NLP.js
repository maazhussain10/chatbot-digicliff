const { createQueryRichResponses } = require("../files/SQL-query");
const {
  ifFollowUpExists,
  getIntentsWithoutFollow,
  getFollowIntents,
  checkMultipleReply,
} = require("../files/SQL-intent");
const { getMessages } = require("../files/SQL-messages");
const { entityValue, getEntities } = require("../files/SQL-entity");
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

  trainIntents = async (username, assistantName, hasFollowUp, previousIntent, sendMessage) => {
    if (hasFollowUp === "false") {
      const manager = new NlpManager({
        languages: ["en"],
      });

      let intents = await getIntentsWithoutFollow(username, assistantName);
      console.log("Intents: ", intents);
      if (intents.existingIntents.length !== 1) {
        for (let i = 0; i < intents.existingIntents.length; i++) {
          let intentName = intents.existingIntents[i].intentName;
          let userMessages = await getMessages(username, assistantName, intentName, "user");
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
      let intents = await getFollowIntents(username, assistantName, previousIntent);
      if (intents.existingIntents.length !== 1) {
        for (let i = 0; i < intents.existingIntents.length; i++) {
          let intentName = intents.existingIntents[i].intentName;
          let userMessages = await getMessages(username, assistantName, intentName, "user");
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
      const response = await manager.process("en", sendMessage);

      console.log("RESPONSEE", response);
      existingEntities.push(response.entities);
      await entityValue(username, assistantName, intentName, existingEntities[0], sendMessage);
      resolve();
    });
  };

  nlp(app) {
    app.post("/nlp", async (req, res) => {
      let { username, assistantName, sendMessage, hasFollowUp, previousIntent } = req.query;
      console.log("Stuff: ", req.query);

      let intentName = await this.trainIntents(
        username,
        assistantName,
        hasFollowUp,
        previousIntent,
        sendMessage
      );
      console.log(intentName);
      if (intentName != "None") {
        await this.trainEntity(username, assistantName, sendMessage, intentName);
      }
      if (intentName == "None") {
        let data = {
          messages: ["Sorry, I couldn't understand ^_^"],
          cardResponse: [],
          chipResponse: [],
        };
        res.send(data);
      } else {
        let hasFollowUp = await ifFollowUpExists(username, assistantName, intentName);
        let responses = await getMessages(username, assistantName, intentName, "bot");
        let entities = await getEntities(username, assistantName, intentName);
        let message = undefined;
        let previousIntent = intentName;
        let hasMultipleReply = await checkMultipleReply(username, assistantName, intentName);

        //Select Random Response
        let messages = [];
        console.log("hasMultipleReply: ", hasMultipleReply);
        if (hasMultipleReply === "true") {
          for (let i = 0; i < responses.length; i++) {
            message = responses[i].message;
            for (let j = 0; j < entities.length; j++) {
              if (
                message.slice(message.indexOf("$") + 1).split(" ")[0] === entities[j].entityName
              ) {
                message = message.replace(
                  message.slice(message.indexOf("$")).split(" ")[0],
                  entities[j].entityValue
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
                message.slice(message.indexOf("$") + 1).split(" ")[0] === entities[i].entityName
              ) {
                message = message.replace(
                  message.slice(message.indexOf("$")).split(" ")[0],
                  entities[i].entityValue
                );
              }
            }
            console.log("Message: ", message);
            messages.push(message);
          }
        }

        // Get Cards and Chips that have been connected with the users Database..

        let queryCard = await getQueryCards(username, assistantName, intentName);
        let queryChip = await getQueryChips(username, assistantName, intentName);
        if (!(queryCard.length === 0 && queryChip.length === 0)) {
          let sqlQuery = await getQuery(username, assistantName, intentName);
          sqlQuery = sqlQuery[0].query;
          let id = {
            username: username,
            assistantName: assistantName,
            intentName: intentName,
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
              values[queryCard[0][i].CardName] = queryCard[0][i].cardValue;
            }
            cardNo = queryCard[0][0].cardNo;
          } else if (queryChip.length !== 0) {
            type = "chip";
            values = queryChip[0].chipValue;
          }
          await createQueryRichResponses(id, sqlQuery, type, values, cardNo);
        }

        // Get Cards and Chips values that doesnt have any Queries..

        let cards = await getCards(username, assistantName, intentName);
        let chips = await getChips(username, assistantName, intentName);
        console.log("SSSS", chips);

        if (cards.length > 0 || chips.length > 0) {
          for (let i = 0; i < entities.length; i++) {
            if (chips.length != 0) {
              chips.map((chip) => {
                if (
                  chip.chipValue.slice(chip.chipValue.indexOf("$") + 1).split(" ")[0] ==
                  entities[i].entityName
                ) {
                  chip.chipValue = chip.chipValue.replace(
                    chip.chipValue.slice(chip.chipValue.indexOf("$")).split(" ")[0],
                    entities[i].entityValue
                  );
                }
              });
            }
            if (cards.length != 0) {
              cards[0].map((card) => {
                if (
                  card.cardValue.slice(card.cardValue.indexOf("$") + 1).split(" ")[0] ==
                  entities[i].entityName
                ) {
                  card.cardValue = card.cardValue.replace(
                    card.cardValue.slice(card.cardValue.indexOf("$")).split(" ")[0],
                    entities[i].entityValue
                  );
                }
              });
            }
          }
        }

        let data = {
          messages: messages,
          cardResponse: cards,
          chipResponse: chips,
          hasFollowUp: hasFollowUp,
          previousIntent: previousIntent,
        };
        if (queryCard.length !== 0 || queryChip.length !== 0) {
          connection.query(
            'delete from richResponsesChip where username=? and assistant=? and intent=? and useQuery="false";',
            [username, assistantName, intentName],
            (err) => {
              if (err) console.log("Deletion Error", err);
              else console.log("RichResponses Deleted Successfully");
            }
          );
        }
        console.log(data);
        res.send(data);
      }
    });
  }
}

module.exports = NLP;
