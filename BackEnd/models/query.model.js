const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
    const Query = sequelize.define('Query', {
        intentId: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true
        },
        query: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    })

    return Query;
}
