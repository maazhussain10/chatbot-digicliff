const {
  getExistingAssistants,
  doesAssistantExist,
  updateAssistant,
  deleteAssistant,
  createAssistant,
} = require("../files/SQL-assistant");

const { createDefaultSettings } = require("../files/SQL-settings");

class Assistant {
  constructor(app) {
    this.createAssistant(app);
    this.existingAssistants(app);
    this.deleteAssistant(app);
    this.updateAssistant(app);
  }

  existingAssistants(app) {
    app.get("/assistant", async (req, res) => {
      const { username } = req.query;
      const assistantData = await getExistingAssistants(username);
      res.send(assistantData.existingAssistants);
    });
  }

  updateAssistant(app) {
    app.get("/assistant/update", async (req, res) => {
      let { username, assistantName, assistantDesc, previousAssistantName } = req.query;

      let assistantExistenceStatus = await doesAssistantExist(username, assistantName);

      // assistantExistenceStatus is true if assistant with the given name already exists, else false.

      // Update assistant if another assistant with the given name doesn't exist already

      if (!assistantExistenceStatus) {
        updateAssistant(username, assistantName, assistantDesc, previousAssistantName);
        res.send({ responseStatus: true, doesAssistantExist: assistantExistenceStatus });
      } else {
        res.send({ responseStatus: false, doesAssistantExist: assistantExistenceStatus });
      }
    });
  }

  deleteAssistant(app) {
    app.get("/assistant/delete", (req, res) => {
      let { username, assistantName } = req.query;
      deleteAssistant(username, assistantName);
      res.send();
    });
  }

  createAssistant(app) {
    app.post("/assistant", async (req, res) => {
      let { username, assistantName, assistantDesc } = req.query;

      // assistantExistenceStatus is true if assistant with the given name already exists, else false.
      let assistantExistenceStatus = await doesAssistantExist(username, assistantName);

      // Create assistant if another assistant with the given name doesn't exist already
      if (!assistantExistenceStatus) {
        createAssistant(username, assistantName, assistantDesc);
        // Create Default settings for Assistant
        createDefaultSettings(username, assistantName);
        res.send({ responseStatus: true, doesAssistantExist: assistantExistenceStatus });
      } else {
        res.send({ responseStatus: false, doesAssistantExist: assistantExistenceStatus });
      }
    });
  }
}

module.exports = Assistant;
