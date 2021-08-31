const {
  getMessages,
  getAllMessages,
  addMessage,
  deleteMessage,
  updateMessage,
} = require("../files/SQL-messages");
const { checkMultipleReply } = require("../files/SQL-intent");
class Messages {
  constructor(app) {
    this.addMessage(app);
    this.getMessages(app);
    this.deleteMessage(app);
    this.updateMessage(app);
  }

  getMessages(app) {
    app.get("/message", async (req, res) => {
      const { username, assistantName, intentName } = req.query;
      let userMessages = await getMessages(username, assistantName, intentName, "User");
      let botReplies = await getMessages(username, assistantName, intentName, "Bot");
      let messages = await getAllMessages(username, assistantName, intentName);
      let multipleReply = await checkMultipleReply(username, assistantName, intentName)
      res.send({ userMessages, botReplies, messages,multipleReply });
    });
  }

  addMessage(app) {
    app.post("/message", (req, res) => {
      const { username, assistantName, intentName, messageType, message } = req.query;

      addMessage(username, assistantName, intentName, messageType, message);
      res.send();
    });
  }

  deleteMessage(app) {
    app.get("/message/delete", (req, res) => {
      let { username, assistantName, intentName, messageType, message } = req.query;

      deleteMessage(username, assistantName, intentName, messageType, message);
      res.send();
    });
  }

  updateMessage(app) {
    app.get("/message/update", (req, res) => {
      let { username, assistantName, intentName, previousMessage, messageType, message } =
        req.query;

      if (message === "") {
        deleteMessage(username, assistantName, intentName, messageType, message);
      } else {
        updateMessage(username, assistantName, intentName, messageType, message, previousMessage);
      }

      res.send();
    });
  }
}
module.exports = Messages;
