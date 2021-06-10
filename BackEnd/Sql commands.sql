CREATE DATABASE chatbotAPI;
USE chatbotAPI;


CREATE TABLE userAuth(
    firstName varchar(50)  NOT NULL,
    lastName  varchar(50)  NOT NULL,
    email     varchar(30)  NOT NULL,
    username  varchar(50) NOT NULL PRIMARY KEY,
    password  varchar(50)  NOT NULL
);

CREATE TABLE assistant
(
    username      varchar(50) NOT NULL,
    assistant     varchar(40)  NOT NULL,
    description   varchar(255) NOT NULL,
    last_modified datetime     NOT NULL,
    PRIMARY KEY (username, assistant),
    FOREIGN KEY (username) REFERENCES userAuth (username)
);

CREATE TABLE databaseConnection
(
    assistant    varchar(40)  NOT NULL,
	hostName     varchar(100) NOT NULL,
    dbUsername     varchar(100) NOT NULL,
    dbPassword     varchar(50)  NOT NULL,
    databaseName varchar(20)  NOT NULL,
    PRIMARY KEY (username, assistant, databaseName),
    FOREIGN KEY (username, assistant) REFERENCES assistant (username, assistant)

);


CREATE TABLE intent
(
    username       varchar(50) NOT NULL,
    assistant      varchar(40)  NOT NULL,
    intent         varchar(40)  NOT NULL,
    description    varchar(128) NOT NULL,
    previousIntent varchar(40)  NOT NULL,
    last_modified  datetime     NOT NULL,
    PRIMARY KEY (username, assistant, intent),
    FOREIGN KEY (username, assistant) REFERENCES assistant (username, assistant)

);


CREATE TABLE messages
(
    username    varchar(50) NOT NULL,
    assistant   varchar(40)  NOT NULL,
    intent      varchar(40)  NOT NULL,
    messageType varchar(20)  NOT NULL,
    message     varchar(500) NOT NULL,
    timeCreated datetime     NOT NULL,
    PRIMARY KEY (username, assistant, intent, messageType, message),
    FOREIGN KEY (username, assistant, intent) REFERENCES intent (username, assistant, intent)
)
;

CREATE TABLE queries
(
    username  varchar(50) NOT NULL,
    assistant varchar(40)  NOT NULL,
    intent    varchar(40)  NOT NULL,
    query     varchar(255) NOT NULL,
    PRIMARY KEY (username, assistant, intent, query),
    FOREIGN KEY (username, assistant, intent) REFERENCES messages (username, assistant, intent)


);

create table queryTable
(
    username         varchar(50) NOT NULL,
    assistant        varchar(40)  NOT NULL,
    intent           varchar(40)  NOT NULL,
    tableName        varchar(40)  NOT NULL,
    columnName       varchar(40)  NOT NULL,
    compareCondition varchar(40)  NOT NULL,
    compareValue     varchar(40)  NOT NULL,
    logic            varchar(40)  NOT NULL,
    selectedColumn   varchar(40)  NOT NULL,
    distinctColumn   varchar(40)  NOT NULL,
    PRIMARY KEY (username, assistant, intent),
    FOREIGN KEY (username, assistant, intent) REFERENCES queries (username, assistant, intent)
);

CREATE TABLE entity
(
    username    varchar(50) NOT NULL,
    assistant   varchar(40)  NOT NULL,
    intent      varchar(40)  NOT NULL,
    entityName  varchar(30)  NOT NULL,
    entityType  varchar(30)  NOT NULL,
    entityValue varchar(30)  NOT NULL,
    UNIQUE
        uniqueEntity
        (intent, entityName),
    PRIMARY KEY (username, assistant, intent),
    FOREIGN KEY (username, assistant, intent) REFERENCES queryTable (username, assistant, intent)


);


CREATE TABLE richResponses
(
    username       varchar(50) NOT NULL,
    assistant      varchar(40)  NOT NULL,
    intent         varchar(40)  NOT NULL,
    richResponseID varchar(40)  NOT NULL,
    useQuery       varchar(50)  NOT NULL,
    cardNo         int          NOT NULL,
    CardName       varchar(50)  NOT NULL,
    cardValue      varchar(50)  NOT NULL,
    chipValue      varchar(50)  NOT NULL,
    PRIMARY KEY (username, assistant, intent),
    FOREIGN KEY (username, assistant, intent) REFERENCES entity (username, assistant, intent)

);

CREATE TABLE settings
(
    username             varchar(50) NOT NULL,
    assistant            varchar(40)  NOT NULL,
    cardBgcolor          varchar(15)  NOT NULL,
    cardTextColor        varchar(15)  NOT NULL,
    cardBorder           varchar(15)  NOT NULL,
    cardFont             varchar(40)  NOT NULL,
    chipBgcolor          varchar(15)  NOT NULL,
    chipTextColor        varchar(15)  NOT NULL,
    chipBorder           varchar(15)  NOT NULL,
    chipShape            varchar(15)  NOT NULL,
    chipFont             varchar(40)  NOT NULL,
    userTextBgcolor      varchar(15)  NOT NULL,
    userFont             varchar(40)  NOT NULL,
    userTextColor        varchar(15)  NOT NULL,
    assistantTextBgcolor varchar(15)  NOT NULL,
    assistantFont        varchar(40)  NOT NULL,
    assistantTextColor   varchar(15)  NOT NULL,
    chatboxColor         varchar(15)  NOT NULL,
    PRIMARY KEY (username, assistant),
    FOREIGN KEY (username, assistant) REFERENCES richResponses (username, assistant)

);