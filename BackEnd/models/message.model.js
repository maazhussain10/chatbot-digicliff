const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
    const Message = sequelize.define('Message', {
        intentId: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true
        },
        messageType: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true
        },
        message: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true
        },
    })

    return Message;
}
