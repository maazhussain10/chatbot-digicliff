const { connection } = require("./connection");
const { getTime } = require("./utilityFunctions");

//------------------------------------------------------------Create/Add Messages-----------------------------------------------------------------------

exports.addMessage = (username, assistantName, intentName, messageType, message) => {
  let sql = "insert into messages values(?, ?, ?, ?, ?, ?);";
  connection.query(
    sql,
    [username, assistantName, intentName, messageType, message, getTime()],
    (err) => {
      if (err) console.log(err);
      else console.log("Created Training Phrase ", message);
    }
  );
};

//------------------------------------------------------------Get User or Assistant Message-----------------------------------------------------------------------

exports.getMessages = (username, assistantName, intentName, messageType) => {
  let sql =
    "select message from messages where username=? and assistant=? and intent=? and messageType=? order by timeCreated;";
  return new Promise((resolve, reject) => {
    connection.query(sql, [username, assistantName, intentName, messageType], (err, results) => {
      if (err) return console.log(err);
      else {
        let messages = [];
        console.log(results);
        for (let i = 0; i < results.length; i++) {
          messages.push({
            message: results[i].message,
          });
        }
        resolve(messages);
      }
    });
  });
};

//------------------------------------------------------------Get All  Messages-----------------------------------------------------------------------

exports.getAllMessages = (username, assistantName, intentName) => {
  let sql =
    "select message, messageType from messages where username=? and assistant=? and intent=? order by timeCreated desc;";
  return new Promise((resolve, reject) => {
    connection.query(sql, [username, assistantName, intentName], (err, results) => {
      if (err) return console.log(err);
      else {
        let messages = [];
        for (let i = 0; i < results.length; i++) {
          messages.push({
            message: results[i].message,
            messageType: results[i].messageType,
          });
          console.log(results[i].message);
        }
        resolve(messages);
      }
    });
  });
};

//------------------------------------------------------------Update Messages-----------------------------------------------------------------------

exports.updateMessage = (
  username,
  assistantName,
  intentName,
  messageType,
  message,
  previousMessage
) => {
  let sql =
    "update messages set message=? where username=? and assistant=?and intent=? and messageType=? and message=?;";
  connection.query(
    sql,
    [message, username, assistantName, intentName, messageType, previousMessage],
    (err) => {
      if (err) console.log(err);
      else console.log("Message has been updated");
    }
  );
};

//------------------------------------------------------------Delete Messages-----------------------------------------------------------------------

exports.deleteMessage = (username, assistantName, intentName, messageType, message) => {
  console.log(username, message, messageType, assistantName, intentName);
  let sql =
    "delete from messages where username=? and assistant=? and intent=? and messageType=? and message = ?;";
  connection.query(
    sql,
    [username, assistantName, intentName, messageType, message],
    (err, results) => {
      if (err) return console.log(err.message);
    }
  );
};
