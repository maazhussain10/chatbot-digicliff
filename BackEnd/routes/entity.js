const { createEntity, getEntities } = require("../files/SQL-entity");

class Entity {
  constructor(app) {
    this.entity(app);
  }

  entity(app) {
    app.post("/create-entity", (req, res) => {
      const { username, assistantName, intentName, selectedColumns, entityName } = req.query;
      console.log(
        "Details (Create - Entity ):",
        username,
        assistantName,
        intentName,
        selectedColumns,
        entityName
      );

      createEntity(username, assistantName, intentName, selectedColumns, entityName);
      res.send();
    });
    app.get("/get-entity", async (req, res) => {
      const { username, assistantName, intentName } = req.query;
      console.log(intentName);

      let entities = await getEntities(username, assistantName, intentName);
      console.log("Entities:", entities);
      res.send(entities);
    });
  }
}

module.exports = Entity;
