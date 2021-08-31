const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
    const Chatbot = sequelize.define('Chatbot', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            unique: 'userChatbotIndex',
        },
        chatbotName: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: 'userChatbotIndex',
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false
        },
    })

    return Chatbot;
}
