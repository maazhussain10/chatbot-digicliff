const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
    const Settings = sequelize.define('Settings', {
        chatbotId: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true
        },
        cardTheme: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "#770205,#ffffff,#ff2025,Cursive"
        },
        chipTheme: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "#072b2c,#064a04,#ffffff,6,verdana"
        },
        messageTheme: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "#000000,Cursive,#ffffff,#e7dff9,Cursive,#000000"
        },
        chatboxTheme: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "#000000,Arial,#FFFFFF,#000000"
        }
    });

    return Settings;
}
