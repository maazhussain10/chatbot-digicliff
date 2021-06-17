CREATE DATABASE chatbotAPI;
USE chatbotAPI;


CREATE TABLE userAuth
(
    firstName varchar(50) NOT NULL,
    lastName varchar(50) NOT NULL,
    email varchar(30) NOT NULL,
    username varchar(50) NOT NULL PRIMARY KEY,
    password varchar(50) NOT NULL
);

CREATE TABLE assistant
(
    username varchar(50) NOT NULL,
    assistant varchar(40) NOT NULL,
    description varchar(255) NOT NULL,
    lastModified datetime NOT NULL,
    PRIMARY KEY (username, assistant),
    FOREIGN KEY (username) REFERENCES userAuth (username) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE databaseConnection
(
    username varchar(50) NOT NULL,
    assistant varchar(40) NOT NULL,
    hostname varchar(100) NOT NULL,
    dbUsername varchar(100) NOT NULL,
    dbPassword varchar(50) NOT NULL,
    databaseName varchar(20) NOT NULL,
    PRIMARY KEY (username, assistant, databaseName),
    FOREIGN KEY (username, assistant) REFERENCES assistant (username, assistant) ON DELETE CASCADE ON UPDATE CASCADE
);


CREATE TABLE intent
(
    username varchar(50) NOT NULL,
    assistant varchar(40) NOT NULL,
    intent varchar(40) NOT NULL,
    description varchar(128) NOT NULL,
    previousIntent varchar(40),
    lastModified datetime NOT NULL,
    multipleReply varchar(20) NOT NULL,
    PRIMARY KEY (username, assistant, intent),
    FOREIGN KEY (username, assistant) REFERENCES assistant (username, assistant) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (username, assistant, previousIntent) REFERENCES intent(username, assistant, intent) ON DELETE CASCADE ON UPDATE CASCADE

);


CREATE TABLE messages
(
    username varchar(50) NOT NULL,
    assistant varchar(40) NOT NULL,
    intent varchar(40) NOT NULL,
    messageType varchar(20) NOT NULL,
    message varchar(500) NOT NULL,
    timeCreated datetime NOT NULL,
    PRIMARY KEY (username, assistant, intent, messageType, message),
    FOREIGN KEY (username, assistant, intent) REFERENCES intent (username, assistant, intent) ON DELETE CASCADE ON UPDATE CASCADE
)
;



create table queryTable
(
    username varchar(50) NOT NULL,
    assistant varchar(40) NOT NULL,
    intent varchar(40) NOT NULL,
    tableName varchar(40) ,
    columnName varchar(40) ,
    compareCondition varchar(40) ,
    compareValue varchar(40) ,
    logic varchar(40) ,
    selectedColumn varchar(40) ,
    distinctColumn varchar(40) ,
    FOREIGN KEY (username, assistant, intent) REFERENCES intent (username, assistant, intent) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE queries
(
    username varchar(50) NOT NULL,
    assistant varchar(40) NOT NULL,
    intent varchar(40) NOT NULL,
    query varchar(255) NOT NULL,
    PRIMARY KEY (username, assistant, intent, query),
    FOREIGN KEY (username, assistant, intent) REFERENCES queryTable(username, assistant, intent) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE entity
(
    username varchar(50) NOT NULL,
    assistant varchar(40) NOT NULL,
    intent varchar(40) NOT NULL,
    ipAddress varchar(30) ,
    entityName varchar(30) NOT NULL,
    entityType varchar(30) NOT NULL,
    entityValue varchar(30),
    UNIQUE
        uniqueEntity
(intent, entityName),
    PRIMARY KEY
(username, assistant, intent,entityName, ipAddress),
    FOREIGN KEY
(username, assistant, intent) REFERENCES intent
(username, assistant, intent) ON
DELETE CASCADE ON
UPDATE CASCADE
);


CREATE TABLE richResponsesChip
(
    username varchar(50) NOT NULL,
    assistant varchar(40) NOT NULL,
    intent varchar(40) NOT NULL,
    useQuery varchar(50) NOT NULL,
    chipValue varchar(50),
    PRIMARY KEY (username, assistant, intent,chipValue),
    FOREIGN KEY (username, assistant, intent) REFERENCES intent(username, assistant, intent) ON DELETE CASCADE ON UPDATE CASCADE
);


CREATE TABLE richResponseCard
(
    username varchar(50) NOT NULL,
    assistant varchar(40) NOT NULL,
    intent varchar(40) NOT NULL,
    useQuery varchar(50) NOT NULL,
    cardNo int,
    cardName varchar(255),
    cardValue varchar(500),
    lastModified datetime,
    PRIMARY KEY (username, assistant, intent,cardValue),
    FOREIGN KEY (username, assistant, intent) REFERENCES intent(username, assistant, intent) ON DELETE CASCADE ON UPDATE CASCADE
);


CREATE TABLE settings
(
    username varchar(50) NOT NULL,
    assistant varchar(40) NOT NULL,
    cardBgcolor varchar(15) NOT NULL,
    cardTextColor varchar(15) NOT NULL,
    cardBorder varchar(15) NOT NULL,
    cardFont varchar(40) NOT NULL,
    chipBgcolor varchar(15) NOT NULL,
    chipTextColor varchar(15) NOT NULL,
    chipBorder varchar(15) NOT NULL,
    chipShape varchar(15) NOT NULL,
    chipFont varchar(40) NOT NULL,
    userTextBgcolor varchar(15) NOT NULL,
    userFont varchar(40) NOT NULL,
    userTextColor varchar(15) NOT NULL,
    assistantTextBgcolor varchar(15) NOT NULL,
    assistantFont varchar(40) NOT NULL,
    assistantTextColor varchar(15) NOT NULL,
    chatboxColor varchar(15) NOT NULL,
    PRIMARY KEY (username, assistant),
    FOREIGN KEY (username, assistant) REFERENCES assistant(username, assistant) ON DELETE CASCADE ON UPDATE CASCADE
);



