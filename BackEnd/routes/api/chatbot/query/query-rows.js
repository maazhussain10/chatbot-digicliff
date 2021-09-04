const queryRowsRoute = require("express").Router();
const db = require("../../../../models");
const { Op } = require("sequelize");

queryRowsRoute.get("/", async (req, res) => {
    let { intentId } = req.query;
    try {
        let tableNameResults = await db.QueryTable.findOne({
            attributes: ["tableName"],
            where: {
                intentId,
            },
            group: ["intentId"],
        });

        let rows = [];
        let selectedColumns = [];
        let distinctColumn = undefined;
        // If Table exists, get rows for where condition.
        if (tableNameResults) {
            let rowsResults = await db.QueryTable.findAll({
                attributes: [
                    "id",
                    ["columnName", "column"],
                    ["compareCondition", "operator"],
                    ["compareValue", "value"],
                    "logic",
                ],
                where: {
                    intentId,
                    selectColumn: null,
                    distinctColumn: null,
                },
            });
            rows = rowsResults;

            // Get Distinct Column from table
            let distinctColumnResults = await db.QueryTable.findAll({
                attributes: [["distinctColumn", "column"]],
                raw: true,
                where: {
                    intentId,
                    distinctColumn: {
                        [Op.ne]: null,
                    },
                },
            });

            // if distinct column exists, push the column to selectedcolumn, as a distinct column must be always selected.
            if (distinctColumnResults.length !== 0) {
                distinctColumn = distinctColumnResults[0].column;
                selectedColumns.push(distinctColumnResults[0].column);
            } else {
                let selectColumnResults = await db.QueryTable.findAll({
                    attributes: [["selectColumn", "column"]],
                    raw: true,
                    where: {
                        intentId,
                        selectColumn: {
                            [Op.ne]: null,
                        },
                    },
                });
                selectedColumns = selectColumnResults.map(
                    (result) => result.column
                );
            }
        }

        res.status(200).json({ tableName: tableNameResults.tableName, rows, distinctColumn, selectedColumns, distinctColumn });
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

queryRowsRoute.post("/", async (req, res) => {
    let { rows, selectedColumns, distinctColumn, intentId, tableName } =
        req.body;
    try {
        // Delete Existing rows in query Table if it exists.
        await db.QueryTable.destroy({ where: { intentId } });

        // Rows exists if the user specified 'where' conditions.
        if (rows) {
            for (let i = 0; i < rows.length; i++) {
                let { column, operator, value, logic } = rows[i];
                db.QueryTable.create({
                    intentId,
                    tableName,
                    columnName: column,
                    compareCondition: operator,
                    compareValue: value,
                    logic: logic === "Logical" ? null : logic,
                });
            }
        }
        for (let i = 0; i < selectedColumns.length; i++) {
            await db.QueryTable.create({
                intentId,
                tableName,
                selectColumn: selectedColumns[i],
            });
        }
        if (distinctColumn) {
            await db.QueryTable.create({ intentId, tableName, distinctColumn });
        }

        // Convert Query rows to a string that can run in Sequelize.query();


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
                let { column, operator, value, logic } = rows[i];
                conditionString += [column, operator, `"${value}"`].join(' ');
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

        // Add Query to Database.
        db.Query.upsert({ intentId, query });
        res.sendStatus(202);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});


queryRowsRoute.delete('/', (req, res) => {
    try {
        let { intentId } = req.body;

        db.Query.destroy({
            where: {
                intentId
            }
        })

        db.QueryTable.destroy({
            where: {
                intentId
            }
        })

        res.sendStatus(202);
    } catch (err) {
        res.status(500).send(err);
    }
})

module.exports = queryRowsRoute;