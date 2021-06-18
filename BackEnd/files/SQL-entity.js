const { connection } = require("./connection");

//------------------------------------------------------------Create Entity-----------------------------------------------------------------------
exports.createEntity = async (
  username,
  assistantName,
  intentName,
  selectedColumns,
  entityNames
) => {
  let ipAddress = "172.19.12.1";
  for (let i = 0; i < selectedColumns.length; i++) {
    let entityName = JSON.parse(entityNames)[selectedColumns[i]];
    let sql = "insert into entity values(?,?,?,?,?,?,'NULL');";
    connection.query(
      sql,
      [
        username,
        assistantName,
        intentName,
        ipAddress,
        entityName,
        selectedColumns[i].toLowerCase(),
      ],
      (err, results) => {
        if (err) console.log(err);
        else {
          console.log("entityId");
        }
      }
    );
  }
};

//------------------------------------------------------------Add Entity Value(Do in Save Conversation)-----------------------------------------------------------------------

exports.entityValue = (username, assistantName, intentName, existingEntities, sendMessage) => {
  console.log(username, assistantName, intentName, existingEntities, sendMessage);
  let sql = "select * from entity where username=? and assistant=? and intent=?";
  return new Promise((resolve) => {
    connection.query(sql, [username, assistantName, intentName], async (err, results) => {
      if (err) console.log(err);
      else {
        for (let i = 0; i < results.length; i++) {
          if (results[i].entityType === "name" || results[i].entityType === "other")
            existingEntities.push(results[i].entityType);
        }
        let value;
        for (let i = 0; i < existingEntities.length; i++) {
          if (existingEntities[i] === "name") {
            sendMessage = sendMessage.replace('my ', '');
            sendMessage = sendMessage.replace('name ', '');
            sendMessage = sendMessage.replace('is ', '');
            value = sendMessage;
            entityName = "name";
          } else if (existingEntities[i] === "other") {
            value = sendMessage;
            entityName = "other";
          } else {
            value = existingEntities[i].sourceText;
            entityName = existingEntities[i].entity;
          }
          await this.updateEntityValue(username, assistantName, entityName, intentName, value);
        }
        resolve("true");
      }
    });
  });
};

//------------------------------------------------------------Get Entities-----------------------------------------------------------------------

exports.getEntities = (username, assistantName, intentName) => {
  console.log(intentName);
  let sql = "select * from entity where username=? and assistant=? and intent=? ";
  return new Promise((resolve) => {
    connection.query(sql, [username, assistantName, intentName], (err, results) => {
      if (err) console.log(err);
      else {
        resolve(results);
      }
    });
  });
};

//------------------------------------------------------------Update Entity-----------------------------------------------------------------------

exports.updateEntityValue = (username, assistantName, entityName, intentName, value) => {
  console.log(intentName, entityName, value);
  let sql =
    "update entity set entityValue=? where username=? and assistant=? and intent=? and entityType=?";
  return new Promise((resolve) => {
    connection.query(
      sql,
      [value, username, assistantName, intentName, entityName.toLowerCase()],
      (err2) => {
        if (err2) console.log(err2);
        else {
          resolve("Success");
        }
      }
    );
  });
};

//------------------------------------------------------------Delete Entity-----------------------------------------------------------------------

exports.deleteEntity = (username, assistantName, intentName) => {
  let sql = "delete from entity where username=? and assistant=? and intent=? and entityName=?";
  return new Promise((resolve) => {
    connection.query(
      sql,
      [username, assistantName, intentName, entityName.toLowerCase()],
      (err2) => {
        if (err2) console.log(err2);
        else {
          resolve("Success");
        }
      }
    );
  });
};
