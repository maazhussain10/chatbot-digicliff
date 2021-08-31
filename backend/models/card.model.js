const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
    const Card = sequelize.define('Card', {
        intentId: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true
        },
        useQuery: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        cardType: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        cardFields: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        cardValues: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true
        },
        cardOrder: {
            type: DataTypes.INTEGER,
        },
    })

    return Card;
}
