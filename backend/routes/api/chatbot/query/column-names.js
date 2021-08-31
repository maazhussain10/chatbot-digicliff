const columnNamesRoute = require('express').Router();
const db = require("../../../../models");
const { QueryTypes } = require('sequelize');
let { dbConfig } = require('../../../../configs');

columnNamesRoute.get('/', async (req, res) => {
    let { tableName } = req.query;
    try {
        const results = await db.sequelize.query(`select COLUMN_NAME from information_schema.columns where TABLE_NAME=? and TABLE_SCHEMA=?;`,
            {
                raw: true,
                replacements: [tableName, dbConfig.DB_NAME],
                type: QueryTypes.SELECT,
            })
        let columns = results.map((result) => result['COLUMN_NAME']);
        res.status(200).json({ columns });
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

module.exports = columnNamesRoute;