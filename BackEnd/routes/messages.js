const {
  getMessages,
  getAllMessages,
  addMessage,
  deleteMessage,
  updateMessage,
} = require("../files/SQL-messages");
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
      console.log(username, assistantName);
      let userMessages = await getMessages(username, assistantName, intentName, "User");
      let botReplies = await getMessages(username, assistantName, intentName, "Bot");
      let messages = await getAllMessages(username, assistantName, intentName);
      res.send({ userMessages, botReplies, messages });
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
      console.log("Delete in backend");

      deleteMessage(username, assistantName, intentName, messageType, message);
      res.send();
    });
  }

  updateMessage(app) {
    app.get("/message/update", (req, res) => {
      let { username, assistantName, intentName, previousMessage, messageType, message } =
        req.query;
      console.log(username, assistantName, intentName, previousMessage, messageType, message);

      if (message === "") {
        deleteMessage(username, assistantName, intentName, messageType, message);
      } else {
        updateMessage(username, assistantName, intentName, messageType, message, previousMessage);
      }

      res.send();
    });
  }

  // deleteResponsePhrase(app) {
  //   app.get("/response-delete", (req, res) => {
  //     let { responseId } = req.query;
  //     console.log("Delete in backend");

  //     sqlFunctions.deleteResponsePhrase(responseId);
  //     res.send();
  //   });
  // }
}
module.exports = Messages;
