const CronJob = require('cron').CronJob;
const literal = require('sequelize').literal;

const logger = require('./common/logger.js').getLogger('scheduler');
const models = require('./models');

const job = new CronJob(
    '0 * * * * *',
    async () => {
      try {
        logger.debug('Start adding exp.');
        await models.User.update({
          experience: literal('experience + 1'),
        }, {
          where: {isActive: true, onVoice: true},
        });
      } catch (error) {
        // TODO
        logger.error(`Cronjob failed with ${error}`);
      }
    },
);

module.exports = job;
