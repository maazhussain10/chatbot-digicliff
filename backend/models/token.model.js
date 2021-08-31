const { Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Token = sequelize.define('Token', {
        userId: {
            type: Sequelize.UUID,
            allowNull: false,
        },
        refreshToken: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true
        },
        valid: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        expiresAt: {
            type: DataTypes.STRING,
            allowNull: false
        }
    })

    return Token;
}


