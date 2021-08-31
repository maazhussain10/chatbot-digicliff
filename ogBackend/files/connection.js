const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Dwabzy",
  database: "assistantapi"
});

// To print stack trace of fatal error
var del = connection._protocol._delegateError;
connection._protocol._delegateError = function (err, sequence) {
  if (err.fatal) {
    console.trace("fatal error: " + err.message);
  }
  return del.call(this, err, sequence);
};

connection.connect(function (err) {
  if (err) console.log("Database connection unsuccessful!");
  else console.log("Database connected successfully");
});

DataBaseConnection = async (hostname, userName, password, databaseName) => {
  console.log(hostname, userName, password, databaseName);
  const DBconnection = mysql.createConnection({
    host: hostname,
    user: userName,
    password: password,
    database: databaseName,
  });

  DBconnection.connect(function (err) {
    if (err) console.log("Knowledge Store Database connection unsuccessful!");
    else console.log("Knowledge Store Database connected successfully");
  });

  return await DBconnection;
};

module.exports = { connection, DataBaseConnection };
