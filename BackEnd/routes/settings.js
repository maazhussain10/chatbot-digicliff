const { getChatboxSettings, setChatboxSettings } = require("../files/SQL-settings");

class Settings {
  constructor(app) {
    this.settings(app);
  }

  settings(app) {
    app.get("/settings", async (req, res) => {
      const { username, assistantName } = req.query;

      let chatBoxSettings = await getChatboxSettings(username, assistantName);
      res.send(chatBoxSettings);
    });

    app.post("/settings", async (req, res) => {
      const { username, assistantName, settings } = req.query;

      console.log("Settings Post", settings);
      let chatBoxSettings = await setChatboxSettings(username, assistantName, settings);
      res.send(chatBoxSettings);
    });
  }
}

module.exports = Settings;
