const { connection } = require("./connection");
const { getTime } = require("./utilityFunctions");

exports.createIntent = (
    username,
    assistantName,
    previousIntent,
    intentName,
    intentDescription
) => {
    let sql = `Insert into intent values(?, ?, ?, ?, ?, ?, ?);`;
    let time = getTime();
    connection.query(
        sql,
        [
            username,
            assistantName,
            intentName,
            intentDescription,
            previousIntent,
            time,
            "false",
        ],
        (err) => {
            if (err) console.log(err);
        }
    );
};

//------------------------------------------------------------Get Intent Id-----------------------------------------------------------------------

exports.getIntentName = (intentName, assistantName) => {
    let sql = `select intent from intent where intent = ? and assistant=?;`;
    return new Promise((resolve, reject) => {
        connection.query(sql, [intentName, assistantName], (err, results) => {
            if (err) console.log(err);
            else {
                resolve(results[0].intent);
            }
        });
    });
};

//------------------------------------------------------------Get Existing Intents-----------------------------------------------------------------------

exports.getExistingIntents = (username, assistantName) => {
    let sql = `select * from intent where username=? and assistant = ? order by lastModified;`;
    return new Promise((resolve, reject) => {
        connection.query(sql, [username, assistantName], (err, results) => {
            if (err) console.log(err);
            else {
                let intentsList = [];
                for (let i = 0; i < results.length; i++) {
                    let intent = {
                        intentName: results[i].intent,
                        intentDesc: results[i].description,
                        previousIntent: results[i].previousIntent,
                    };
                    intentsList.push(intent);
                }

                const responseData = {
                    responseType: "Success",
                    responseStatus: true,
                    existingIntents: intentsList,
                };
                resolve(responseData);
            }
        });
    });
};

//------------------------------------------------------------Check If Intent Exists-----------------------------------------------------------------------

exports.doesIntentExist = (username, assistantName, intentName) => {
    let sql =
        "Select * from intent where username=? and assistant=? and intent=?;";
    return new Promise((resolve, reject) => {
        connection.query(
            sql,
            [username, assistantName, intentName],
            (err, results) => {
                if (err) console.log(err);
                else if (results.length != 0) {
                    resolve(true);
                } else resolve(false);
            }
        );
    });
};

//------------------------------------------------------------Get Intents Without Follow-----------------------------------------------------------------------

exports.getIntentsWithoutFollow = (username, assistantName) => {
    let sql = `select * from intent where username=? and assistant = ? and previousIntent is NULL order by lastModified desc;`;
    return new Promise((resolve, reject) => {
        connection.query(sql, [username, assistantName], (err, results) => {
            if (err) console.log(err);
            else {
                let intentsList = [];
                for (let i = 0; i < results.length; i++) {
                    let intent = {
                        intentName: results[i].intent,
                        intentDesc: results[i].description,
                    };
                    intentsList.push(intent);
                }
                const responseData = {
                    responseType: "Success",
                    responseStatus: true,
                    existingIntents: intentsList,
                };
                resolve(responseData);
            }
        });
    });
};

//--------------------------------------------------------Get Follow Intents--------------------------------------------------------------

exports.getFollowIntents = (username, assistantName, intentName) => {
    let sql = `select * from intent where previousIntent=? and username=? and assistant=? ;`;
    return new Promise((resolve, reject) => {
        connection.query(
            sql,
            [intentName, username, assistantName],
            (err, results) => {
                if (err) console.log(err);
                else {
                    let intentsList = [];
                    for (let i = 0; i < results.length; i++) {
                        let intent = {
                            intentName: results[i].intent,
                            intentDesc: results[i].description,
                        };
                        intentsList.push(intent);
                    }

                    const responseData = {
                        responseType: "Success",
                        responseStatus: true,
                        existingIntents: intentsList,
                    };
                    resolve(responseData);
                }
            }
        );
    });
};

//-----------------------------------------------------------Check If Follow Up Intent Exists--------------------------------------------

exports.ifFollowUpExists = (username, assistantName, intentName) => {
    let sql = `select * from intent where username=? and assistant=? and previousIntent=?;`;
    return new Promise((resolve, reject) => {
        connection.query(
            sql,
            [username, assistantName, intentName],
            (err, results) => {
                if (err) console.log(err);
                else {
                    if (results.length !== 0) resolve(true);
                    else resolve(false);
                }
            }
        );
    });
};

//------------------------------------------------------------Handle Multiple Reply-----------------------------------------------------------------------

exports.handleMultipleReply = (
    username,
    assistantName,
    intentName,
    multipleReply
) => {
    let sql =
        "update intent set multipleReply=? where username=? and assistant=? and intent=?;";
    connection.query(
        sql,
        [multipleReply, username, assistantName, intentName],
        (err) => {
            if (err) console.log(err);
        }
    );
};

//------------------------------------------------------------Check if Multiple Reply Exist--------------------------------------------------

exports.checkMultipleReply = (username, assistantName, intentName) => {
    let sql =
        "select * from intent where username=? and assistant=? and intent=?;";
    return new Promise((resolve, reject) => {
        connection.query(
            sql,
            [username, assistantName, intentName],
            (err, results) => {
                if (err) console.log(err);
                else if (results.length !== 0) {
                    resolve(results[0].multipleReply);
                } else {
                    resolve(false);
                }
            }
        );
    });
};

//------------------------------------------------------------Update Intent-----------------------------------------------------------------------

exports.updateIntent = (
    username,
    assistantName,
    intentName,
    description,
    previousIntentName
) => {
    let time = getTime();
    let sql =
        "update intent set intent=?, description=?, lastModified=? where username=? and assistant=? and intent=?;";
    connection.query(
        sql,
        [
            intentName,
            description,
            time,
            username,
            assistantName,
            previousIntentName,
        ],
        (err) => {
            if (err) console.log(err);
        }
    );
};

//------------------------------------------------------------Delete Intent-----------------------------------------------------------------------

exports.deleteIntent = (username, assistantName, intentName) => {
    let sql =
        "delete from intent where username=? and assistant=? and intent = ? or previousIntent = ?;";
    connection.query(
        sql,
        [username, assistantName, intentName, intentName],
        (err, results) => {
            if (err) return console.log(err.message);
        }
    );
};
