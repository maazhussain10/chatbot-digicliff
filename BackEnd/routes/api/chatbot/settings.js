const settingsRoute = require('express').Router();
const db = require('../../../models');

settingsRoute.get('/', async (req, res) => {
    let { chatbotId } = req.query;
    try {
        let settings = await db.Settings.findOne({
            attributes: ['cardTheme', 'chipTheme', 'messageTheme', 'chatboxTheme'],
            where: {
                chatbotId,
            }
        })
        if (!settings)
            res.sendStatus(404);

        let [cardBgColor, cardTextColor, cardBorder, cardFont] = settings.cardTheme.split(',');
        let [chipBgColor, chipTextColor, chipBorder, chipShape, chipFont] = settings.chipTheme.split(',');
        let [userTextBgcolor, userFont, userTextColor, botTextBgcolor, botFont, botTextColor] = settings.messageTheme.split(',');
        let [chatboxColor, chatboxFont, chatboxFontColor, sendMessageColor] = settings.chatboxTheme.split(',');
        let settingsValue = {
            cardBgColor, cardTextColor, cardBorder, cardFont,
            chipBgColor, chipTextColor, chipBorder, chipShape, chipFont,
            userTextBgcolor, userFont, userTextColor, botTextBgcolor, botFont, botTextColor,
            chatboxColor, chatboxFont, chatboxFontColor, sendMessageColor
        }
        res.status(200).json(settingsValue);;
    }
    catch (err) {
        res.status(500).send(err);
    }
});

settingsRoute.post('/', async (req, res) => {
    let { chatbotId, theme } = req.body;
    let cardTheme = theme.cardBgColor + "," + theme.cardTextColor + "," + theme.cardBorder + "," + theme.cardFont;
    let chipTheme = theme.chipBgColor + "," + theme.chipTextColor + "," + theme.chipBorder + "," + theme.chipShape + "," + theme.chipFont;
    let messageTheme = theme.userTextBgcolor + "," + theme.userFont + "," + theme.userTextColor + "," + theme.botTextBgcolor + "," + theme.botFont + "," + theme.botTextColor;
    let chatboxTheme = theme.chatboxColor + "," + theme.chatboxFont + "," + theme.chatboxFontColor + "," + theme.sendMessageColor;

    // cardBgcolor | cardTextColor | cardBorder | cardFont
    // chipBgcolor | chipTextColor | chipBorder | chipShape | chipFont 
    // userTextBgcolor | userFont | userTextColor | botTextBgcolor | botFont | botTextColor
    // chatboxColor | chatboxFont | chatboxFontColor | sendMessageColor

    try {
        let databaseConnection = await db.Settings.upsert({ chatbotId, cardTheme, chipTheme, messageTheme, chatboxTheme });
        res.status(204).json(databaseConnection);
    }
    catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});




module.exports = settingsRoute;