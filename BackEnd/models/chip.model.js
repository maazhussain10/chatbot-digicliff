const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
    const Chip = sequelize.define('Chip', {
        intentId: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true
        },
        useQuery: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        chipValue: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true
        },
        chipOrder: {
            type: DataTypes.INTEGER,
        },
    })

    return Chip;
}
