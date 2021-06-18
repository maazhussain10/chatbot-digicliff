const { connection } = require("./connection");
const { getTime } = require("./utilityFunctions");

exports.createCard = (
  username,
  assistantName,
  intentName,
  useQuery,
  cardNo,
  cardName,
  cardValue
) => {
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
  connection.query(
    sql,
    [
      username,
      assistantName,
      intentName,
      useQuery,
      cardNo,
      JSON.stringify(cardName),
      JSON.stringify(cardValues),
      time,
    ],
    (err) => {
      if (err) console.log(err);
      else console.log("Inserted Card ");
    }
  );
};

// //------------------------------------------------------------Get Query Cards-----------------------------------------------------------------------

exports.getQueryCards = (username, assistantName, intentName) => {
  let sql =
    'select * from richResponseCard where username=? and assistant=?  and intent=? and useQuery="true" order by lastModified;';
  return new Promise((resolve, reject) => {
    connection.query(
      sql,
      [username, assistantName, intentName],
      async (err, results) => {
        if (err) console.log(err);
        else {
          let existingCards = [];
          for (let i = 0; i < results.length; i++) {
            let tempExistingCards = {
              username: results[i].username,
              assistant: results[i].assistant,
              intent: results[i].intent,
              useQuery: results[i].useQuery,
              cardNo: results[i].cardNo,
              cardName: JSON.parse(results[i].cardName),
              cardValue: JSON.parse(results[i].cardValue),
              lastModified: results[i].lastModified,
            };
            existingCards.push(tempExistingCards);
          }
          resolve(existingCards);
        }
      }
    );
  });
};

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

//------------------------------------------------------------Get All Cards-----------------------------------------------------------------------

exports.getCards = (username, assistantName, intentName) => {
  let sql =
    "select * from richResponseCard where username=? and assistant=?  and intent=? order by lastModified;";
  return new Promise((resolve, reject) => {
    connection.query(
      sql,
      [username, assistantName, intentName],
      async (err, results) => {
        if (err) console.log(err);
        else {
          console.log(results);
          let existingCards = [];
          for (let i = 0; i < results.length; i++) {
            let tempExistingCards = {
              username: results[i].username,
              assistant: results[i].assistant,
              intent: results[i].intent,
              useQuery: results[i].useQuery,
              cardNo: results[i].cardNo,
              cardName: JSON.parse(results[i].cardName),
              cardValue: JSON.parse(results[i].cardValue),
              lastModified: results[i].lastModified,
            };
            existingCards.push(tempExistingCards);
          }
          resolve(existingCards);
        }
      }
    );
  });
};

//------------------------------------------------------------Update Card-----------------------------------------------------------------------

exports.updateCard = (cardName, cardValue, richResponseId) => {
  console.log(cardName, cardValue, richResponseId);
  for (let i = 0; i < cardName.length; i++) {
    let sql =
      "update richresponses set cardValue=? where CardName=? and richResponseID=?";
    connection.query(
      sql,
      [cardValue[i], cardName[i], richResponseId],
      (err, results) => {
        if (err) return console.log(err.message);
        else console.log("updated Card");
      }
    );
  }
};
//------------------------------------------------------------Delete Card-----------------------------------------------------------------------

exports.deleteCard = (username, assistantName, intentName, cardValue) => {
  let sql =
    "delete from richResponseCard where username=? and assistant=? and intent=? and cardValue=?;";
  connection.query(
    sql,
    [username, assistantName, intentName, cardValue],
    (err, results) => {
      if (err) return console.log(err.message);
      else console.log("Deleted Card");
    }
  );
};
