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

    app.post("/chip", async (req, res) => {
      const { username, assistantName, intentName, chipResponse, usingQueries } = req.query;
      await createChip(username, assistantName, intentName, usingQueries, chipResponse);
      let existingChips = await getChips(username, assistantName, intentName);
      res.send(existingChips);
    });

    app.get("/getchips", async (req, res) => {
      const { username, assistantName, intentName } = req.query;

      let responses = await getAllChips(username, assistantName, intentName);
      res.send(responses);
    });

    app.get("/chip-delete", async (req, res) => {
      const { username, assistantName, intentName, chipValue } = req.query;
      await deleteChip(username, assistantName, intentName, chipValue);
      res.send("Deleted");
    });

    app.get("/chip-update", async (req, res) => {
      const { username, assistantName, intentName, chipValue, previousChipValue } = req.query;
      await updateChip(username, assistantName, intentName, chipValue, previousChipValue);
      res.send("Updated");
    });

    //-------------------------------------------------------CARD---------------------------------------------------------------------------------

    app.post("/card", async (req, res) => {
      const {
        username,
        assistantName,
        intentName,
        useQuery,
        cardNo,
        cardName,
        cardValue,
        cardColor,
        textColor,
      } = req.query;

      if (cardName)
        await createCard(
          username,
          assistantName,
          intentName,
          useQuery,
          cardNo,
          cardName,
          cardValue
        );
      let existingCards = await getCards(username, assistantName, intentName);
      res.send(existingCards);
    });

    app.get("/getcards", async (req, res) => {
      const { username, assistantName, intentName } = req.query;
      let allCards = await getCards(username, assistantName, intentName);
      res.send(allCards);
    });

    app.get("/card-delete", async (req, res) => {
      const { username, assistantName, intentName, cardValue } = req.query;
      await deleteCard(username, assistantName, intentName, JSON.stringify(cardValue));
      res.send("Deleted");
    });

    app.get("/card-update", async (req, res) => {
      const { cardName, cardValue } = req.query;
      await updateCard(cardName, cardValue);
      res.send("Deleted");
    });
  }
}

module.exports = RichResponse;
