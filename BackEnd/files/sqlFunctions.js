const connection = require('./connection');
const DataBaseConnection = require('./DBconnection');
const sqlFunctions2 = require('./sqlFunctions2');
const uuid = require('uuid-random');
const {
    response
} = require('express');

//------------------------------------------------Get Time For Last Modified.-------------------------------------------------------------------

function getTime() {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    const yyyy = today.getFullYear();
    const hour = today.getHours();
    const minute = today.getMinutes();
    const seconds = today.getSeconds()
    return yyyy + '-' + mm + '-' + dd + " " + hour + ':' + minute + ':' + seconds;
}


/* *************************************************************************************************************************************************** */
/* *************************************************************USER DETAILS ************************************************************************************ */
/* *************************************************************************************************************************************************** */

//------------------------------------------------------------Create User-----------------------------------------------------------------------

exports.createUser = (firstName, lastName, username, email, password) => {
    let sql = `Insert into userAuth values(?, ?, ?, ?, ?);`;
    connection.query(sql, [firstName, lastName, email, username, password], (err, results) => {
        if (err) return console.log(err);
        else {
            console.log("User has been created");
        }
    });
}
//----------------------------------------------------Check User Exists---------------------------------------------------------------------------

exports.userExists = async (username, email) => {
    let sql = 'Select * from userAuth where username=? or email=?;';
    return new Promise((resolve, reject) => {
        connection.query(sql, [username, email], (err, results) => {
            if (err) console.log(err);
            else if (results.length != 0) {
                let responseData = {
                    username: results[0].username,
                    password: results[0].password,
                    firstName: results[0].firstName,
                    lastName: results[0].lastName,
                    emailId: results[0].email
                }
                resolve(responseData);
            } else resolve(false)
        });
    });
}

exports.usernameExists = async (username) => {
    let sql = 'Select * from userAuth where username=?;';
    return new Promise((resolve, reject) => {
        connection.query(sql, [username], (err, results) => {
            if (err) console.log(err);
            else if (results.length != 0) {
                let responseData = {
                    username: results[0].username,
                    password: results[0].password,
                    email: results[0].email
                }
                resolve(responseData);
            } else resolve(false);
        });
    });
}

exports.emailExists = async (email) => {
    let sql = 'Select * from userAuth where email=?;';
    return new Promise((resolve, reject) => {
        connection.query(sql, [email], (err, results) => {
            if (err) console.log(err);
            else if (results.length != 0) {
                let responseData = {
                    username: results[0].username,
                    password: results[0].password,
                    email: results[0].email
                }
                resolve(responseData);
            } else resolve(false);
        });
    });
}

//------------------------------------------------------------Deactivate Account---------------------------------------------------------------------

exports.deactivateAccount = (username) => {
    // Delete user from table.
    let sql = "delete FROM userAuth where username=?";
    connection.query(sql, [username], (err, results) => {
        if (err) return console.log(err.message);
    });
}


/* *************************************************************************************************************************************************** */
/* *************************************************************ASSISTANT DETAILS ************************************************************************************ */
/* *************************************************************************************************************************************************** */

//------------------------------------------------------------Create Assistant---------------------------------------------------------------------

exports.createAssistant = (username, assistantName, description) => {

    let sql = `Insert into assistant values(?, ?, ?, ?);`;
    //Get assistant Id and Time

    let time = getTime();

    connection.query(sql, [username, assistantName, description, time], (err) => {
        if (err) console.log(err)
        else {
            console.log("CREATED ", assistantName);

            // Create Default settings for Assistant
            this.createDefaultSettings(username, assistantName);
        }

    });
};

//------------------------------------------------------------Get Existing Assistants-----------------------------------------------------------------------

exports.getExistingAssistants = (username) => {
    let sql = `select * from assistant where username =? order by last_modified desc;`;
    return new Promise((resolve, reject) => {
        connection.query(sql, [username], (err, results) => {
            if (err) console.log(err)
            else {
                let assistantsList = [];
                for (let i = 0; i < results.length; i++) {
                    let assistant = {
                        assistantName: results[i].assistant,
                        assistantDesc: results[i].description,
                    }
                    assistantsList.push(assistant);
                }

                const responseData = {
                    responseType: 'Success',
                    responseStatus: true,
                    existingAssistants: assistantsList,
                }
                resolve(responseData);
            }
        });
    });
};

//------------------------------------------------------------Check If Assistant Exists-----------------------------------------------------------------------

exports.doesAssistantExist = (username, assistantName) => {
    let sql = 'Select * from assistant where username=? and assistant like ?;';
    return new Promise((resolve, reject) => {
        connection.query(sql, [username, assistantName + "-%"], (err, results) => {
            if (err) console.log(err);
            else if (results.length != 0) {
                resolve(true);
            } else resolve(false);
        });
    });
}

//------------------------------------------------------------Update Assistant-----------------------------------------------------------------------

exports.updateAssistant = (username, assistantName, description, previousAssistantName) => {
    let time = getTime();
    let sql = 'update assistant set assistant=?, description=?, last_modified=? where assistant=? and username=?;'
    console.log(assistantName);
    connection.query(sql, [assistantName, description, time, previousAssistantName, username], (err) => {
        if (err) console.log(err);
        else console.log("Assistant name has been updated")
    })
}

//------------------------------------------------------------Delete Assistant-----------------------------------------------------------------------

exports.deleteAssistant = (username, assistantName) => {
    // Delete assistant from table.
    let sql = "delete FROM assistant where assistant=? and username=?;";
    connection.query(sql, [assistantName,username], (err, results) => {
        if (err) return console.log(err.message);
    });
}

/* *************************************************************************************************************************************************** */
/* *************************************************************INTENT DETAILS ************************************************************************************ */
/* *************************************************************************************************************************************************** */

//------------------------------------------------------------Create Intent-----------------------------------------------------------------------

exports.createIntent = (username, assistantName, previousIntent, intentName, intentDescription) => {
    let sql = `Insert into intent values(?, ?, ?, ?, ?, ?, ?);`;
    let time = getTime();
    connection.query(sql, [username, assistantName,  intentName, intentDescription, previousIntent, time, "false"], (err) => {
        if (err) console.log(err)
        else {
            console.log("Intent Created ", intentName);
        }
    });
};



//------------------------------------------------------------Get Intent Id-----------------------------------------------------------------------

exports.getIntentName = (intentName, assistantName) => {
    let sql = `select intent from intent where intent = ? and assistant=?;`;
    return new Promise((resolve, reject) => {
        connection.query(sql, [intentName, assistantName], (err, results) => {
            if (err) console.log(err)
            else {
                resolve(results[0].intent);
            }
        })
    })
}


//------------------------------------------------------------Get Existing Intents-----------------------------------------------------------------------

exports.getExistingIntents = (username, assistantName) => {
    let sql = `select * from intent where username=? and assistant = ? order by last_modified;`;
    return new Promise((resolve, reject) => {
        connection.query(sql, [username, assistantName], (err, results) => {
            if (err) console.log(err)
            else {
                console.log(results);
                let intentsList = [];
                for (let i = 0; i < results.length; i++) {
                    let intent = {
                        intentName: results[i].intent,
                        intentDesc: results[i].description
                    }
                    intentsList.push(intent);
                }

                const responseData = {
                    responseType: 'Success',
                    responseStatus: true,
                    existingIntents: intentsList,
                }
                resolve(responseData);
            }
        });
    });
};

//------------------------------------------------------------Check If Intent Exists-----------------------------------------------------------------------

exports.doesIntentExist = (username, assistantName, intentName) => {
    let sql = 'Select * from intent where username=? and assistant=? and intent=?;';
    return new Promise((resolve, reject) => {
        connection.query(sql, [username,assistantName, intentName], (err, results) => {
            if (err) console.log(err);
            else if (results.length != 0) {
                resolve(true);
            } else resolve(false);
        });
    });
}

//------------------------------------------------------------Get Intents Without Follow-----------------------------------------------------------------------

exports.getIntentsWithoutFollow = (username,assistantName) => {
    let sql = `select * from intent where username=? and assistant = ? and previousIntent="null" order by last_modified desc;`;
    return new Promise((resolve, reject) => {
        connection.query(sql, [username, assistantName], (err, results) => {
            if (err) console.log(err)
            else {
                let intentsList = [];
                for (let i = 0; i < results.length; i++) {
                    let intent = {
                        intentName: results[i].intent,
                        intentDesc: results[i].description,
                    }
                    intentsList.push(intent);
                }
                const responseData = {
                    responseType: 'Success',
                    responseStatus: true,
                    existingIntents: intentsList,
                }
                resolve(responseData);
            }
        });
    });
};

//--------------------------------------------------------Get Follow Intents--------------------------------------------------------------

exports.getFollowIntents = (username, assistantName, intentName) => {
    let sql = `select * from intent where previousIntent=? and username=? and assistant=? ;`;
    return new Promise((resolve, reject) => {
        connection.query(sql, [intentName,username,assistantName], (err, results) => {
            if (err) console.log(err)
            else {
                let intentsList = [];
                for (let i = 0; i < results.length; i++) {
                    let intent = {
                        intentName: results[i].intent,
                        intentDesc: results[i].description
                    }
                    intentsList.push(intent);
                }

                const responseData = {
                    responseType: 'Success',
                    responseStatus: true,
                    existingIntents: intentsList,
                }
                resolve(responseData);
            }
        });
    });
};


//-----------------------------------------------------------Check If Follow Up Intent Exists--------------------------------------------

exports.ifFollowUpExists = (username, assistantName, intentName) => {
    let sql = `select * from intent where username=? and assistant=? and previousIntent=?;`;
    return new Promise((resolve, reject) => {
        connection.query(sql, [username, assistantName, intentName], (err, results) => {
            if (err) console.log(err)
            else {
                if (results.length !== 0)
                    resolve(true);
                else
                    resolve(false);
            }
        });
    });
};

//------------------------------------------------------------Handle Multiple Reply-----------------------------------------------------------------------

exports.handleMultipleReply = (username, assistantName, intentName, multipleReply) => {
    let sql = 'update intent set multipleReply=? where username=? and assistant=? and intent=?;'
    connection.query(sql, [multipleReply,username, assistantName, intentName], (err,) => {
        if (err) console.log(err);
        else console.log("Multiple Reply has been updated")
    })
}

exports.checkMultipleReply = (username, assistantName, intentName) => {
    let sql = 'select * from intent where username=? and assistant=? and intent=?;'
    return new Promise((resolve, reject) => {
        connection.query(sql, [username, assistantName, intentName], (err, results) => {
            if (err) console.log(err);
            else if (results.length !== 0) {
                resolve(results[0].multipleReply);
            }
            else {
                resolve(false);
            }
        })
    });
}


//------------------------------------------------------------Update Intent-----------------------------------------------------------------------

exports.updateIntent = (username, assistantName, intentName, description, previousIntentName) => {
    let time = getTime();
    console.log("HELLLOOO", username, assistantName, intentName, description, previousIntentName)
    let sql = 'update intent set intent=?, description=?, last_modified=? where username=? and assistant=? and intent=?;'
    connection.query(sql, [intentName, description, time, username, assistantName, previousIntentName], (err) => {
        if (err) console.log(err);
        else console.log("Intent has been updated")
    })
}

//------------------------------------------------------------Delete Intent-----------------------------------------------------------------------

exports.deleteIntent = (username, assistantName, intentName) => {
    // Delete the specified intent.
    let sql = "delete from intent where username=? and assistant=? and intent = ? or previousIntent = ?;";
    connection.query(sql, [username, assistantName,intentName, intentName], (err, results) => {
        if (err) return console.log(err.message);
    });
}

/* *************************************************************************************************************************************************** */
/* *************************************************************MESSAGE DETAILS ************************************************************************************ */
/* *************************************************************************************************************************************************** */


//------------------------------------------------------------Create/Add Messages-----------------------------------------------------------------------

exports.addMessage = (username, assistantName, intentName, messageType, message) => {
    let sql = "insert into messages values(?, ?, ?, ?, ?, ?);";
    connection.query(sql, [username, assistantName, intentName, messageType, message, getTime()], (err) => {
        if (err) console.log(err)
        else console.log("Created Training Phrase ", message);
    });
}

//------------------------------------------------------------Get User or Assistant Message-----------------------------------------------------------------------

exports.getMessages = (username, assistantName,intentName, messageType) => {
    let sql = "select message from messages where username=? and assistant=? and intent=? and messageType=? order by timeCreated;";
    return new Promise((resolve, reject) => {
        connection.query(sql, [username, assistantName,intentName, messageType], (err, results) => {
            if (err) return console.log(err);
            else {
                let messages = [];
                console.log(results);
                for (let i = 0; i < results.length; i++) {
                    messages.push({
                        message: results[i].message,
                    });
                }
                resolve(messages);
            }
        })
    })
}

//------------------------------------------------------------Get All  Messages-----------------------------------------------------------------------

exports.getAllMessages = (username, assistantName,intentName) => {
    let sql = "select message, messageType from messages where username=? and assistant=? and intent=? order by timeCreated desc;";
    return new Promise((resolve, reject) => {
        connection.query(sql, [username, assistantName,intentName], (err, results) => {
            if (err) return console.log(err);
            else {
                let messages = [];
                for (let i = 0; i < results.length; i++) {
                    messages.push({
                        message: results[i].message,
                        messageType: results[i].messageType,
                    });
                    console.log(results[i].message);
                }
                resolve(messages);
            }
        })
    })
}

//------------------------------------------------------------Update Messages-----------------------------------------------------------------------

exports.updateMessage = (username, assistantName,intentName, messageType, message,previousMessage) => {
    let sql = 'update messages set message=? where username=? and assistant=?and intent=? and messageType=? and message=?;'
    connection.query(sql, [message, username, assistantName,intentName,messageType, previousMessage], (err) => {
        if (err) console.log(err);
        else console.log("Message has been updated")
    })
}


//------------------------------------------------------------Delete Messages-----------------------------------------------------------------------

exports.deleteMessage = (username, assistantName, intentName, messageType, message) => {
    console.log(username,message,messageType,assistantName,intentName)
    let sql = "delete from messages where username=? and assistant=? and intent=? and messageType=? and message = ?;";
    connection.query(sql, [username, assistantName,intentName, messageType, message], (err, results) => {
        if (err) return console.log(err.message);
    });
}

/* *************************************************************************************************************************************************** */
/* *************************************************************CARD DETAILS ************************************************************************************ */
/* *************************************************************************************************************************************************** */

//------------------------------------------------------------Create Card-----------------------------------------------------------------------

exports.insertCreateCard = (username, assistantName, intentName, useQuery, cardNo, cardName, cardValue) => {
    let time = getTime();
    let cardValues = [];
    for (let i = 0; i < cardName.length; i++) {
        try {
            cardValues.push(JSON.parse(cardValue)[cardName[i]]);
        } catch {
            cardValues.push(cardValue[i]);
        }
    }
    let sql = "insert into richResponseCard values(?, ?, ?, ?, ?, ?, ?, ?);";
    connection.query(sql, [username, assistantName, intentName, useQuery, cardNo, JSON.stringify(cardName), JSON.stringify(cardValues),time], (err) => {
        if (err) console.log(err)
        else console.log("Inserted Card ");
    });
}


// //------------------------------------------------------------Get Query Cards-----------------------------------------------------------------------

exports.getQueryCards = (username, assistantName,intentName) => {
    let sql = 'select * from richResponseCard where username=? and assistant=?  and intent=? and useQuery="true" order by lastModified;';
    return new Promise((resolve, reject) => {
        connection.query(sql, [username, assistantName,intentName], async (err, results) => {
            if (err) console.log(err)
            else {
                let existingCards = [];
                for(let i = 0; i < results.length; i++){
                    let tempExistingCards = {
                        username: results[i].username,
                        assistant: results[i].assistant,
                        intent: results[i].intent,
                        useQuery: results[i].useQuery,
                        cardNo: results[i].cardNo,
                        cardName: JSON.parse(results[i].cardName),
                        cardValue: JSON.parse(results[i].cardValue),
                        lastModifed:results[i].lastModified
                    }
                    existingCards.push(tempExistingCards);
                }
                resolve(existingCards);
            }
        });
    });
}

// //------------------------------------------------------------Get All Query Cards-----------------------------------------------------------------------

// exports.getCardValues = async (username, assistantName,intentName) => {
//     let sql = 'select * from richresponses';
//     return new Promise(resolve => {
//         connection.query(sql, [username, assistantName,intentName], (err, results) => {
//             if (err) console.log(err)
//             else {
//                 resolve(results);
//             }
//         })
//     });
// }

//------------------------------------------------------------Get Cards Without Queries-----------------------------------------------------------------------

exports.getCards = (username, assistantName,intentName) => {
    let sql = 'select * from richResponseCard where username=? and assistant=?  and intent=? order by lastModified;';
    return new Promise((resolve, reject) => {
        connection.query(sql, [username, assistantName,intentName], async (err, results) => {
            if (err) console.log(err)
            else {
                console.log(results);
                let existingCards = [];
                for(let i = 0; i < results.length; i++){
                    let tempExistingCards = {
                        username: results[i].username,
                        assistant: results[i].assistant,
                        intent: results[i].intent,
                        useQuery: results[i].useQuery,
                        cardNo: results[i].cardNo,
                        cardName: JSON.parse(results[i].cardName),
                        cardValue: JSON.parse(results[i].cardValue),
                        lastModifed:results[i].lastModified
                    }
                    existingCards.push(tempExistingCards);
                }
                console.log("ESSSS",existingCards);
                resolve(existingCards);
            }
        });
    });
}

//------------------------------------------------------------Update Card-----------------------------------------------------------------------

exports.updateCard = (cardName, cardValue, richResponseId) => {
    console.log(cardName, cardValue, richResponseId);
    for (let i = 0; i < cardName.length; i++) {
        let sql = 'update richresponses set cardValue=? where CardName=? and richResponseID=?';
        connection.query(sql, [cardValue[i], cardName[i], richResponseId], (err, results) => {
            if (err) return console.log(err.message);
            else console.log("updated Card");
        });
    }
}
//------------------------------------------------------------Delete Card-----------------------------------------------------------------------

exports.deleteCard = (username,assistantName,intentName,cardValue) => {
    let sql = 'delete from richResponseCard where username=? and assistant=? and intent=? and cardValue=?;';
    connection.query(sql, [username,assistantName,intentName,cardValue], (err, results) => {
        if (err) return console.log(err.message);
        else console.log("Deleted Card");
    });
}

/* *************************************************************************************************************************************************** */
/* *************************************************************SETTINGS************************************************************************************ */
/* *************************************************************************************************************************************************** */

//------------------------------------------------------------Create Default Settings-----------------------------------------------------------------------

exports.createDefaultSettings = (username, assistantName) => {
    //  let sql = `Insert into intent values(?, ?, "card bg", "cardtxt", "cardbord", "card text font", "chip bg", "chip text", "chip border", "chip shape", "chip text font", "userbg", "user text font",  "usertxtcolor","bot bg", "bot text font ", "bot text color", "box color");`;
    let sql = 'insert into settings values(?, ?, "#a2a399", "#ffffff", "#523c3c", "verdana", "#4bd9de",  "#064a04", "#4249db", "12", "verdana", "#4278db", "verdana", "#ffffff", "#5d2ad4", "verdana", "#000000", "#06badf");';
    connection.query(sql, [username, assistantName], (err) => {
        if (err) console.log(err)
        else {
            console.log("Settings Added");
        }
    });
};

//------------------------------------------------------------Get Chatbox Settings-----------------------------------------------------------------------

exports.getChatboxSettings = (username, assistantName) => {
    let sql = "select * from settings where assistant=? and username=?;";
    return new Promise((resolve, reject) => {
        connection.query(sql, [assistantName,username], (err, results) => {
            if (err) console.log(err)
            else if (results.length != 0) {
                let chatBoxSettings = {
                    cardTheme: {
                        cardBgColor: results[0].cardBgcolor,
                        cardTextColor: results[0].cardTextColor,
                        cardBorder: results[0].cardBorder,
                        cardFont: results[0].cardFont,
                    },
                    chipTheme: {
                        chipBgColor: results[0].chipBgcolor,
                        chipTextColor: results[0].chipTextColor,
                        chipBorder: results[0].chipBorder,
                        chipShape: results[0].chipShape,
                        chipFont: results[0].chipFont,
                    },
                    chatBoxTheme: {
                        userBg: results[0].userTextBgcolor,
                        userFont: results[0].userFont,
                        userColor: results[0].userTextColor,
                        assistantBg: results[0].assistantTextBgcolor,
                        assistantFont: results[0].assistantFont,
                        assistantColor: results[0].assistantTextColor,
                        chatBoxColor: results[0].chatboxColor,
                    }
                };
                resolve({ chatBoxSettings });
            } else {
                resolve();
            }
        })
    })
}

exports.setChatboxSettings = (username,assistantName, settings) => {

    let sql = "update settings set cardBgcolor=?, cardTextColor=?, cardBorder=?, cardFont=?, chipBgcolor=?, chipTextColor=?, chipBorder=?, chipShape=?, chipFont=?, userTextBgcolor=?, userFont=?, userTextColor=?, assistantTextBgcolor =?, assistantFont =?, assistantTextColor=?, chatboxColor =? where assistant=? and username=?; ";
    let { chipTheme, chatBoxTheme, cardTheme } = JSON.parse(settings);
    let { userBg, userColor, userFont, assistantBg, assistantColor, assistantFont, chatBoxColor } = chatBoxTheme;
    let { cardBgColor, cardTextColor, cardBorder, cardFont, } = cardTheme;
    let { chipBgColor, chipTextColor, chipBorder, chipShape, chipFont } = chipTheme;
    return new Promise((resolve, reject) => {
        connection.query(sql,
            [cardBgColor, cardTextColor,
                cardBorder, cardFont, chipBgColor, chipTextColor, chipBorder, chipShape,
                chipFont, userBg, userFont, userColor, assistantBg,
                assistantFont, assistantColor, chatBoxColor, assistantName,username], (err, results) => {
                    console.log("Inside query");
                    if (err) console.log(err)
                    else {
                        resolve(true);
                    }
                })
    })
}
//------------------------------------------------------------Update Card Theme-----------------------------------------------------------------------

exports.updateCardTheme = (assistantName, cardColor, textColor) => {
    let sql = 'update settings set card_bgcolor=?, card_text_color=? where assistant=?;'
    connection.query(sql, [cardColor, textColor, assistantName], (err) => {
        if (err) console.log(err);
        else console.log("Card Theme has been updated")
    })
}

//------------------------------------------------------------Get Card Theme-----------------------------------------------------------------------

exports.getCardTheme = (assistantName) => {
    let sql = "select card_bgcolor, card_text_color from settings where assistant=?;";
    return new Promise((resolve, reject) => {
        connection.query(sql, [assistantName], (err, results) => {
            if (err) console.log(err)
            else {
                resolve({
                    cardColor: results[0].card_bgcolor,
                    textColor: results[0].card_text_color,
                });
            }
        })
    })
}


/* *************************************************************************************************************************************************** */
/* *************************************************************CHIP DETAILS ************************************************************************************ */
/* *************************************************************************************************************************************************** */


//------------------------------------------------------------Create Chip-----------------------------------------------------------------------

exports.insertCreateChip = (username, assistantName, intentName, usingQueries, chipValue) => {
    let sql = "insert into richresponsesChip values(?, ?, ?, ?, ?);";
    connection.query(sql, [username, assistantName, intentName, usingQueries, chipValue], (err) => {
        if (err) console.log(err)
        else console.log("Inserted Chip ");
    });
}

//------------------------------------------------------------Get All Chips without Query-----------------------------------------------------------------------

exports.getChips = (username, assistantName,intentName) => {
    let sql = 'select chipValue from richresponsesChip where username=? and assistant=? and intent = ? and useQuery="false" and chipValue!="null"; ';
    return new Promise((resolve, reject) => {
        connection.query(sql, [username, assistantName,intentName], (err, results) => {
            if (err) console.log(err)
            else {
                resolve(results);
            }
        });
    });
}

//------------------------------------------------------------Get Query Chips-----------------------------------------------------------------------

exports.getQueryChips = (username, assistantName, intentName) => {
    let sql = 'select * from richresponsesChip where username=? and assistant=? and intent = ? and useQuery="true"; ';
    return new Promise((resolve, reject) => {
        connection.query(sql, [username, assistantName, intentName], (err, results) => {
            if (err) console.log(err)
            else {
                resolve(results);
            }
        });
    });
}

//------------------------------------------------------------Get All Chips-----------------------------------------------------------------------

exports.getAllChips = (username, assistantName, intentName) => {
    let sql = 'select * from richresponsesChip where username=? and assistant=? and intent = ? and chipValue != "null";';
    return new Promise((resolve, reject) => {
        connection.query(sql, [username, assistantName, intentName], (err, results) => {
            if (err) console.log(err)
            else {
                console.log("Chips are ", results);
                resolve(results);
            }
        });
    });
}

//------------------------------------------------------------Update Chip-----------------------------------------------------------------------

exports.updateChip = (username,assistantName,intentName,chipValue,previousChipValue) => {
    let sql = 'update richresponsesChip set chipValue=? where username=? and assistant=? and intent=? and chipValue=?;'
    connection.query(sql, [chipValue, username,assistantName,intentName,previousChipValue], (err) => {
        if (err) console.log(err);
        else console.log("response has been updated")
    })
}


//------------------------------------------------------------Delete Chip-----------------------------------------------------------------------

exports.deleteChip = (username,assistantName,intentName,chipValue) => {
    let sql = 'delete from richresponsesChip where username = ? and assistant = ? and intent = ? and chipValue=?;';
    connection.query(sql, [username,assistantName,intentName,chipValue], (err, results) => {
        if (err) return console.log(err.message);
        else console.log("Deleted Chip");
    });
}


/* *************************************************************************************************************************************************** */
/* *************************************************************DATABASE CONNECTION DETAILS ************************************************************************************ */
/* *************************************************************************************************************************************************** */


//------------------------------------------------------------Store Database Details-----------------------------------------------------------------------

exports.addDatabaseDetails = (username, assistantName,hostname, dbUsername, password, databaseName) => {
    let sql = 'insert into databaseConnection values(?, ?, ?, ?, ?, ?);';
    connection.query(sql, [username, assistantName,hostname, dbUsername, password, databaseName], (err) => {
        if (err) return console.log(err);
        else {
            console.log("Database Details have been added");
        }
    })
}

/* *************************************************************************************************************************************************** */
/* *************************************************************QUERY DETAILS DETAILS ************************************************************************************ */
/* *************************************************************************************************************************************************** */


//----------------------------------------------------Get Column Names of Users Database-----------------------------------------------------------------------

exports.getColumnNames = async(username, assistantName, tableName) => {
    let sql = 'select column_name from information_schema.columns where table_name=?;';
    let databaseDetails = await sqlFunctions2.getDatabaseDetails(username, assistantName);
    let { hostname, dbUsername, password, databaseName } = databaseDetails;
    let DBconnection = await DataBaseConnection.DataBaseConnection(hostname, dbUsername, password, databaseName);
    return new Promise(resolve => {
        DBconnection.query(sql, [tableName], (err, results) => {
            if (err) console.log(err);
            else {
                resolve(results);
            }
        })
    })
}

//------------------------------------------------------------Add Query Details-----------------------------------------------------------------------

exports.addQueryDetails = (rows, selectedColumns, distinctColumn, username, assistantName, intentName, tableName) => {
    this.deleteExistingQuery(username,assistantName,intentName);
    let sql;
    if (rows) {
        for (let i = 0; i < rows.length; i++) {
            let {
                selectedColumn,
                selectedOperator,
                compareValue,
                logic
            } = JSON.parse(rows[i]);
            console.log(selectedColumn, selectedOperator, compareValue, logic)
            sql = 'insert into queryTable (username, assistant, intent, tableName, columnName, compareCondition, compareValue, logic) values(?, ?, ?, ?, ?, ?, ?, ?)';
            connection.query(sql, [username, assistantName, intentName, tableName, selectedColumn, selectedOperator, compareValue, logic], (err) => {
                if (err) console.log(err);
            })
        }
    }
    for (let i = 0; i < selectedColumns.length; i++) {
        sql = 'insert into queryTable(username, assistant, intent, tableName, selectedColumn) values(?, ?, ?, ?, ?);';
        connection.query(sql, [username, assistantName, intentName, tableName, selectedColumns[i]], (err) => {
            if (err) console.log(err);
        })
    }
    if (distinctColumn) {
        sql = 'insert into queryTable(username, assistant, intent, tableName, distinctColumn) values(?, ?, ?, ?, ?);';
        connection.query(sql, [username, assistantName, intentName, tableName, distinctColumn], (err) => {
            if (err) console.log(err);
        })
    }
}

//------------------------------------------------------------Create Query-----------------------------------------------------------------------

exports.addQuery = (username, assistantName, intentName, query) => {
    let sql = "insert into queries values(?, ?, ?, ?);";
    connection.query(sql, [username, assistantName, intentName, query], (err) => {
        if (err) console.log(err);
    })
}


//------------------------------------------------------------Get Table Name-----------------------------------------------------------------------

exports.getTableName = (username, assistantName,intentName) => {
    let sql = "select tableName from queryTable where username=? and assistant=? and intent=? group by intent;";
    return new Promise(resolve => {
        connection.query(sql, [username, assistantName,intentName], (err, results) => {
            if (err) console.log(err);
            else if (results.length != 0) {
                resolve(results[0].tableName);
            } else {
                resolve(undefined);
            }
        })
    })
}

//------------------------------------------------------------Get Query Rows-----------------------------------------------------------------------
exports.getQueryRows = (username, assistantName, intentName) => {
    let sql = 'select * from queryTable where username=? and assistant=? and intent=? and selectedColumn is not null;';
    return new Promise(resolve => {
        connection.query(sql, [username,assistantName,intentName], (err, results) => {
            if (err) console.log(err);
            else {
                let queryRows = [];
                console.log("ASESCEVRVWS",results);
                for (let i = 0; i < results.length; i++) {
                    if (results[i].column_name != null) {
                        let queryRow = {
                            id: i + 1,
                            selectedColumn: results[i].column_name,
                            selectedOperator: results[i].compare_condition,
                            compareValue: results[i].compare_value,
                            logic: results[i].logic
                        }
                        queryRows.push(queryRow);
                    }
                }
                resolve(queryRows);
            }
        })
    });
}

//------------------------------------------------------------Get Selected Columns-----------------------------------------------------------------------

exports.getSelectedColumns = (username, assistantName,intentName) => {
    let sql = 'select * from queryTable where username=? and assistant=? and intent =? and selectedColumn is not null;';
    return new Promise(resolve => {
        connection.query(sql, [username, assistantName,intentName], (err, results) => {
            if (err) console.log(err);
            else {
                let selectedColumns = [];
                for (let i = 0; i < results.length; i++) {
                    selectedColumns.push(results[i].selected_column);
                }
                resolve(selectedColumns);
            }
        })
    })
}

//------------------------------------------------------------Get Distinct Columns-----------------------------------------------------------------------

exports.getDistinctColumn = (username, assistantName,intentName) => {
    let sql = 'select * from queryTable where username=? and assistant=? and intent =? and distinctColumn != "null";';
    return new Promise(resolve => {
        connection.query(sql, [username, assistantName,intentName], (err, results) => {
            if (err) console.log(err);
            else if (results.length != 0) {
                resolve(results[0].distinct_column);
            } else {
                resolve(undefined);
            }
        })
    })
}

//------------------------------------------------------------Get Query Details-----------------------------------------------------------------------

exports.getQueryDetails = async (username, assistantName,intentName) => {

    return new Promise(async (resolve) => {
        // Table name
        let tableName = await this.getTableName(username, assistantName,intentName);
        // Query Rows ( Condition )
        let queryRows = await this.getQueryRows(username, assistantName,intentName);
        // Selected Columns
        let selectedColumns = await this.getSelectedColumns(username, assistantName,intentName);
        // Distinct Column
        let distinctColumn = await this.getDistinctColumn(username, assistantName,intentName);
        resolve({
            tableName,
            queryRows,
            selectedColumns,
            distinctColumn
        });
    })


}

//------------------------------------------------------------Delete Query-----------------------------------------------------------------------

exports.deleteExistingQuery = (username,assistantName, intentName) => {
    let sql = "delete from queryTable where username=? and assistant=? and intent=?;";
    connection.query(sql, [username,assistantName,intentName], (err) => {
        if (err) console.log(err);
    })

    // sql = "delete from queries where intent=?;";
    // connection.query(sql, [intentName], (err) => {
    //     if (err) console.log(err);
    // })
}


/* *************************************************************************************************************************************************** */
/* ***************************************************************ENTITY************************************************************************************ */
/* *************************************************************************************************************************************************** */

//------------------------------------------------------------Create Entity-----------------------------------------------------------------------

exports.createEntity = async (username, assistantName, intentName, selectedColumns, entityNames) => {
    let ipAddress = "172.19.12.1";
    for (let i = 0; i < selectedColumns.length; i++) {
        let entityName = JSON.parse(entityNames)[selectedColumns[i]];
        let sql = "insert into entity values(?,?,?,?,?,?,'NULL');";
        connection.query(sql, [username, assistantName, intentName,ipAddress, entityName, selectedColumns[i].toLowerCase()], (err, results) => {
            if (err) console.log(err);
            else {
                console.log("entityId");
            }
        })
    }
}

//------------------------------------------------------------Add Entity Value(Do in Save Conversation)-----------------------------------------------------------------------

exports.entityValue = (username, assistantName, intentName, existingEntities, sendMessage) => {
    console.log(username, assistantName, intentName, existingEntities, sendMessage)
    let sql = 'select * from entity where username=? and assistant=? and intent=?';
    return new Promise(resolve => {
        connection.query(sql, [username, assistantName,intentName], async (err, results) => {
            if (err) console.log(err)
            else {
                console.log(results);
                for (let i = 0; i < results.length; i++) {
                    if (results[i].entityType === "name" || results[i].entityType === "other")
                        existingEntities.push(results[i].entityType);
                }
                let value;
                for (let i = 0; i < existingEntities.length; i++) {
                    if (existingEntities[i] === "name") {
                        value = sendMessage;
                        entityName = "name";
                    } else if (existingEntities[i] === "other") {
                        value = sendMessage;
                        entityName = "other";
                    }
                    else {
                        value = existingEntities[i].sourceText;
                        entityName = existingEntities[i].entity;
                    }
                    await this.updateEntityValue(username,assistantName, entityName, intentName, value);
                }
                resolve("true");
            }
        })
    })
}


//------------------------------------------------------------Get Entities-----------------------------------------------------------------------


exports.getEntities = (username, assistantName, intentName) => {
    console.log(intentName);
    let sql = 'select * from entity where username=? and assistant=? and intent=? ';
    return new Promise(resolve => {
        connection.query(sql, [username, assistantName, intentName], (err, results) => {
            if (err) console.log(err);
            else {
                resolve(results);
            }
        })
    })
}

//------------------------------------------------------------Update Entity-----------------------------------------------------------------------

exports.updateEntityValue = (username, assistantName, entityName, intentName, value) => {
    console.log(intentName, entityName, value);
    let sql = 'update entity set entityValue=? where username=? and assistant=? and intent=? and entityType=?';
    return new Promise(resolve => {
        connection.query(sql, [value,username, assistantName, intentName, entityName.toLowerCase()], (err2) => {
            if (err2) console.log(err2);
            else {
                resolve("Success");
            }
        })
    })
}


//------------------------------------------------------------Delete Entity-----------------------------------------------------------------------

exports.deleteEntity = (username, assistantName, intentName) => {
    let sql = 'delete from entity where username=? and assistant=? and intent=? and entityName=?';
    return new Promise(resolve => {
        connection.query(sql, [username, assistantName, intentName, entityName.toLowerCase()], (err2) => {
            if (err2) console.log(err2);
            else {
                resolve("Success");
            }
        })
    })

}