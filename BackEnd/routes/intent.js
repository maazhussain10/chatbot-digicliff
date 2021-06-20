const {
  getExistingIntents,
  doesIntentExist,
  createIntent,
  handleMultipleReply,
  updateIntent,
  deleteIntent,
} = require("../files/SQL-intent");

class Intent {
  constructor(app) {
    this.intent(app);
    this.followIntent(app);
    this.multipleReply(app);
    this.existingIntents(app);
    this.updateIntent(app);
    this.deleteIntent(app);
  }
  existingIntents(app) {
    app.get("/intent", async (req, res) => {
      const { username, assistantName } = req.query;
      const intentData = await getExistingIntents(username, assistantName);
      res.send(intentData.existingIntents);
    });
  }

  intent(app) {
    app.post("/intent", async (req, res) => {
      let { assistantName, username, intentName, intentDesc } = req.query;

      let intentExistenceStatus = await doesIntentExist(username, assistantName, intentName);

      // Create intent if another intent with the given name doesn't exist already
      if (!intentExistenceStatus) {
        createIntent(username, assistantName, null, intentName, intentDesc);
        res.send({ responseStatus: true, doesIntentExist: intentExistenceStatus });
      } else {
        res.send({ responseStatus: false, doesIntentExist: intentExistenceStatus });
      }
    });
  }

  followIntent(app) {
    app.post("/follow-intent", async (req, res) => {
      let { assistantName, username, intentName, intentDesc, previousIntent } = req.query;

      let intentExistenceStatus = await doesIntentExist(username, assistantName, intentName);

      // Create intent if another intent with the given name doesn't exist already
      if (!intentExistenceStatus) {
        createIntent(username, assistantName, previousIntent, intentName, intentDesc);
        res.send({ responseStatus: true, doesIntentExist: intentExistenceStatus });
      } else {
        res.send({ responseStatus: false, doesIntentExist: intentExistenceStatus });
      }
    });
  }

  multipleReply(app) {
    app.get("/intent/multiple-reply", (req, res) => {
      let { username, assistantName, intentName, multipleReply } = req.query;

      handleMultipleReply(username, assistantName, intentName, multipleReply);
      res.send();
    });
  }

  updateIntent(app) {
    app.post("/intent/update", async (req, res) => {
      let { username, assistantName, intentName, description, previousIntentName } = req.query;

      let intentExistenceStatus = await doesIntentExist(username, assistantName, intentName);

      // Update intent if another intent with the given name doesn't exist already
      if (!intentExistenceStatus) {
        updateIntent(username, assistantName, intentName, description, previousIntentName);
        res.send({ responseStatus: true, doesIntentExist: intentExistenceStatus });
      } else {
        res.send({ responseStatus: false, doesIntentExist: intentExistenceStatus });
      }
    });
  }

  deleteIntent(app) {
    app.get("/intent-delete", (req, res) => {
      let { username, assistantName, intentName } = req.query;
      deleteIntent(username, assistantName, intentName);
      res.send();
    });
  }
}

module.exports = Intent;
