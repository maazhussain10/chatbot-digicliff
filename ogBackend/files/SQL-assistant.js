const { connection } = require("./connection");
const { getTime } = require("./utilityFunctions");

exports.createAssistant = (username, assistantName, description) => {
  let sql = `Insert into assistant values(?, ?, ?, ?);`;
  //Get assistant Id and Time
  let time = getTime();

  connection.query(sql, [username, assistantName, description, time], (err) => {
    if (err) console.log(err);
  });
};

exports.getExistingAssistants = (username) => {
  let sql = `select * from assistant where username =? order by lastModified desc;`;
  return new Promise((resolve, reject) => {
    connection.query(sql, [username], (err, results) => {
      if (err) console.log(err);
      else {
        let assistantsList = [];
        for (let i = 0; i < results.length; i++) {
          let assistant = {
            assistantName: results[i].assistant,
            assistantDesc: results[i].description,
            lastModified: results[i].lastModified
          };
          assistantsList.push(assistant);
        }

        const responseData = {
          responseType: "Success",
          responseStatus: true,
          existingAssistants: assistantsList,
        };
        resolve(responseData);
      }
    });
  });
};

exports.doesAssistantExist = (username, assistantName) => {
  let sql = "Select * from assistant where username=? and assistant like ?;";
  return new Promise((resolve, reject) => {
    connection.query(sql, [username, assistantName + "-%"], (err, results) => {
      if (err) console.log(err);
      else if (results.length != 0) {
        resolve(true);
      } else resolve(false);
    });
  });
};

exports.updateAssistant = (username, assistantName, description, previousAssistantName) => {
  let time = getTime();
  let sql =
    "update assistant set assistant=?, description=?, lastModified=? where assistant=? and username=?;";
  console.log(assistantName);
  connection.query(
    sql,
    [assistantName, description, time, previousAssistantName, username],
    (err) => {
      if (err) console.log(err);
    }
  );
};

exports.deleteAssistant = (username, assistantName) => {
  // Delete assistant from table.
  let sql = "delete FROM assistant where assistant=? and username=?;";
  connection.query(sql, [assistantName, username], (err, results) => {
    if (err) return console.log(err.message);
  });
};
