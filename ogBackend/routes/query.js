const {
  getColumnNames,
  getQueryDetails,
  deleteExistingQuery,
  addQueryDetails,
  addQuery,
} = require("../files/SQL-query");

class Query {
  constructor(app) {
    this.runQuery(app);
  }

  runQuery(app) {
    app.get("/getColumnNames", async (req, res) => {
      let { username, assistantName, tableName } = req.query;

      const tempValues = await getColumnNames(username, assistantName, tableName);
      let values = [];
      for (let i = 0; i < tempValues.length; i++) {
        values.push(tempValues[i].COLUMN_NAME);
      }
      res.send(values);
    });

    app.get("/getQueryDetails", async (req, res) => {
      let { username, assistantName, intentName } = req.query;

      let queryDetails = await getQueryDetails(username, assistantName, intentName);
      res.send(queryDetails);
    });

    app.get("/deleteQuery", (req, res) => {
      let { username, assistantName, intentName } = req.query;

      deleteExistingQuery(username, assistantName, intentName);
      res.send();
    });

    app.post("/createQuery", (req, res) => {
      let {
        rows,
        selectedColumns,
        distinctColumn,
        username,
        assistantName,
        intentName,
        tableName,
      } = req.query;

      //Add query details into the table
      addQueryDetails(
        rows,
        selectedColumns,
        distinctColumn,
        username,
        assistantName,
        intentName,
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

      addQuery(username, assistantName, intentName, query);
    });
  }
}

module.exports = Query;
