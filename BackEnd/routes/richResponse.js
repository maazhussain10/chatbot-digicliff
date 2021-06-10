const sqlFunctions = require('../files/sqlFunctions');
const uuid = require('uuid-random');


class RichResponse {

    constructor(app) {
        this.richResponse(app);
    }

    richResponse(app) {

        app.get('/rich-response', (req, res) => {
            let {
                username, assistantName, intentName
            } = req.query

            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, Accept');
            async function getChips() {
                let existingChips = await sqlFunctions.getChips(username, assistantName, intentName);
                if (existingChips.length != 0) {
                    res.send(existingChips);
                }

            }
            async function getCards() {
                let existingCards = await sqlFunctions.getCards(intentName);
                if (existingCards.length != 0) {
                    res.send(existingCards);
                }
            }

            console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAa");
            getCards();
            getChips();
        });

        app.post('/chip', (req, res) => {

            const {
                username,
                assistantName,
                intentName,
                chipResponse,
                usingQueries,
            } = req.query

            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, Accept');
            async function createChip() {
                await sqlFunctions.insertCreateChip(username, assistantName, intentName, usingQueries, chipResponse);
                let existingChips = await sqlFunctions.getChips(username, assistantName, intentName);
                res.send(existingChips);
            }
            createChip();
        });

        app.get('/getchips', (req, res) => {

            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, Accept');
            const {username, assistantName, intentName} = req.query;

            const getChipPhrases = async () => {
                let responses = await sqlFunctions.getAllChips(username, assistantName, intentName);
                res.send(responses);
            }
            getChipPhrases();
        });

        app.get('/chip-delete', (req, res) => {

            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, Accept');
            const {
                username,assistantName,intentName,chipValue
            } = req.query;

            const deleteChip = async () => {
                await sqlFunctions.deleteChip(username,assistantName,intentName,chipValue);
                res.send("Deleted")
            }
            deleteChip();
        });

        app.get('/chip-update', (req, res) => {

            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, Accept');
            const {
                username,
                assistantName,
                intentName,
                chipValue,
                previousChipValue
            } = req.query;
            const updateChip = async () => {
                await sqlFunctions.updateChip(username,assistantName,intentName,chipValue,previousChipValue);
                res.send("Updated")
            }
            updateChip();
        });

        //-------------------------------------------------------CARD---------------------------------------------------------------------------------

        app.post('/card', (req, res) => {

            const {
                username,
                assistantName,
                intentName,
                useQuery,
                cardNo,
                cardName,
                cardValue,
                cardColor,
                textColor,
            } = req.query

            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, Accept');



            async function createCard() {
                if (cardName)
                    await sqlFunctions.insertCreateCard(username, assistantName, intentName, useQuery, cardNo, cardName, cardValue);
                let existingCards = await sqlFunctions.getCards(intentName);
                res.send(existingCards);
            }
            createCard();
        });

        app.get('/getcards', (req, res) => {

            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, Accept');
            const {
                intentName
            } = req.query;

            const getCardPhrases = async () => {
                let cards = await sqlFunctions.getCards(intentName);
                let queryCards = await sqlFunctions.getQueryCards(intentName);
                let allCards = cards.concat(queryCards);
                res.send({
                    allCards: allCards
                });
            }
            getCardPhrases();
        });

        app.get('/card-delete', (req, res) => {

            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, Accept');
            const {
                username,assistantName,intentName
            } = req.query;

            const deleteCard = async () => {
                await sqlFunctions.deleteCard();
                res.send("Deleted")
            }
            deleteCard();
        });

        app.get('/card-update', (req, res) => {

            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, Accept');
            const {
                cardName,
                cardValue,
                
            } = req.query;
            const updateCard = async () => {
                await sqlFunctions.updateCard(cardName, cardValue, );
                res.send("Deleted")
            }
            updateCard();
        });

    }
}


module.exports = RichResponse;