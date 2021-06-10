const mysql = require("mysql");

exports.DataBaseConnection = async (hostname, userName, password, databaseName) => {
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
