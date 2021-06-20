const { connection } = require("./connection");

//------------------------------------------------------------Store Database Details-----------------------------------------------------------------------

exports.addDatabaseDetails = (
  username,
  assistantName,
  hostname,
  dbUsername,
  password,
  databaseName
) => {
  let sql = "insert into databaseConnection values(?, ?, ?, ?, ?, ?);";
  connection.query(
    sql,
    [username, assistantName, hostname, dbUsername, password, databaseName],
    (err) => {
      if (err) return console.log(err);
    }
  );
};

exports.getDatabaseDetails = (username, assistantName) => {
  let sql = "select * from databaseConnection where username=? and assistant=?;";
  return new Promise((resolve) => {
    connection.query(sql, [username, assistantName], (err, results) => {
      if (err) console.log(err);
      else if (results.length !== 0) {
        resolve({
          hostname: results[0].hostname,
          dbUsername: results[0].dbUsername,
          dbPassword: results[0].dbPassword,
          databaseName: results[0].databaseName,
        });
      } else {
        resolve();
      }
    });
  });
};

exports.breakConnection = (username, assistantName) => {
  let sql = "delete from databaseConnection where username=? and assistant=?;";
  return new Promise((resolve) => {
    connection.query(sql, [username, assistantName], (err, results) => {
      if (err) console.log(err);
      else if (results.length !== 0) {
        connection.query('delete from queryTable where username=? and assistant=?', [username, assistantName]);
        resolve();
      } else {
        connection.query('delete from queryTable where username=? and assistant=?', [username, assistantName]);
        resolve();
      }
    });
  });

};



