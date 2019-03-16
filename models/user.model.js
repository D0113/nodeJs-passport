const db = require('../db');
const sequelize = require('sequelize');
//define mappings between a model and a table
const user = db.define('user', {
    username: sequelize.STRING,
    password: sequelize.STRING
});

module.exports = user;