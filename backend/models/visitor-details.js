const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
    const VisitorDetail = sequelize.define('VisitorDetail', {
        chatbotId: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true
        },
        entityType: {
            type: DataTypes.STRING(30),
            allowNull: false,
        },
        entityName: {
            type: DataTypes.STRING(30),
            allowNull: false,
            primaryKey: true
        },
        entityValue: {
            type: DataTypes.STRING(30),
        },
        ipAddress: {
            type: DataTypes.STRING(15),
            primaryKey: true,
        }
    })

    return VisitorDetail;
}
