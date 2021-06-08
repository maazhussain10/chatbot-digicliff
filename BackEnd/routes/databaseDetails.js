const sqlFunctions = require('../files/sqlFunctions');


class KnowledgeStore {

    constructor(app) {
        this.databaseDetails(app);
    }

    databaseDetails(app) {

        app.post('/addDatabaseDetails', (req, res) => {

            let { userId, assistantId, username, password, databaseName } = req.query;
            console.log(username, password, databaseName);

            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, Accept');

            sqlFunctions.addDatabaseDetails(userId, assistantId, username, password, databaseName);

        });
    }
}


module.exports = KnowledgeStore;