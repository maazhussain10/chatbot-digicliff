const connection = require('./connection');
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
    let id = uuid();
    let sql = `Insert into user_auth values(?, ?, ?, ?, ?, ?);`;
    connection.query(sql, [id, firstName, lastName, email, username, password], (err, results) => {
        if (err) return console.log(err);
        else {
            console.log("User has been created");
        }
    });
}
//----------------------------------------------------Check User Exists---------------------------------------------------------------------------

exports.userExists = async (username, email) => {
    let sql = 'Select * from user_auth where username=? or user_email=?;';
    return new Promise((resolve, reject) => {
        connection.query(sql, [username, email], (err, results) => {
            if (err) console.log(err);
            else if (results.length != 0) {
                let responseData = {
                    userId: results[0].user_id,
                    username: results[0].username,
                    password: results[0].user_pass,
                    firstName: results[0].user_firstname,
                    lastName: results[0].user_lastname,
                    emailId: results[0].user_email
                }
                resolve(responseData);
            } else resolve(false)
        });
    });
}

exports.usernameExists = async (username) => {
    let sql = 'Select * from user_auth where username=?;';
    return new Promise((resolve, reject) => {
        connection.query(sql, [username], (err, results) => {
            if (err) console.log(err);
            else if (results.length != 0) {
                let responseData = {
                    userId: results[0].user_id,
                    username: results[0].username,
                    password: results[0].user_pass,
                    email: results[0].user_email
                }
                resolve(responseData);
            } else resolve(false);
        });
    });
}

exports.emailExists = async (email) => {
    let sql = 'Select * from user_auth where user_email=?;';
    return new Promise((resolve, reject) => {
        connection.query(sql, [email], (err, results) => {
            if (err) console.log(err);
            else if (results.length != 0) {
                let responseData = {
                    userId: results[0].user_id,
                    username: results[0].username,
                    password: results[0].user_pass,
                    email: results[0].user_email
                }
                resolve(responseData);
            } else resolve(false);
        });
    });
}

//------------------------------------------------------------Deactivate Account---------------------------------------------------------------------

exports.deactivateAccount = (userId) => {
    // Delete user from table.
    let sql = "delete FROM user_auth where user_id=?";
    connection.query(sql, [userId], (err, results) => {
        if (err) return console.log(err.message);
    });
    // Delete assistant from table.
    sql = "delete FROM assistant where user_id=?";
    connection.query(sql, [userId], (err, results) => {
        if (err) return console.log(err.message);
    });
    // Delete all intents related to the specified assistant.
    sql = "delete from intent where user_id = ?;";
    connection.query(sql, [userId], (err, results) => {
        if (err) return console.log(err.message);
    });
    // Delete all training phrases and responses related to the specified assistant.
    sql = "delete from messages where user_id = ?;";
    connection.query(sql, [userId], (err, results) => {
        if (err) return console.log(err.message);
    });

    // Delete all rich responses related to the specified assistant.
    sql = "delete from richresponses where user_id = ?;";
    connection.query(sql, [userId], (err, results) => {
        if (err) return console.log(err.message);
    });

    // Delete all queries related to the specified assistant.
    sql = "delete from queries where user_id =?";
    connection.query(sql, [userId], (err, results) => {
        if (err) return console.log(err.message);
    });

    // Delete all Query Table related to the specified assistant.
    sql = "delete from query_table where user_id =?";
    connection.query(sql, [userId], (err, results) => {
        if (err) return console.log(err.message);
    });

    // Delete all Database Connections related to the specified assistant.
    sql = "delete from database_connection where user_id =?";
    connection.query(sql, [userId], (err, results) => {
        if (err) return console.log(err.message);
    });

    // Delete all entities related to the specified assistant.
    sql = "delete from entity where user_id =?";
    connection.query(sql, [userId], (err, results) => {
        if (err) return console.log(err.message);
    });

}
/* *************************************************************************************************************************************************** */
/* *************************************************************ASSISTANT DETAILS ************************************************************************************ */
/* *************************************************************************************************************************************************** */

//------------------------------------------------------------Create Assistant---------------------------------------------------------------------

exports.createAssistant = (userId, assistantName, description) => {

    let sql = `Insert into assistant values(?, ?, ?, ?, ?);`;
    let assistantId = uuid();
    let time = getTime();
    connection.query(sql, [assistantId, userId, assistantName + '-' + assistantId.slice(0, 4), description, time], (err) => {
        if (err) console.log(err)
        else {
            console.log("CREATED ", assistantName);
            // Create Default settings for Assistant
            this.createDefaultSettings(userId, assistantId);
        }

    });
};

//------------------------------------------------------------Get Assistant Id-----------------------------------------------------------------------

exports.getAssistantId = (assistantName) => {
    let sql = `select assistant_id from assistant where assistant = ?;`;
    return new Promise((resolve, reject) => {
        connection.query(sql, [assistantName], (err, results) => {
            if (err) console.log(err)
            else {
                resolve(results[0].assistant_id);
            }
        })
    })

}

//------------------------------------------------------------Get Existing Assistants-----------------------------------------------------------------------

exports.getExistingAssistants = (userId) => {
    let sql = `select * from assistant where user_id =? order by last_modified desc;`;
    return new Promise((resolve, reject) => {
        connection.query(sql, [userId], (err, results) => {
            if (err) console.log(err)
            else {
                let assistantsList = [];
                for (let i = 0; i < results.length; i++) {
                    let assistant = {
                        assistantName: results[i].assistant,
                        assistantId: results[i].assistant_id,
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

exports.doesAssistantExist = (userId, assistantName) => {
    let sql = 'Select * from assistant where user_id=? and assistant like ?;';
    return new Promise((resolve, reject) => {
        connection.query(sql, [userId, assistantName + "-%"], (err, results) => {
            if (err) console.log(err);
            else if (results.length != 0) {
                resolve(true);
            } else resolve(false);
        });
    });
}

//------------------------------------------------------------Update Assistant-----------------------------------------------------------------------

exports.updateAssistant = (assistantName, description, assistantId) => {
    let time = getTime();
    let sql = 'update assistant set assistant=?, description=?, last_modified=? where assistant_id=?;'
    console.log(assistantName);
    connection.query(sql, [assistantName, description, time, assistantId], (err) => {
        if (err) console.log(err);
        else console.log("Assistant name has been updated")
    })
}

//------------------------------------------------------------Delete Assistant-----------------------------------------------------------------------

exports.deleteAssistant = (assistantId) => {
    // Delete assistant from table.
    let sql = "delete FROM assistant where assistant_id=?";
    connection.query(sql, [assistantId], (err, results) => {
        if (err) return console.log(err.message);
    });
    // Delete all intents related to the specified assistant.
    sql = "delete from intent where assistant_id = ?;";
    connection.query(sql, [assistantId], (err, results) => {
        if (err) return console.log(err.message);
    });
    // Delete all training phrases and responses related to the specified assistant.
    sql = "delete from messages where assistant_id = ?;";
    connection.query(sql, [assistantId], (err, results) => {
        if (err) return console.log(err.message);
    });

    // Delete all rich responses related to the specified assistant.
    sql = "delete from richresponses where assistant_id = ?;";
    connection.query(sql, [assistantId], (err, results) => {
        if (err) return console.log(err.message);
    });

    // Delete all queries related to the specified assistant.
    sql = "delete from queries where assistant_id =?";
    connection.query(sql, [assistantId], (err, results) => {
        if (err) return console.log(err.message);
    });

    // Delete all Query Table related to the specified assistant.
    sql = "delete from query_table where assistant_id =?";
    connection.query(sql, [assistantId], (err, results) => {
        if (err) return console.log(err.message);
    });

    // Delete all Database Connections related to the specified assistant.
    sql = "delete from database_connection where assistant_id =?";
    connection.query(sql, [assistantId], (err, results) => {
        if (err) return console.log(err.message);
    });

    // Delete all entities related to the specified assistant.
    sql = "delete from entity where assistant_id =?";
    connection.query(sql, [assistantId], (err, results) => {
        if (err) return console.log(err.message);
    });

    // Delete all entities related to the specified assistant.
    sql = "delete from settings where assistant_id =?";
    connection.query(sql, [assistantId], (err, results) => {
        if (err) return console.log(err.message);
    });

}

/* *************************************************************************************************************************************************** */
/* *************************************************************INTENT DETAILS ************************************************************************************ */
/* *************************************************************************************************************************************************** */

//------------------------------------------------------------Create Intent-----------------------------------------------------------------------

exports.createIntent = (userId, assistantId, intentId, previousIntent, intentName, intentDescription) => {
    let sql = `Insert into intent values(?, ?, ?, ?, ?, ?, ?, ?);`;
    let time = getTime();
    connection.query(sql, [userId, assistantId, intentId, previousIntent, intentName, intentDescription, time, "false"], (err) => {
        if (err) console.log(err)
        else {
            console.log("Intent Created: ", intentName);
        }
    });
};



//------------------------------------------------------------Get Intent Id-----------------------------------------------------------------------

exports.getIntentId = (intentName, assistantId) => {
    let sql = `select intent_id from intent where intent_name = ? and assistant_id=?;`;
    return new Promise((resolve, reject) => {
        connection.query(sql, [intentName, assistantId], (err, results) => {
            if (err) console.log(err)
            else {
                resolve(results[0].intent_id);
            }
        })
    })
}


//------------------------------------------------------------Get Existing Intents-----------------------------------------------------------------------

exports.getExistingIntents = (assistantId) => {
    let sql = `select * from intent where assistant_id = ? order by last_modified desc;`;
    return new Promise((resolve, reject) => {
        connection.query(sql, [assistantId], (err, results) => {
            if (err) console.log(err)
            else {
                console.log(results);
                let intentsList = [];
                for (let i = 0; i < results.length; i++) {
                    let intent = {
                        intentName: results[i].intent_name,
                        intentId: results[i].intent_id,
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

exports.doesIntentExist = (assistantId, intentName, intentId) => {
    let sql = 'Select * from intent where assistant_id=? and intent_name=? and intent_id!=?;';
    return new Promise((resolve, reject) => {
        connection.query(sql, [assistantId, intentName, intentId], (err, results) => {
            if (err) console.log(err);
            else if (results.length != 0) {
                resolve(true);
            } else resolve(false);
        });
    });
}

//------------------------------------------------------------Get Intents Without Follow-----------------------------------------------------------------------

exports.getIntentsWithoutFollow = (assistantId) => {
    let sql = `select * from intent where assistant_id = ? and previous_intent="null" order by last_modified desc;`;
    return new Promise((resolve, reject) => {
        connection.query(sql, [assistantId], (err, results) => {
            if (err) console.log(err)
            else {
                let intentsList = [];
                for (let i = 0; i < results.length; i++) {
                    let intent = {
                        intentName: results[i].intent_name,
                        intentId: results[i].intent_id,
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

exports.getFollowIntents = (intentId) => {
    let sql = `select * from intent where previous_intent=? ;`;
    return new Promise((resolve, reject) => {
        connection.query(sql, [intentId], (err, results) => {
            if (err) console.log(err)
            else {
                let intentsList = [];
                for (let i = 0; i < results.length; i++) {
                    let intent = {
                        intentName: results[i].intent_name,
                        intentId: results[i].intent_id,
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

exports.ifFollowUpExists = (intentId) => {
    let sql = `select * from intent where previous_intent=?;`;
    return new Promise((resolve, reject) => {
        connection.query(sql, [intentId], (err, results) => {
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

exports.handleMultipleReply = (intentId, multipleReply) => {
    let sql = 'update intent set multiple_reply=? where intent_id=?;'
    connection.query(sql, [multipleReply, intentId], (err,) => {
        if (err) console.log(err);
        else console.log("Multiple Reply has been updated")
    })
}

exports.checkMultipleReply = (intentId) => {
    let sql = 'select * from intent where intent_id=?;'
    return new Promise((resolve, reject) => {
        connection.query(sql, [intentId], (err, results) => {
            if (err) console.log(err);
            else if (results.length !== 0) {
                resolve(results[0].multiple_reply);
            }
            else {
                resolve(false);
            }
        })
    });
}


//------------------------------------------------------------Update Intent-----------------------------------------------------------------------

exports.updateIntent = (intentName, description, intentId) => {
    let time = getTime();
    let sql = 'update intent set intent_name=?, description=?, last_modified=? where intent_id=?;'
    connection.query(sql, [intentName, description, time, intentId], (err) => {
        if (err) console.log(err);
        else console.log("Intent has been updated")
    })
}

//------------------------------------------------------------Delete Intent-----------------------------------------------------------------------

exports.deleteIntent = (intentId) => {
    // Delete the specified intent.
    let sql = "delete from intent where intent_id = ?;";
    connection.query(sql, [intentId], (err, results) => {
        if (err) return console.log(err.message);
    });

    // Delete the training phrases and responses related to the specified intent.
    sql = "delete from messages where intent_id = ?;";
    connection.query(sql, [intentId], (err, results) => {
        if (err) return console.log(err.message);
    });

    // Delete all rich resposes related to the specified intent.
    sql = "delete from richresponses where intent_id = ?;";
    connection.query(sql, [intentId], (err, results) => {
        if (err) return console.log(err.message);
    });

    // Delete all queries related to the specified intent.
    sql = "delete from queries where intent_id =?";
    connection.query(sql, [intentId], (err, results) => {
        if (err) return console.log(err.message);
    });

    // Delete all Query Table related to the specified intent.
    sql = "delete from query_table where intent_id =?";
    connection.query(sql, [intentId], (err, results) => {
        if (err) return console.log(err.message);
    });

    // Delete all Entities related to the specified intent.
    sql = "delete from entity where intent_id =?";
    connection.query(sql, [intentId], (err, results) => {
        if (err) return console.log(err.message);
    });
}



/* *************************************************************************************************************************************************** */
/* *************************************************************MESSAGE DETAILS ************************************************************************************ */
/* *************************************************************************************************************************************************** */


//------------------------------------------------------------Create/Add Messages-----------------------------------------------------------------------

exports.addMessage = (userId, assistantId, intentId, messageType, message) => {
    let messageId = uuid();
    let sql = "insert into messages values(?, ?, ?, ?, ?, ?, ?);";
    connection.query(sql, [userId, assistantId, intentId, messageId, messageType, message, getTime()], (err) => {
        if (err) console.log(err)
        else console.log("Created Training Phrase: ", message);
    });
}

//------------------------------------------------------------Get User or Assistant Message-----------------------------------------------------------------------

exports.getMessages = (intentId, messageType) => {
    let sql = "select message_id, message from messages where intent_id=? and message_type=? order by time_created;";
    return new Promise((resolve, reject) => {
        connection.query(sql, [intentId, messageType], (err, results) => {
            if (err) return console.log(err);
            else {
                let messages = [];
                for (let i = 0; i < results.length; i++) {
                    messages.push({
                        messageId: results[i].message_id,
                        message: results[i].message,
                    });
                    console.log(results[i].message);
                }
                resolve(messages);
            }
        })
    })
}

//------------------------------------------------------------Get All  Messages-----------------------------------------------------------------------

exports.getAllMessages = (intentId) => {
    let sql = "select message_id, message, message_type from messages where intent_id=? order by time_created desc;";
    return new Promise((resolve, reject) => {
        connection.query(sql, [intentId], (err, results) => {
            if (err) return console.log(err);
            else {
                let messages = [];
                for (let i = 0; i < results.length; i++) {
                    messages.push({
                        messageId: results[i].message_id,
                        message: results[i].message,
                        messageType: results[i].message_type,
                    });
                    console.log(results[i].message);
                }
                resolve(messages);
            }
        })
    })
}

//------------------------------------------------------------Update Messages-----------------------------------------------------------------------

exports.updateMessage = (messageId, message) => {
    let sql = 'update messages set message=? where message_id=?;'
    connection.query(sql, [message, messageId], (err) => {
        if (err) console.log(err);
        else console.log("Message has been updated")
    })
}


//------------------------------------------------------------Delete Messages-----------------------------------------------------------------------

exports.deleteMessage = (messageId) => {
    let sql = "delete from messages where message_id = ?;";
    connection.query(sql, [messageId], (err, results) => {
        if (err) return console.log(err.message);
    });
}

/* *************************************************************************************************************************************************** */
/* *************************************************************CARD DETAILS ************************************************************************************ */
/* *************************************************************************************************************************************************** */

//------------------------------------------------------------Create Card-----------------------------------------------------------------------

exports.insertCreateCard = (userId, assistantId, intentId, richResponseId, useQuery, cardNo, cardName, cardValue) => {
    for (let i = 0; i < cardName.length; i++) {
        console.log(cardValue)
        let tempCardValue;
        try {
            tempCardValue = JSON.parse(cardValue)[cardName[i]];
        } catch {
            tempCardValue = cardValue[i];
        }

        let sql = "insert into richresponses(user_id, assistant_id, intent_id, richresponse_id, use_query, card_no, card_name, card_value) values(?, ?, ?, ?, ?, ?, ?, ?);";
        connection.query(sql, [userId, assistantId, intentId, richResponseId, useQuery, cardNo, cardName[i], tempCardValue], (err) => {
            if (err) console.log(err)
            else console.log("Inserted Card ");
        });
    }
}


//------------------------------------------------------------Get Query Cards-----------------------------------------------------------------------

exports.getQueryCards = (intentId) => {
    let sql = 'select richresponse_id,card_no from richresponses where intent_id=? and card_value!="NULL" and use_query="true" group by richresponse_id;';
    return new Promise((resolve, reject) => {
        connection.query(sql, [intentId], async (err, results) => {
            if (err) console.log(err)
            else {
                console.log(results);
                let cards = [];
                for (let i = 0; i < results.length; i++) {
                    let card = await this.getCardValues(results[i].richresponse_id)
                    cards.push(card);
                }
                resolve(cards);
            }
        });
    });
}

//------------------------------------------------------------Get All Query Cards-----------------------------------------------------------------------

exports.getCardValues = async (richResponseId) => {
    let sql = 'select * from richresponses where richresponse_id=?';
    return new Promise(resolve => {
        connection.query(sql, [richResponseId], (err, results) => {
            if (err) console.log(err)
            else {
                resolve(results);
            }
        })
    });
}

//------------------------------------------------------------Get Cards Without Queries-----------------------------------------------------------------------

exports.getCards = (intentId) => {
    let sql = 'select richresponse_id,card_no from richresponses where intent_id=? and card_value!="NULL" and use_query="false" group by richresponse_id;';
    return new Promise((resolve, reject) => {
        connection.query(sql, [intentId], async (err, results) => {
            if (err) console.log(err)
            else {
                let cards = [];
                for (let i = 0; i < results.length; i++) {
                    let card = await this.getCardValues(results[i].richresponse_id)
                    cards.push(card);
                }
                resolve(cards);
            }
        });
    });
}

//------------------------------------------------------------Update Card-----------------------------------------------------------------------

exports.updateCard = (cardName, cardValue, richResponseId) => {
    console.log(cardName, cardValue, richResponseId);
    for (let i = 0; i < cardName.length; i++) {
        let sql = 'update richresponses set card_value=? where card_name=? and richresponse_id=?';
        connection.query(sql, [cardValue[i], cardName[i], richResponseId], (err, results) => {
            if (err) return console.log(err.message);
            else console.log("updated Card");
        });
    }
}
//------------------------------------------------------------Delete Card-----------------------------------------------------------------------

exports.deleteCard = (richResponseId) => {
    let sql = 'delete from richresponses where richresponse_id=?;';
    connection.query(sql, [richResponseId], (err, results) => {
        if (err) return console.log(err.message);
        else console.log("Deleted Card");
    });
}

/* *************************************************************************************************************************************************** */
/* *************************************************************SETTINGS************************************************************************************ */
/* *************************************************************************************************************************************************** */

//------------------------------------------------------------Create Default Settings-----------------------------------------------------------------------

exports.createDefaultSettings = (userId, assistantId) => {
    //  let sql = `Insert into intent values(?, ?, "card bg", "cardtxt", "cardbord", "card text font", "chip bg", "chip text", "chip border", "chip shape", "chip text font", "userbg", "user text font",  "usertxtcolor","bot bg", "bot text font ", "bot text color", "box color");`;
    let sql = 'insert into settings values(?, ?, "#a2a399", "#ffffff", "#523c3c", "verdana", "#4bd9de",  "#064a04", "#4249db", "12", "verdana", "#4278db", "verdana", "#ffffff", "#5d2ad4", "verdana", "#000000", "#06badf");';
    connection.query(sql, [userId, assistantId], (err) => {
        if (err) console.log(err)
        else {
            console.log("Settings Added : ");
        }
    });
};

//------------------------------------------------------------Get Chatbox Settings-----------------------------------------------------------------------

exports.getChatboxSettings = (userId, assistantId) => {
    let sql = "select * from settings where assistant_id=?;";
    return new Promise((resolve, reject) => {
        connection.query(sql, [assistantId], (err, results) => {
            if (err) console.log(err)
            else if (results.length != 0) {
                let chatBoxSettings = {
                    cardTheme: {
                        cardBgColor: results[0].card_bgcolor,
                        cardTextColor: results[0].card_text_color,
                        cardBorder: results[0].card_border,
                        cardFont: results[0].card_font,
                    },
                    chipTheme: {
                        chipBgColor: results[0].chip_bgcolor,
                        chipTextColor: results[0].chip_text_color,
                        chipBorder: results[0].chip_border,
                        chipShape: results[0].chip_shape,
                        chipFont: results[0].chip_font,
                    },
                    chatBoxTheme: {
                        userBg: results[0].user_text_bgcolor,
                        userFont: results[0].user_font,
                        userColor: results[0].user_text_color,
                        assistantBg: results[0].assistant_text_bgcolor,
                        assistantFont: results[0].assistant_font,
                        assistantColor: results[0].assistant_text_color,
                        chatBoxColor: results[0].chatbox_color,
                    }
                };
                resolve({ chatBoxSettings });
            } else {
                resolve();
            }
        })
    })
}

exports.setChatboxSettings = (assistantId, settings) => {

    let sql = "update settings set card_bgcolor=?, card_text_color=?, card_border=?, card_font=?, chip_bgcolor=?, chip_text_color=?, chip_border=?, chip_shape=?, chip_font=?, user_text_bgcolor=?, user_font=?, user_text_color=?, assistant_text_bgcolor =?, assistant_font =?, assistant_text_color=?, chatbox_color =? where assistant_id=?; ";
    let { chipTheme, chatBoxTheme, cardTheme } = JSON.parse(settings);
    let { userBg, userColor, userFont, assistantBg, assistantColor, assistantFont, chatBoxColor } = chatBoxTheme;
    let { cardBgColor, cardTextColor, cardBorder, cardFont, } = cardTheme;
    let { chipBgColor, chipTextColor, chipBorder, chipShape, chipFont } = chipTheme;
    return new Promise((resolve, reject) => {
        connection.query(sql,
            [cardBgColor, cardTextColor,
                cardBorder, cardFont, chipBgColor, chipTextColor, chipBorder, chipShape,
                chipFont, userBg, userFont, userColor, assistantBg,
                assistantFont, assistantColor, chatBoxColor, assistantId], (err, results) => {
                    console.log("Inside query");
                    if (err) console.log(err)
                    else {
                        resolve(true);
                    }
                })
    })
}
//------------------------------------------------------------Update Card Theme-----------------------------------------------------------------------

exports.updateCardTheme = (assistantId, cardColor, textColor) => {
    let sql = 'update settings set card_bgcolor=?, card_text_color=? where assistant_id=?;'
    connection.query(sql, [cardColor, textColor, assistantId], (err) => {
        if (err) console.log(err);
        else console.log("Card Theme has been updated")
    })
}

//------------------------------------------------------------Get Card Theme-----------------------------------------------------------------------

exports.getCardTheme = (assitantId) => {
    let sql = "select card_bgcolor, card_text_color from settings where assistant_id=?;";
    return new Promise((resolve, reject) => {
        connection.query(sql, [assitantId], (err, results) => {
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

exports.insertCreateChip = (userId, assistantId, intentId, richResponseId, usingQueries, chipValue) => {
    let sql = "insert into richresponses(user_id, assistant_id, intent_id, richresponse_id, use_query, chip_value) values(?, ?, ?, ?, ?, ?);";
    connection.query(sql, [userId, assistantId, intentId, richResponseId, usingQueries, chipValue], (err) => {
        if (err) console.log(err)
        else console.log("Inserted Chip ");
    });
}

//------------------------------------------------------------Get All Chips without Query-----------------------------------------------------------------------

exports.getChips = (intentId) => {
    let sql = 'select richresponse_id, chip_value from richresponses where intent_id = ? and use_query="false" and chip_value!="null"; ';
    return new Promise((resolve, reject) => {
        connection.query(sql, [intentId], (err, results) => {
            if (err) console.log(err)
            else {
                console.log("Chips are ", results);
                resolve(results);
            }
        });
    });
}

//------------------------------------------------------------Get Query Chips-----------------------------------------------------------------------

exports.getQueryChips = (intentId) => {
    let sql = 'select * from richresponses where intent_id = ? and use_query="true"; ';
    return new Promise((resolve, reject) => {
        connection.query(sql, [intentId], (err, results) => {
            if (err) console.log(err)
            else {
                console.log("Chips are ", results);
                resolve(results);
            }
        });
    });
}

//------------------------------------------------------------Get All Chips-----------------------------------------------------------------------

exports.getAllChips = (intentId) => {
    let sql = 'select * from richresponses where intent_id = ? and chip_value != "null";';
    return new Promise((resolve, reject) => {
        connection.query(sql, [intentId], (err, results) => {
            if (err) console.log(err)
            else {
                console.log("Chips are ", results);
                resolve(results);
            }
        });
    });
}

//------------------------------------------------------------Update Chip-----------------------------------------------------------------------

exports.updateChip = (chipResponse, richResponseId) => {
    let sql = 'update richresponses set chip_value=? where richresponse_id=?;'
    connection.query(sql, [chipResponse, richResponseId], (err) => {
        if (err) console.log(err);
        else console.log("response has been updated")
    })
}


//------------------------------------------------------------Delete Chip-----------------------------------------------------------------------

exports.deleteChip = (richResponseId) => {
    let sql = 'delete from richresponses where richresponse_id=?;';
    connection.query(sql, [richResponseId], (err, results) => {
        if (err) return console.log(err.message);
        else console.log("Deleted Chip");
    });
}


/* *************************************************************************************************************************************************** */
/* *************************************************************DATABASE CONNECTION DETAILS ************************************************************************************ */
/* *************************************************************************************************************************************************** */


//------------------------------------------------------------Store Database Details-----------------------------------------------------------------------

exports.addDatabaseDetails = (userId, assistantId, username, password, databaseName) => {
    let sql = 'insert into database_connection values(?, ?, ?, ?, ?);';
    connection.query(sql, [userId, assistantId, username, password, databaseName], (err) => {
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

exports.getColumnNames = (tableName) => {
    let sql = 'select column_name from information_schema.columns where table_name=?;';
    return new Promise(resolve => {
        connection.query(sql, [tableName], (err, results) => {
            if (err) console.log(err);
            else {
                resolve(results);
            }
        })
    })
}

//------------------------------------------------------------Add Query Details-----------------------------------------------------------------------

exports.addQueryDetails = (rows, selectedColumns, distinctColumn, userId, assistantId, intentId, tableName) => {
    this.deleteExistingQuery(intentId);
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
            sql = 'insert into query_table (user_id, assistant_id, intent_id, table_name, column_name, compare_condition, compare_value, logic) values(?, ?, ?, ?, ?, ?, ?, ?)';
            connection.query(sql, [userId, assistantId, intentId, tableName, selectedColumn, selectedOperator, compareValue, logic], (err) => {
                if (err) console.log(err);
            })
        }
    }
    for (let i = 0; i < selectedColumns.length; i++) {
        sql = 'insert into query_table(user_id, assistant_id, intent_id, table_name, selected_column) values(?, ?, ?, ?, ?);';
        connection.query(sql, [userId, assistantId, intentId, tableName, selectedColumns[i]], (err) => {
            if (err) console.log(err);
        })
    }
    if (distinctColumn) {
        sql = 'insert into query_table(user_id, assistant_id, intent_id, table_name, distinct_column) values(?, ?, ?, ?, ?);';
        connection.query(sql, [userId, assistantId, intentId, tableName, distinctColumn], (err) => {
            if (err) console.log(err);
        })
    }
}

//------------------------------------------------------------Create Query-----------------------------------------------------------------------

exports.addQuery = (userId, assistantId, intentId, query) => {
    let queryId = uuid();
    let sql = "insert into queries values(?, ?, ?, ?, ?);";
    connection.query(sql, [userId, assistantId, intentId, queryId, query], (err) => {
        if (err) console.log(err);
    })
}


//------------------------------------------------------------Get Table Name-----------------------------------------------------------------------

exports.getTableName = (intentId) => {
    let sql = "select table_name from query_table where intent_id=? group by intent_id;";
    return new Promise(resolve => {
        connection.query(sql, [intentId], (err, results) => {
            if (err) console.log(err);
            else if (results.length != 0) {
                resolve(results[0].table_name);
            } else {
                resolve(undefined);
            }
        })
    })
}

//------------------------------------------------------------Get Query Rows-----------------------------------------------------------------------
exports.getQueryRows = (intentId) => {
    let sql = 'select * from query_table where intent_id=? and column_name != "null";';
    return new Promise(resolve => {
        connection.query(sql, [intentId], (err, results) => {
            if (err) console.log(err);
            else {
                let queryRows = [];
                for (let i = 0; i < results.length; i++) {
                    if (results[i].column_name != null)
                        queryRow = {
                            id: i + 1,
                            selectedColumn: results[i].column_name,
                            selectedOperator: results[i].compare_condition,
                            compareValue: results[i].compare_value,
                            logic: results[i].logic
                        }
                    queryRows.push(queryRow);
                }
                resolve(queryRows);
            }
        })
    });
}

//------------------------------------------------------------Get Selected Columns-----------------------------------------------------------------------

exports.getSelectedColumns = (intentId) => {
    let sql = 'select * from query_table where intent_id =? and selected_column != "null";';
    return new Promise(resolve => {
        connection.query(sql, [intentId], (err, results) => {
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

exports.getDistinctColumn = (intentId) => {
    let sql = 'select * from query_table where intent_id =? and distinct_column != "null";';
    return new Promise(resolve => {
        connection.query(sql, [intentId], (err, results) => {
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

exports.getQueryDetails = async (intentId) => {

    return new Promise(async (resolve) => {
        // Table name
        let tableName = await this.getTableName(intentId);
        // Query Rows ( Condition )
        let queryRows = await this.getQueryRows(intentId);
        // Selected Columns
        let selectedColumns = await this.getSelectedColumns(intentId);
        // Distinct Column
        let distinctColumn = await this.getDistinctColumn(intentId);
        resolve({
            tableName,
            queryRows,
            selectedColumns,
            distinctColumn
        });
    })


}

//------------------------------------------------------------Delete Query-----------------------------------------------------------------------

exports.deleteExistingQuery = (intentId) => {
    let sql = "delete from query_table where intent_id=?;";
    connection.query(sql, [intentId], (err) => {
        if (err) console.log(err);
    })

    sql = "delete from queries where intent_id=?;";
    connection.query(sql, [intentId], (err) => {
        if (err) console.log(err);
    })
}


/* *************************************************************************************************************************************************** */
/* ***************************************************************ENTITY************************************************************************************ */
/* *************************************************************************************************************************************************** */

//------------------------------------------------------------Create Entity-----------------------------------------------------------------------

exports.createEntity = async (userId, assistantId, intentId, selectedColumns, entityNames) => {
    for (let i = 0; i < selectedColumns.length; i++) {
        let entityId = uuid();
        let entityName = JSON.parse(entityNames)[selectedColumns[i]];
        let sql = "insert into entity(user_id, assistant_id, intent_id, entity_id, entity_name,entity_type) values(?,?,?,?,?,?);";
        connection.query(sql, [userId, assistantId, intentId, entityId, entityName, selectedColumns[i].toLowerCase()], (err, results) => {
            if (err) console.log(err);
            else {
                console.log(entityId);
            }
        })
    }
}

//------------------------------------------------------------Add Entity Value(Do in Save Conversation)-----------------------------------------------------------------------

exports.entityValue = (intentId, existingEntities, sendMessage) => {
    let sql = 'select * from entity where intent_id=?';
    return new Promise(resolve => {
        connection.query(sql, [intentId], async (err, results) => {
            if (err) console.log(err)
            else {
                for (let i = 0; i < results.length; i++) {
                    if (results[i].entity_type === "name" || results[i].entity_type === "other")
                        existingEntities.push(results[i].entity_type);
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
                    await this.updateEntityValue(entityName, intentId, value);
                }
                resolve("true");
            }
        })
    })
}


//------------------------------------------------------------Get Entities-----------------------------------------------------------------------


exports.getEntities = (intentId) => {
    console.log(intentId);
    let sql = 'select * from entity where intent_id=? ';
    return new Promise(resolve => {
        connection.query(sql, [intentId], (err, results) => {
            if (err) console.log(err);
            else {
                resolve(results);
            }
        })
    })
}

//------------------------------------------------------------Update Entity-----------------------------------------------------------------------

exports.updateEntityValue = (entityName, intentId, value) => {
    console.log(intentId, entityName, value);
    let sql = 'update entity set entity_value=? where intent_id=? and entity_type=?';
    return new Promise(resolve => {
        connection.query(sql, [value, intentId, entityName.toLowerCase()], (err2) => {
            if (err2) console.log(err2);
            else {
                resolve("Success");
            }
        })
    })
}


//------------------------------------------------------------Delete Entity-----------------------------------------------------------------------

exports.deleteEntity = (intentId) => {
    console.log(intentId)
    let sql = 'delete from entity where intent_id=? and entity_name=?';
    return new Promise(resolve => {
        connection.query(sql, [intentId, entityName.toLowerCase()], (err2) => {
            if (err2) console.log(err2);
            else {
                resolve("Success");
            }
        })
    })

}