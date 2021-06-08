const sqlFunctions = require("../files/sqlFunctions");

class Query {
  constructor(app) {
    this.runQuery(app);
  }

  runQuery(app) {
    app.get("/getColumnNames", (req, res) => {
      let { tableName } = req.query;
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
      res.header(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization, Content-Length, X-Requested-With, Accept"
      );

      let columnNames = async () => {
        const tempValues = await sqlFunctions.getColumnNames(tableName);
        let values = [];
        for (let i = 0; i < tempValues.length; i++) {
          values.push(tempValues[i].COLUMN_NAME);
        }
        res.send(values);
      };
      columnNames();
    });

    app.get("/getQueryDetails", async (req, res) => {
      let { intentId } = req.query;
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
      res.header(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization, Content-Length, X-Requested-With, Accept"
      );

      let queryDetails = await sqlFunctions.getQueryDetails(intentId);
      console.log(queryDetails);
      res.send(queryDetails);
    });

    app.get("/deleteQuery", (req, res) => {
      let { intentId } = req.query;

      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
      res.header(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization, Content-Length, X-Requested-With, Accept"
      );

      sqlFunctions.deleteExistingQuery(intentId);
      res.send();
    });

    app.post("/createQuery", (req, res) => {
      let { rows, selectedColumns, distinctColumn, userId, assistantId, intentId, tableName } =
        req.query;

      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
      res.header(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization, Content-Length, X-Requested-With, Accept"
      );

      //Add query details into the table
      sqlFunctions.addQueryDetails(
        rows,
        selectedColumns,
        distinctColumn,
        userId,
        assistantId,
        intentId,
        tableName
      );

      /*--------------------------------------------------- Create the query string----------------------------------------------------*/
      // Create a string for the selected columns
      let selectedColumnsString = "";
      if (distinctColumn) {
        selectedColumnsString += "distinct(" + distinctColumn + ")";
      } else {
        for (let i = 0; i < selectedColumns.length; i++) {
          selectedColumnsString += selectedColumns[i];
          if (i !== selectedColumns.length - 1) {
            selectedColumnsString += ", ";
          }
        }
      }

      // Create a string for the condition
      let conditionString = "";
      if (rows) {
        for (let i = 0; i < rows.length; i++) {
          let { selectedColumn, selectedOperator, compareValue, logic } = JSON.parse(rows[i]);
          conditionString += selectedColumn + " " + selectedOperator + " " + `"${compareValue}"`;
          if (logic === "And") {
            conditionString += " and ";
          }
          if (logic === "Or") {
            conditionString += " or ";
          }
        }
      }

      // Construct the query using selectedColumns and Conditions
      let query = `select ${selectedColumnsString} from ${tableName}`;
      if (conditionString.length !== 0) {
        query += " where " + conditionString;
      }
      query += ";";

      sqlFunctions.addQuery(userId, assistantId, intentId, query);
    });
  }
}

module.exports = Query;
