const { connection } = require("./connection");

exports.createDefaultSettings = (username, assistantName) => {
  //  let sql = `Insert into intent values(?, ?, "card bg", "cardtxt", "cardbord", "card text font", "chip bg", "chip text", "chip border", "chip shape", "chip text font", "userbg", "user text font",  "usertxtcolor","bot bg", "bot text font ", "bot text color", "box color");`;
  let sql =
    'insert into settings values(?, ?, "#a2a399", "#ffffff", "#523c3c", "verdana", "#4bd9de",  "#064a04", "#4249db", "12", "verdana", "#4278db", "verdana", "#ffffff", "#5d2ad4", "verdana", "#000000", "#06badf");';
  connection.query(sql, [username, assistantName], (err) => {
    if (err) console.log(err);
    else {
      console.log("Settings Added");
    }
  });
};

//------------------------------------------------------------Get Chatbox Settings-----------------------------------------------------------------------

exports.getChatboxSettings = (username, assistantName) => {
  let sql = "select * from settings where assistant=? and username=?;";
  return new Promise((resolve, reject) => {
    connection.query(sql, [assistantName, username], (err, results) => {
      if (err) console.log(err);
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
          },
        };
        resolve({ chatBoxSettings });
      } else {
        resolve();
      }
    });
  });
};

exports.setChatboxSettings = (username, assistantName, settings) => {
  let sql =
    "update settings set cardBgcolor=?, cardTextColor=?, cardBorder=?, cardFont=?, chipBgcolor=?, chipTextColor=?, chipBorder=?, chipShape=?, chipFont=?, userTextBgcolor=?, userFont=?, userTextColor=?, assistantTextBgcolor =?, assistantFont =?, assistantTextColor=?, chatboxColor =? where assistant=? and username=?; ";
  let { chipTheme, chatBoxTheme, cardTheme } = JSON.parse(settings);
  let { userBg, userColor, userFont, assistantBg, assistantColor, assistantFont, chatBoxColor } =
    chatBoxTheme;
  let { cardBgColor, cardTextColor, cardBorder, cardFont } = cardTheme;
  let { chipBgColor, chipTextColor, chipBorder, chipShape, chipFont } = chipTheme;
  return new Promise((resolve, reject) => {
    connection.query(
      sql,
      [
        cardBgColor,
        cardTextColor,
        cardBorder,
        cardFont,
        chipBgColor,
        chipTextColor,
        chipBorder,
        chipShape,
        chipFont,
        userBg,
        userFont,
        userColor,
        assistantBg,
        assistantFont,
        assistantColor,
        chatBoxColor,
        assistantName,
        username,
      ],
      (err, results) => {
        console.log("Inside query");
        if (err) console.log(err);
        else {
          resolve(true);
        }
      }
    );
  });
};
//------------------------------------------------------------Update Card Theme-----------------------------------------------------------------------

exports.updateCardTheme = (assistantName, cardColor, textColor) => {
  let sql = "update settings set card_bgcolor=?, card_text_color=? where assistant=?;";
  connection.query(sql, [cardColor, textColor, assistantName], (err) => {
    if (err) console.log(err);
    else console.log("Card Theme has been updated");
  });
};

//------------------------------------------------------------Get Card Theme-----------------------------------------------------------------------

exports.getCardTheme = (assistantName) => {
  let sql = "select card_bgcolor, card_text_color from settings where assistant=?;";
  return new Promise((resolve, reject) => {
    connection.query(sql, [assistantName], (err, results) => {
      if (err) console.log(err);
      else {
        resolve({
          cardColor: results[0].card_bgcolor,
          textColor: results[0].card_text_color,
        });
      }
    });
  });
};
