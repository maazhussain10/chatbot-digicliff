const {
    DataTypes
} = require('sequelize');
module.exports = (sequelize) => {
    const Settings = sequelize.define('Settings', {
        chatbotId: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true
        },
        cardTheme: {
            type: DataTypes.STRING,
            defaultValue: "#000000,#ffffff,#32CD32,Cursive",
            allowNull: false
        },
        chipTheme: {
            type: DataTypes.STRING,
            defaultValue: "#000000,#FFFFFF,#000000,6,verdana",
            allowNull: false
        },
        messageTheme: {
            type: DataTypes.STRING,
            defaultValue: "#000000,Cursive,#ffffff,#e7dff9,Cursive,#000000",
            allowNull: false
        },
        chatboxTheme: {
            type: DataTypes.STRING,
            defaultValue: "#000000,Arial,#FFFFFF,#000000",
            allowNull: false
        }
    });

    return Settings;
}