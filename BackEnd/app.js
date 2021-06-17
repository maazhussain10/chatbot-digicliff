const express = require("express");
const cors = require("cors");
const session = require("express-session");
const path = require("path");
const SigningUp = require("./routes/signup");
const LoggingIn = require("./routes/login");
const Assistant = require("./routes/assistant");
const Intent = require("./routes/intent");
const Messages = require("./routes/messages");
const DatabaseDetails = require("./routes/databaseDetails");
const Entity = require("./routes/entity");
const NLP = require("./routes/NLP");
const RichResponse = require("./routes/richResponse");
const Settings = require("./routes/settings");
const Query = require("./routes/query");

const app = express();
app.use(cors());
app.use(express.static(path.join(__dirname, "build")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    secret: "Dwabzy Zaam Mr.Indolent nmpro",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1825 * 86400 * 1000,
      httpOnly: false,
    },
  })
);

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, build, "index.html"));
});

new SigningUp(app);
new LoggingIn(app);
new Assistant(app);
new Intent(app);
new Messages(app);
new DatabaseDetails(app);
new NLP(app);
new RichResponse(app);
new Query(app);
new Entity(app);
new Settings(app);

app.listen(5000, () => console.log("Running on port 5000"));
