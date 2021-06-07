const sqlFunctions = require('../files/sqlFunctions');
const uuid = require('uuid-random');


class RichResponse {

    constructor(app) {
        this.richResponse(app);
    }

    richResponse(app) {

        app.get('/rich-response', (req, res) => {
            let {
                intentId,
            } = req.query

            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, Accept');
            async function getChips() {
                let existingChips = await sqlFunctions.getChips(intentId);
                if (existingChips.length != 0) {
                    res.send(existingChips);
                }

            }
            async function getCards() {
                let existingCards = await sqlFunctions.getCards(intentId);
                if (existingCards.length != 0) {
                    res.send(existingCards);
                }
            }
            getCards();
            getChips();
        });

        app.post('/chip', (req, res) => {

            const {
                userId,
                assistantId,
                intentId,
                chipResponse,
                usingQueries,
            } = req.query

            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, Accept');
            async function createChip() {
                let richResponseId = uuid();
                await sqlFunctions.insertCreateChip(userId, assistantId, intentId, richResponseId, usingQueries, chipResponse);
                let existingChips = await sqlFunctions.getChips(intentId);
                res.send(existingChips);
            }
            createChip();
        });

        app.get('/getchips', (req, res) => {

            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, Accept');
            const {
                intentId
            } = req.query;

            const getChipPhrases = async () => {
                let responses = await sqlFunctions.getAllChips(intentId);
                res.send(responses);
            }
            getChipPhrases();
        });

        app.get('/chip-delete', (req, res) => {

            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, Accept');
            const {
                richResponseId
            } = req.query;

            const deleteChip = async () => {
                await sqlFunctions.deleteChip(richResponseId);
                res.send("Deleted")
            }
            deleteChip();
        });

        app.get('/chip-update', (req, res) => {

            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, Accept');
            const {
                chipResponse,
                richResponseId
            } = req.query;
            const updateChip = async () => {
                await sqlFunctions.updateChip(chipResponse, richResponseId);
                res.send("Updated")
            }
            updateChip();
        });

        //-------------------------------------------------------CARD---------------------------------------------------------------------------------

        app.post('/card', (req, res) => {

            const {
                userId,
                assistantId,
                intentId,
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
                let richResponseId = uuid();
                if (cardName)
                    await sqlFunctions.insertCreateCard(userId, assistantId, intentId, richResponseId, useQuery, cardNo, cardName, cardValue);
                let existingCards = await sqlFunctions.getCards(intentId);
                res.send(existingCards);
            }
            createCard();
        });

        app.get('/getcards', (req, res) => {

            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, Accept');
            const {
                intentId
            } = req.query;

            const getCardPhrases = async () => {
                let cards = await sqlFunctions.getCards(intentId);
                let queryCards = await sqlFunctions.getQueryCards(intentId);
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
                richResponseId
            } = req.query;

            const deleteCard = async () => {
                await sqlFunctions.deleteCard(richResponseId);
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
                richResponseId
            } = req.query;
            const updateCard = async () => {
                await sqlFunctions.updateCard(cardName, cardValue, richResponseId);
                res.send("Deleted")
            }
            updateCard();
        });

    }
}


module.exports = RichResponse;