const { connection } = require("./connection");

exports.createUser = (firstName, lastName, username, email, password) => {
  let sql = `Insert into userAuth values(?, ?, ?, ?, ?);`;
  connection.query(sql, [firstName, lastName, email, username, password], (err, results) => {
    if (err) return console.log(err);
    else {
      console.log("User has been created");
    }
  });
};

exports.userExists = async (username, email) => {
  let sql = "Select * from userAuth where username=? or email=?;";
  return new Promise((resolve, reject) => {
    connection.query(sql, [username, email], (err, results) => {
      if (err) console.log(err);
      else if (results.length != 0) {
        let responseData = {
          username: results[0].username,
          password: results[0].password,
          firstName: results[0].firstName,
          lastName: results[0].lastName,
          emailId: results[0].email,
        };
        resolve(responseData);
      } else resolve(false);
    });
  });
};

exports.usernameExists = async (username) => {
  let sql = "Select * from userAuth where username=?;";
  return new Promise((resolve, reject) => {
    connection.query(sql, [username], (err, results) => {
      if (err) console.log(err);
      else if (results.length != 0) {
        let responseData = {
          username: results[0].username,
          password: results[0].password,
          email: results[0].email,
        };
        resolve(responseData);
      } else resolve(false);
    });
  });
};

exports.emailExists = async (email) => {
  let sql = "Select * from userAuth where email=?;";
  return new Promise((resolve, reject) => {
    connection.query(sql, [email], (err, results) => {
      if (err) console.log(err);
      else if (results.length != 0) {
        let responseData = {
          username: results[0].username,
          password: results[0].password,
          email: results[0].email,
        };
        resolve(responseData);
      } else resolve(false);
    });
  });
};

exports.deactivateAccount = (username) => {
  // Delete user from table.
  let sql = "delete FROM userAuth where username=?";
  connection.query(sql, [username], (err, results) => {
    if (err) return console.log(err.message);
  });
};
