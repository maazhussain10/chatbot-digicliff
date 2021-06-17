const md5 = require("md5");
const {
  usernameExists,
  emailExists,
  createUser,
  deactivateAccount,
} = require("../files/SQL-user");

class SigningUp {
  constructor(app, connection) {
    this.signingUp(app, connection);
  }

  signingUp(app, connection) {
    app.post("/signingUp", (req, res) => {
      const { firstName, lastName, email, username } = req.query;
      const password = md5(req.query.password);

      // -------------------------------------------------USERNAME EXISTS?---------------------------------------------------------

      async function checkExistence() {
        let checkUsername = await usernameExists(username);
        let checkEmail = await emailExists(email);
        let existenceData = {
          usernameExists: false,
          emailExists: false,
          existenceStatus: false,
        };
        if (checkUsername) {
          existenceData.usernameExists = true;
          existenceData.existenceStatus = true;
        }
        if (checkEmail) {
          existenceData.emailExists = true;
          existenceData.existenceStatus = true;
        }
        let responseData = {
          responseStatus: false,
          existenceData: existenceData,
        };
        if (!existenceData.existenceStatus) {
          createUser(firstName, lastName, username, email, password);
          responseData.responseStatus = true;
        }
        res.send(responseData);
      }
      checkExistence();
    });

    app.get("/deactivate-account", (req, res) => {
      let { username } = req.query;

      console.log(username);
      deactivateAccount(username);
      res.send();
    });
  }
}

module.exports = SigningUp;
