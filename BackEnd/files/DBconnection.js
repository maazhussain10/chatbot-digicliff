const mysql = require('mysql');

exports.DataBaseConnection = async (userName, password, databaseName) => {

    const DBconnection = mysql.createConnection({
        host: "localhost",
        user: userName,
        password: password,
        database: databaseName,
    });

    DBconnection.connect(function (err) {
        if (err) console.log("Knowledge Store Database connection unsuccessful!");
        else console.log("Knowledge Store Database connected successfully");
    });

    return await DBconnection;

}
