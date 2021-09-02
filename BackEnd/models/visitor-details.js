const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
    const VisitorDetails = sequelize.define('VisitorDetails', {
        chatbotId: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true
        },
        entityType: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
        entityName: {
            type: DataTypes.STRING(30),
            allowNull: false,
            primaryKey: true
        },
        entityValue: {
            type: DataTypes.STRING(100),
        },
        ipAddress: {
            type: DataTypes.STRING(15),
            primaryKey: true,
        }
    })

    return VisitorDetails;
}
