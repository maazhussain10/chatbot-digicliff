const { connection } = require("./connection");

//------------------------------------------------------------Create Entity-----------------------------------------------------------------------
exports.createEntity = async (
    username,
    assistantName,
    intentName,
    selectedColumns,
    entityNames
) => {
    for (let i = 0; i < selectedColumns.length; i++) {
        let entityName = JSON.parse(entityNames)[selectedColumns[i]];
        let sql = "insert into entity values(?,?,?,?,?);";
        connection.query(
            sql,
            [
                username,
                assistantName,
                intentName,
                entityName,
                selectedColumns[i].toLowerCase(),
            ],
            (err, results) => {
                if (err) console.log(err);
            }
        );
    }
};
// ------------------------------------------------------------Update Entity Name-------------------------------------------------------
exports.updateEntity = async (
    username,
    assistantName,
    intentName,
    entityName,
    entityType
) => {
    let sql =
        "update entity set entityName=? where entityType=? and username=? and assistant=? and intent=?";
    connection.query(
        sql,
        [entityName, entityType, username, assistantName, intentName],
        (err, results) => {
            if (err) console.log(err);
        }
    );
};

//------------------------------------------------------------Add Entity Value(Do in Save Conversation)-----------------------------------------------------------------------

exports.entityValue = (
    username,
    assistantName,
    intentName,
    existingEntities,
    sendMessage
) => {
    let ipAddress = "171.0.10.1";
    let sql =
        "select * from entity where username=? and assistant=? and intent=?";
    return new Promise((resolve) => {
        connection.query(
            sql,
            [username, assistantName, intentName],
            async (err, results) => {
                if (err) console.log(err);
                else {
                    for (let i = 0; i < results.length; i++) {
                        if (
                            results[i].entityType === "name" ||
                            results[i].entityType === "other"
                        )
                            existingEntities.push(results[i].entityType);
                    }
                    let value;
                    for (let i = 0; i < existingEntities.length; i++) {
                        if (existingEntities[i] === "name") {
                            sendMessage = sendMessage.replace("my ", "");
                            sendMessage = sendMessage.replace("name ", "");
                            sendMessage = sendMessage.replace("is ", "");
                            value = sendMessage;
                            entityName = "name";
                        } else if (existingEntities[i] === "other") {
                            value = sendMessage;
                            entityName = "other";
                        } else {
                            value = existingEntities[i].sourceText;
                            entityName = existingEntities[i].entity;
                        }
                        if (results.length) {
                            let visitorExist = await this.checkVisitorExist(
                                username,
                                assistantName,
                                intentName,
                                ipAddress,
                                results[i].entityName,
                                results[i].entityType
                            );
                            if (!visitorExist)
                                await this.addVisitorInfo(
                                    username,
                                    assistantName,
                                    intentName,
                                    ipAddress,
                                    results[i].entityName,
                                    results[i].entityType,
                                    value
                                );
                            else
                                await this.updateVisitorInfo(
                                    username,
                                    assistantName,
                                    intentName,
                                    ipAddress,
                                    results[i].entityName,
                                    results[i].entityType,
                                    value
                                );
                        }
                    }
                    resolve("true");
                }
            }
        );
    });
};

//------------------------------------------------------------Get Entities-----------------------------------------------------------------------

exports.checkVisitorExist = (
    username,
    assistantName,
    intentName,
    ipAddress,
    entityName,
    entityType
) => {
    let sql =
        "select * from visitordetails where username=? and assistant=? and intent=? and ipAddress=? and entityName=? and entityType=?";
    return new Promise((resolve) => {
        connection.query(
            sql,
            [
                username,
                assistantName,
                intentName,
                ipAddress,
                entityName,
                entityType,
            ],
            (err, results) => {
                if (err) console.log(err);
                else if (results.length) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            }
        );
    });
};
//------------------------------------------------------------Get Entities-----------------------------------------------------------------------

exports.getEntities = (username, assistantName, intentName) => {
    let sql =
        "select * from entity where username=? and assistant=? and intent=? ";
    return new Promise((resolve) => {
        connection.query(
            sql,
            [username, assistantName, intentName],
            (err, results) => {
                if (err) console.log(err);
                else {
                    resolve(results);
                }
            }
        );
    });
};

//------------------------------------------------------------Get Visitor With IP-----------------------------------------------------------------------

exports.getAllDetailsOfVisitor = (username, assistantName,ipAddress) => {
    let sql = "select * from visitorDetails where username=? and assistant=? and ipAddress=?";
    return new Promise((resolve) => {
        connection.query(sql, [username, assistantName,ipAddress], (err, results) => {
            if (err) console.log(err);
            else {
                resolve(results);
            }
        });
    });
};

//------------------------------------------------------------Visitor Details----------------------------------------------------------------------

exports.addVisitorInfo = (
    username,
    assistantName,
    intentName,
    ipAddress,
    entityName,
    entityType,
    value
) => {
    let sql = "insert into visitordetails values(?,?,?,?,?,?,?)";
    return new Promise((resolve) => {
        connection.query(
            sql,
            [
                username,
                assistantName,
                intentName,
                ipAddress,
                entityName,
                entityType,
                value,
            ],
            (err2) => {
                if (err2) {
                    console.log(err2);
                } else {
                    resolve("Success");
                }
            }
        );
    });
};

//------------------------------------------------------------Update Visitor Info-----------------------------------------------------------------------

exports.updateVisitorInfo = (
    username,
    assistantName,
    intentName,
    ipAddress,
    entityName,
    entityType,
    value
) => {
    let sql =
        "update visitordetails set entityValue=? where username=? and assistant=? and intent=? and ipAddress=? and entityName=?";
    return new Promise((resolve) => {
        connection.query(
            sql,
            [value, username, assistantName, intentName, ipAddress, entityName],
            (err2) => {
                if (err2) {
                    console.log(err2);
                } else {
                    resolve("Success");
                }
            }
        );
    });
};

//------------------------------------------------------------Obtain Visitor Details-----------------------------------------------------------------------

exports.visitorDetails = (username, assistant) => {
    let sql =
        "select * from visitordetails where username=? and assistant=? order by ipAddress;";
    return new Promise((resolve) => {
        connection.query(sql, [username, assistant], (err2,result) => {
            if (err2) console.log(err2);
            else {
                resolve(result);
            }
        });
    });
};
//------------------------------------------------------------Delete Entity-----------------------------------------------------------------------

exports.deleteEntity = (username, assistantName, intentName, entityType) => {
    let sql =
        "delete from entity where username=? and assistant=? and intent=? and entityType=?";
    return new Promise((resolve) => {
        connection.query(
            sql,
            [username, assistantName, intentName, entityType.toLowerCase()],
            (err2) => {
                if (err2) console.log(err2);
                else {
                    resolve("Success");
                }
            }
        );
    });
};
