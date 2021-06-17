const { addDatabaseDetails } = require("../files/SQL-database");

class KnowledgeStore {
  constructor(app) {
    this.databaseDetails(app);
  }

  databaseDetails(app) {
    app.post("/addDatabaseDetails", (req, res) => {
      let { username, assistantName, dbUsername, password, databaseName } = req.query;
      console.log(username, password, databaseName);
      // connect with their DB server.
      let hostname = "localhost";

      addDatabaseDetails(username, assistantName, hostname, dbUsername, password, databaseName);
      res.send();
    });
  }
}

module.exports = KnowledgeStore;
