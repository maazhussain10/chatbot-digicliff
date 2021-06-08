const sqlFunctions = require("../files/sqlFunctions");

class Messages {
  constructor(app) {
    this.addMessage(app);
    this.getMessages(app);
    this.deleteMessage(app);
    this.updateMessage(app);
  }

  getMessages(app) {
    app.get("/message", async (req, res) => {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
      res.header(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization, Content-Length, X-Requested-With, Accept"
      );

      const { intentId } = req.query;

      let userMessages = await sqlFunctions.getMessages(intentId, "User");
      let botReplies = await sqlFunctions.getMessages(intentId, "Bot");
      let messages = await sqlFunctions.getAllMessages(intentId);
      res.send({ userMessages, botReplies, messages });
    });
  }

  addMessage(app) {
    app.post("/message", (req, res) => {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
      res.header(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization, Content-Length, X-Requested-With, Accept"
      );

      const { userId, assistantId, intentId, messageType, message } = req.query;

      sqlFunctions.addMessage(userId, assistantId, intentId, messageType, message);
      res.send();
    });
  }

  deleteMessage(app) {
    app.get("/message/delete", (req, res) => {
      let { messageId } = req.query;
      console.log("Delete in backend");
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
      res.header(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization, Content-Length, X-Requested-With, Accept"
      );

      sqlFunctions.deleteMessage(messageId);
      res.send();
    });
  }

  updateMessage(app) {
    app.get("/message/update", (req, res) => {
      let { messageId, message } = req.query;

      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
      res.header(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization, Content-Length, X-Requested-With, Accept"
      );

      if (message === "") {
        sqlFunctions.deleteMessage(messageId);
      } else {
        sqlFunctions.updateMessage(messageId, message);
      }

      res.send();
    });
  }

  deleteResponsePhrase(app) {
    app.get("/response-delete", (req, res) => {
      let { responseId } = req.query;
      console.log("Delete in backend");
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
      res.header(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization, Content-Length, X-Requested-With, Accept"
      );

      sqlFunctions.deleteResponsePhrase(responseId);
      res.send();
    });
  }
}
module.exports = Messages;
