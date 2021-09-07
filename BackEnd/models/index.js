const { Sequelize } = require('sequelize');
const { dbConfig } = require('../configs');

const { DB_NAME, DB_USERNAME, DB_PASSWORD, DB_HOST } = dbConfig;

const sequelize = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
    host: DB_HOST,
    dialect: 'mysql',
    logging: false
});


const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }

    await sequelize.sync();
}




// Import Models
let User = require('./user.model')(sequelize);
let Chatbot = require('./chatbot.model')(sequelize);
let DatabaseConnection = require('./database-connection.model')(sequelize);
let Intent = require('./intent.model')(sequelize);
let Message = require('./message.model')(sequelize);
let QueryTable = require('./queryTable.model')(sequelize);
let Query = require('./query.model')(sequelize);
let Entity = require('./entity.model')(sequelize);
let VisitorDetails = require('./visitor-details.model')(sequelize);
let VisitorChat = require('./visitor-chat.model')(sequelize);
let Chip = require('./chip.model')(sequelize);
let Card = require('./card.model')(sequelize);
let Settings = require('./settings.model')(sequelize);
let Token = require('./token.model')(sequelize);

// User and Token have a "One to many" Relation. That is, each user can have more than one token present in the database.
User.hasMany(Token, {
    foreignKey: 'userId',
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
});
Token.belongsTo(User, { foreignKey: 'userId' });

// Each User can have more than one chatbot
User.hasMany(Chatbot, {
    foreignKey: "userId",
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
});
Chatbot.belongsTo(User, { foreignKey: "userId" });

//Each Chatbot can have only one Database Connection
Chatbot.hasOne(DatabaseConnection, {
    foreignKey: "chatbotId",
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
});
DatabaseConnection.belongsTo(Chatbot, { foreignKey: "chatbotId" });

// Each Chatbot can have only one group of settings.
Chatbot.hasOne(Settings, {
    foreignKey: "chatbotId",
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
});
Settings.belongsTo(Chatbot, { foreignKey: "chatbotId" });

// Each Chatbot can have more than one Intent
Chatbot.hasMany(Intent, {
    foreignKey: "chatbotId",
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
});
Intent.belongsTo(Chatbot, { foreignKey: "chatbotId" });

// Each Intent can have more than one Follow up Intent but can only have one previousIntent
Intent.hasMany(Intent, {
    foreignKey: "previousIntent",
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
});
Intent.belongsTo(Intent, { foreignKey: "previousIntent", });

// Each Intent can have more than one Message
Intent.hasMany(Message, {
    foreignKey: "intentId",
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
});
Message.belongsTo(Intent, { foreignKey: "intentId" });


// Each Intent can have more than one row in Query Table
Intent.hasMany(QueryTable, {
    foreignKey: "intentId",
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
});
QueryTable.belongsTo(Intent, { foreignKey: "intentId" });

// Each Intent can have only one query
Intent.hasOne(Query, {
    foreignKey: "intentId",
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
});
Query.belongsTo(Intent, { foreignKey: "intentId" });

// Each Chatbot can have move than one Entitiy
Chatbot.hasMany(Entity, {
    foreignKey: "chatbotId",
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
});
Entity.belongsTo(Chatbot, { foreignKey: "chatbotId" });

// Each Intent can have more than one Entity
Intent.hasMany(Entity, {
    foreignKey: "intentId",
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
});
Entity.belongsTo(Intent, { foreignKey: "intentId" });

// Each Chatbot can have the details of more than one visitor ( May need to add for Intent too )
Chatbot.hasMany(VisitorDetails, {
    foreignKey: "chatbotId",
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
});
VisitorDetails.belongsTo(Chatbot, { foreignKey: "chatbotId" });

// Each Chatbot can have the details of more than one visitor ( May need to add for Intent too )
Chatbot.hasMany(VisitorChat, {
    foreignKey: "chatbotId",
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
});
VisitorChat.belongsTo(Chatbot, { foreignKey: "chatbotId" });

// Each Intent can have more than one chip
Intent.hasMany(Chip, {
    foreignKey: "intentId",
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
});
Chip.belongsTo(Intent, { foreignKey: "intentId" });

// Each Intent can have more than one card
Intent.hasMany(Card, {
    foreignKey: "intentId",
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
});
Card.belongsTo(Intent, { foreignKey: "intentId" });


testConnection();


module.exports = {
    sequelize,
    User,
    Token,
    Chatbot,
    DatabaseConnection,
    Intent,
    Message,
    QueryTable,
    Query,
    Entity,
    VisitorDetails,
    VisitorChat,
    Chip,
    Card,
    Settings,
};

