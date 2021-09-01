const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
    const DatabaseConnection = sequelize.define('DatabaseConnection', {
        chatbotId: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true
        },
        hostName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        dbUsername: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        dbPassword: {
            type: DataTypes.STRING,
            allowNull: false
        },
        dbName: {
            type: DataTypes.STRING,
            allowNull: false
        }
    })

    return DatabaseConnection;
}
