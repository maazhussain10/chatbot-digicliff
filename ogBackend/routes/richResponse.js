const { getChips, createChip, getAllChips, deleteChip, updateChip } = require("../files/SQL-chip");
const { getCards, createCard, deleteCard, updateCard } = require("../files/SQL-card");

class RichResponse {
  constructor(app) {
    this.richResponse(app);
  }

  richResponse(app) {
    app.get("/rich-response", async (req, res) => {
      let { username, assistantName, intentName } = req.query;

      let existingChips = await getChips(username, assistantName, intentName);
      if (existingChips.length != 0) {
        res.send(existingChips);
      }

      let existingCards = await getCards(intentName);
      if (existingCards.length != 0) {
        res.send(existingCards);
      }
    });

    app.post("/chip", (req, res) => {
      const { username, assistantName, intentName, chipResponse, usingQueries } = req.query;
      createChip(username, assistantName, intentName, usingQueries, chipResponse);
      res.send();
    });

    app.get("/getchips", async (req, res) => {
      const { username, assistantName, intentName } = req.query;

      let responses = await getAllChips(username, assistantName, intentName);
      res.send(responses);
    });

    app.get("/chip-delete", (req, res) => {
      const { username, assistantName, intentName, chipValue } = req.query;
      deleteChip(username, assistantName, intentName, chipValue);
      res.send("Deleted");
    });

    app.get("/chip-update", (req, res) => {
      const { username, assistantName, intentName, chipValue, previousChipValue } = req.query;
      updateChip(username, assistantName, intentName, chipValue, previousChipValue);
      res.send("Updated");
    });

    //-------------------------------------------------------CARD---------------------------------------------------------------------------------

    app.post("/card", (req, res) => {
      const {
        username,
        assistantName,
        intentName,
        useQuery,
        cardNo,
        cardName,
        cardValue
      } = req.query;

      if (cardName)
        createCard(
          username,
          assistantName,
          intentName,
          useQuery,
          cardNo,
          cardName,
          cardValue
        );
      res.send();
    });

    app.get("/getcards", async (req, res) => {
      const { username, assistantName, intentName } = req.query;
      let allCards = await getCards(username, assistantName, intentName);
      res.send(allCards);
    });

    app.get("/card-delete", (req, res) => {
      const { username, assistantName, intentName, cardValue } = req.query;
      deleteCard(username, assistantName, intentName, JSON.stringify(cardValue));
      res.send("Deleted");
    });

    app.get("/card-update", (req, res) => {
      const { cardName, cardValue } = req.query;
      updateCard(cardName, cardValue);
      res.send("Deleted");
    });
  }
}

module.exports = RichResponse;
