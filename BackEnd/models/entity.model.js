const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
    const Entity = sequelize.define('Entity', {
        chatbotId: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true
        },
        intentId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        entityType: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        entityName: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true
        },
        order: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    })

    return Entity;
}
