const { connection } = require("./connection");

//------------------------------------------------------------Create Chip-----------------------------------------------------------------------

exports.createChip = (username, assistantName, intentName, usingQueries, chipValue) => {
  let sql = "insert into richresponsesChip values(?, ?, ?, ?, ?);";
  connection.query(sql, [username, assistantName, intentName, usingQueries, chipValue], (err) => {
    if (err) console.log(err);
    else console.log("Inserted Chip ");
  });
};

//------------------------------------------------------------Get All Chips without Query-----------------------------------------------------------------------

exports.getChips = (username, assistantName, intentName) => {
  let sql =
    'select chipValue from richresponsesChip where username=? and assistant=? and intent = ? and useQuery="false" and chipValue!="null"; ';
  return new Promise((resolve, reject) => {
    connection.query(sql, [username, assistantName, intentName], (err, results) => {
      if (err) console.log(err);
      else {
        resolve(results);
      }
    });
  });
};

//------------------------------------------------------------Get Query Chips-----------------------------------------------------------------------

exports.getQueryChips = (username, assistantName, intentName) => {
  let sql =
    'select * from richresponsesChip where username=? and assistant=? and intent = ? and useQuery="true"; ';
  return new Promise((resolve, reject) => {
    connection.query(sql, [username, assistantName, intentName], (err, results) => {
      if (err) console.log(err);
      else {
        resolve(results);
      }
    });
  });
};

//------------------------------------------------------------Get All Chips-----------------------------------------------------------------------

exports.getAllChips = (username, assistantName, intentName) => {
  let sql =
    'select * from richresponsesChip where username=? and assistant=? and intent = ? and chipValue != "null";';
  return new Promise((resolve, reject) => {
    connection.query(sql, [username, assistantName, intentName], (err, results) => {
      if (err) console.log(err);
      else {
        console.log("Chips are ", results);
        resolve(results);
      }
    });
  });
};

//------------------------------------------------------------Update Chip-----------------------------------------------------------------------

exports.updateChip = (username, assistantName, intentName, chipValue, previousChipValue) => {
  let sql =
    "update richresponsesChip set chipValue=? where username=? and assistant=? and intent=? and chipValue=?;";
  connection.query(
    sql,
    [chipValue, username, assistantName, intentName, previousChipValue],
    (err) => {
      if (err) console.log(err);
      else console.log("response has been updated");
    }
  );
};

//------------------------------------------------------------Delete Chip-----------------------------------------------------------------------

exports.deleteChip = (username, assistantName, intentName, chipValue) => {
  let sql =
    "delete from richresponsesChip where username = ? and assistant = ? and intent = ? and chipValue=?;";
  connection.query(sql, [username, assistantName, intentName, chipValue], (err, results) => {
    if (err) return console.log(err.message);
    else console.log("Deleted Chip");
  });
};
