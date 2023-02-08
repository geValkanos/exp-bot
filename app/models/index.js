const Sequelize = require('sequelize');

const guild = require('./guild.js');
const user = require('./user.js');
const database = require('../common/database.js');

guild(database, Sequelize.DataTypes.postgres);
user(database, Sequelize.DataTypes.postgres);

Object.values(database.models).forEach((model) => {
  model.createAssociations(database.models);
});

module.exports = database.models;
