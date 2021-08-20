const { createEntity, getEntities, updateEntity, deleteEntity, visitorDetails } = require("../files/SQL-entity");

class Entity {
  constructor(app) {
    this.entity(app);
  }

  entity(app) {

    // Create and Update Entity.
    app.post("/create-entity", async(req, res) => {
      const { username, assistantName, intentName, selectedColumns, entityName } = req.query;
      let entities = await getEntities(username, assistantName, intentName);
      for (let i = 0; i < entities.length; i++){
        if (selectedColumns.includes(entities[i].entityType)) {
          // Update Entity if Entity Type Exists.
          await updateEntity(username, assistantName, intentName, JSON.parse(entityName)[entities[i].entityType], entities[i].entityType);
          // Remove the entities that have been updated from the selected Columns Array.
          selectedColumns.splice(selectedColumns.indexOf(entities[i].entityType), 1);
        }
      }
      // Create Entities for which entity Type does not exist.
      await createEntity(username, assistantName, intentName, selectedColumns, entityName,entities);
      res.send();
    });

//  Get entity Details.
    app.get("/get-entity", async (req, res) => {
      const { username, assistantName, intentName } = req.query;
      let entities = await getEntities(username, assistantName, intentName);
      res.send(entities);
    });

    //  Get Visitor Details.
    app.get("/visitor-details", async (req, res) => {
      const { username, assistant } = req.query;
      let visitorDetail = await visitorDetails(username, assistant);
      res.send(visitorDetail);
    });

//  Delete Entity.
    app.get("/delete-entity", async (req, res) => {
      const { username, assistantName, intentName,entityType } = req.query;
      await deleteEntity(username, assistantName, intentName,entityType);
      res.send();
    });
  }

}

module.exports = Entity;
