const Sequelize = require('sequelize');

const user = require('./user.js');
const database = require('../common/database.js');

user(database, Sequelize.DataTypes.postgres);

module.exports = database.models;
