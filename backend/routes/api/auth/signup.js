const signupRoute = require('express').Router();
const { UniqueConstraintError } = require('sequelize');
const bcrypt = require('bcrypt');
const db = require('../../../models');

signupRoute.post('/', async (req, res) => {
    let { firstName, lastName, email, username, password } = req.body;

    // Create a user with the given credentials
    try {
        password = await bcrypt.hash(password, 10);
        await db.User.create({ firstName, lastName, email, username, password });
        res.sendStatus(201);
    }
    catch (err) {
        if (err instanceof UniqueConstraintError) {
            let { type: errorType } = err.errors[0];
            let errorField = Object.keys(err.fields)[0];
            if (errorType === 'unique violation')
                res.status(409).json({ errorField })
        } else {
            res.status(500).send(err);
        }
    }

});


module.exports = signupRoute;