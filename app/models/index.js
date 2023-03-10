const Sequelize = require('sequelize');

const guild = require('./guild.js');
const user = require('./user.js');
const tier = require('./tier.js');
const database = require('../common/database.js');

guild(database, Sequelize.DataTypes);
user(database, Sequelize.DataTypes);
tier(database, Sequelize.DataTypes);

Object.values(database.models).forEach((model) => {
  model.createAssociations(database.models);
});

module.exports = database.models;
