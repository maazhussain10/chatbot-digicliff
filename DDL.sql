CREATE TABLE IF NOT EXISTS `Users` (
    `id` CHAR(36) BINARY NOT NULL,
    `firstName` VARCHAR(255) NOT NULL,
    `lastName` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL UNIQUE,
    `username` VARCHAR(255) NOT NULL UNIQUE,
    `password` VARCHAR(255) NOT NULL,
    `createdAt` DATETIME NOT NULL,
    `updatedAt` DATETIME NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `Chatbots` (
    `id` CHAR(36) BINARY NOT NULL,
    `userId` CHAR(36) BINARY NOT NULL,
    `chatbotName` VARCHAR(255) NOT NULL,
    `description` VARCHAR(255) NOT NULL,
    `createdAt` DATETIME NOT NULL,
    `updatedAt` DATETIME NOT NULL,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`userId`) REFERENCES `Users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `DatabaseConnections` (
    `chatbotId` CHAR(36) BINARY NOT NULL,
    `hostName` VARCHAR(255) NOT NULL,
    `dbUsername` VARCHAR(255) NOT NULL,
    `dbPassword` VARCHAR(255) NOT NULL,
    `dbName` VARCHAR(255) NOT NULL,
    `createdAt` DATETIME NOT NULL,
    `updatedAt` DATETIME NOT NULL,
    PRIMARY KEY (`chatbotId`),
    FOREIGN KEY (`chatbotId`) REFERENCES `Chatbots` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `Intents` (
    `id` VARCHAR(255) NOT NULL,
    `chatbotId` CHAR(36) BINARY NOT NULL,
    `intentName` VARCHAR(255) NOT NULL,
    `description` VARCHAR(255) NOT NULL,
    `previousIntent` VARCHAR(255) NOT NULL,
    `multipleReply` TINYINT(1) NOT NULL,
    `createdAt` DATETIME NOT NULL,
    `updatedAt` DATETIME NOT NULL,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`chatbotId`) REFERENCES `Chatbots` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `Messages` (
    `intentId` VARCHAR(255) NOT NULL,
    `messageType` VARCHAR(255) NOT NULL,
    `message` VARCHAR(255) NOT NULL,
    `createdAt` DATETIME NOT NULL,
    `updatedAt` DATETIME NOT NULL,
    PRIMARY KEY (`intentId`, `messageType`, `message`),
    FOREIGN KEY (`intentId`) REFERENCES `Intents` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `QueryTable` (
    `id` INTEGER NOT NULL auto_increment,
    `intentId` VARCHAR(255) NOT NULL,
    `tableName` VARCHAR(255) NOT NULL,
    `columnName` VARCHAR(255) NOT NULL,
    `compareCondition` VARCHAR(255) NOT NULL,
    `compareValue` VARCHAR(255) NOT NULL,
    `logic` VARCHAR(255) NOT NULL,
    `selectColumn` TINYINT(1) NOT NULL,
    `distinctColumn` TINYINT(1) NOT NULL,
    `createdAt` DATETIME NOT NULL,
    `updatedAt` DATETIME NOT NULL,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`intentId`) REFERENCES `Intents` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `Queries` (
    `intentId` VARCHAR(255) NOT NULL,
    `query` VARCHAR(255) NOT NULL,
    `createdAt` DATETIME NOT NULL,
    `updatedAt` DATETIME NOT NULL,
    PRIMARY KEY (`intentId`, `query`),
    FOREIGN KEY (`intentId`) REFERENCES `Intents` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `Entities` (
    `chatbotId` CHAR(36) BINARY NOT NULL,
    `intentId` VARCHAR(255) NOT NULL,
    `entityType` VARCHAR(255) NOT NULL,
    `entityName` VARCHAR(255) NOT NULL,
    `createdAt` DATETIME NOT NULL,
    `updatedAt` DATETIME NOT NULL,
    PRIMARY KEY (`chatbotId`, `entityName`),
    FOREIGN KEY (`chatbotId`) REFERENCES `Chatbots` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (`intentId`) REFERENCES `Intents` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `VisitorDetails` (
    `chatbotId` CHAR(36) BINARY NOT NULL,
    `entityType` VARCHAR(30) NOT NULL,
    `entityName` VARCHAR(30) NOT NULL,
    `entityValue` VARCHAR(30),
    `ipAddress` VARCHAR(15),
    `createdAt` DATETIME NOT NULL,
    `updatedAt` DATETIME NOT NULL,
    PRIMARY KEY (`chatbotId`, `entityName`, `ipAddress`),
    FOREIGN KEY (`chatbotId`) REFERENCES `Chatbots` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `Chips` (
    `intentId` VARCHAR(255) NOT NULL,
    `useQuery` TINYINT(1) NOT NULL,
    `chipValue` VARCHAR(255) NOT NULL,
    `order` INTEGER,
    `createdAt` DATETIME NOT NULL,
    `updatedAt` DATETIME NOT NULL,
    PRIMARY KEY (`intentId`, `chipValue`),
    FOREIGN KEY (`intentId`) REFERENCES `Intents` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `Cards` (
    `intentId` VARCHAR(255) NOT NULL,
    `useQuery` TINYINT(1) NOT NULL,
    `cardType` VARCHAR(255) NOT NULL,
    `cardFields` VARCHAR(255) NOT NULL,
    `cardValues` VARCHAR(255) NOT NULL,
    `order` INTEGER,
    `createdAt` DATETIME NOT NULL,
    `updatedAt` DATETIME NOT NULL,
    PRIMARY KEY (`intentId`, `cardValues`),
    FOREIGN KEY (`intentId`) REFERENCES `Intents` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `Settings` (
    `assistantId` VARCHAR(255) NOT NULL,
    `cardBgColor` VARCHAR(255) NOT NULL,
    `cardTextColor` VARCHAR(255) NOT NULL,
    `cardBorder` VARCHAR(255) NOT NULL,
    `cardFont` VARCHAR(255) NOT NULL,
    `chipBgColor` VARCHAR(255) NOT NULL,
    `chipTextColor` VARCHAR(255) NOT NULL,
    `chipBorder` VARCHAR(255) NOT NULL,
    `chipFont` VARCHAR(255) NOT NULL,
    `chipShape` INTEGER NOT NULL,
    `userBgColor` VARCHAR(255) NOT NULL,
    `userTextColor` VARCHAR(255) NOT NULL,
    `userFont` VARCHAR(255) NOT NULL,
    `botBgColor` VARCHAR(255) NOT NULL,
    `botTextColor` VARCHAR(255) NOT NULL,
    `botFont` VARCHAR(255) NOT NULL,
    `chatboxColor` VARCHAR(255) NOT NULL,
    `chatboxTextColor` VARCHAR(255) NOT NULL,
    `chatboxFont` VARCHAR(255) NOT NULL,
    `sendMessageIconColor` VARCHAR(255) NOT NULL,
    `createdAt` DATETIME NOT NULL,
    `updatedAt` DATETIME NOT NULL,
    `chatbotId` CHAR(36) BINARY,
    PRIMARY KEY (`assistantId`),
    FOREIGN KEY (`chatbotId`) REFERENCES `Chatbots` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB;