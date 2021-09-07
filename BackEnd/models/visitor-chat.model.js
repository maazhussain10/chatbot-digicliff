const { DataTypes } = require("sequelize");
module.exports = (sequelize) => {
    const VisitorChat = sequelize.define("VisitorChat", {
        chatbotId: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
        },
        ipAddress: {
            type: DataTypes.STRING(15),
            primaryKey: true,
        },
        messageType: {
            type: DataTypes.STRING(30),
            primaryKey: true,
        },
        message: {
            type: DataTypes.STRING(100),
            primaryKey: true,
        },
    });

    return VisitorChat;
};
