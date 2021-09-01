const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
    const Intent = sequelize.define('Intent', {
        id: {
            type: DataTypes.STRING,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        chatbotId: {
            type: DataTypes.UUID,
            allowNull: false,
            unique: "chatbotIntentIndex"
        },
        intentName: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: "chatbotIntentIndex"
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false
        },

        multipleReply: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        }
    })

    return Intent;
}
