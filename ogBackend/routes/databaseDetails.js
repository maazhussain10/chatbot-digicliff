const {
  addDatabaseDetails,
  getDatabaseDetails,
  breakConnection,
} = require("../files/SQL-database");

class KnowledgeStore {
  constructor(app) {
    this.databaseDetails(app);
  }

  databaseDetails(app) {
    app.post("/addDatabaseDetails", (req, res) => {
      let { username, assistantName, dbUsername, dbPassword, databaseName } =
        req.query;
      // connect with their DB server.
      let hostname = "localhost";

      addDatabaseDetails(
        username,
        assistantName,
        hostname,
        dbUsername,
        dbPassword,
        databaseName
      );
      res.send();
    });

    // Check if the database already Exists or not.
    app.get("/getDatabaseDetails", async (req, res) => {
      let { username, assistantName } = req.query;
      // Check if DB already created for the assistant.
      let databaseDetails = await getDatabaseDetails(username, assistantName);
      res.send(databaseDetails);
    });

    // Break the established connection.
    app.get("/breakConnection", (req, res) => {
      let { username, assistantName } = req.query;
      // Check if DB already created for the assistant.
      breakConnection(username, assistantName);
      res.send();
    });
  }
}

module.exports = KnowledgeStore;
