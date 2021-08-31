const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
    const QueryTable = sequelize.define('QueryTable', {
        intentId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        tableName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        columnName: {
            type: DataTypes.STRING,
        },
        compareCondition: {
            type: DataTypes.STRING,
        },
        compareValue: {
            type: DataTypes.STRING,
        },
        logic: {
            type: DataTypes.STRING,
        },
        selectColumn: {
            type: DataTypes.STRING,
        },
        distinctColumn: {
            type: DataTypes.STRING,
        },
    }, {
        freezeTableName: true
    })

    return QueryTable;
}
