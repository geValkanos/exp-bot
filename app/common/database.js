const Sequelize = require('sequelize');

const logger = require('../common/logger.js').getLogger('DB');

const dbUrl = `postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.DATABASE_HOST}/${process.env.POSTGRES_DB}`;
console.log(dbUrl);
const database = new Sequelize(dbUrl, {
  benchmark: true,
  logging: (sql, duration, _sequelize) => {
    return logger.debug(`[${ duration }ms] ${ sql }`);
  },
  operatorsAliases: Sequelize.Op,
  timezone: 'UTC',
});

module.exports = database;
