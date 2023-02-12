const CronJob = require('cron').CronJob;
const {literal, Op} = require('sequelize');
const logger = require('./common/logger.js').getLogger('scheduler');
const models = require('./models');

const job = new CronJob(
    '0 * * * * *',
    async () => {
      try {
        const guildsAndChannels = await models.User.findAll({
          attributes: [
            'guildId',
            'voiceChannelId',
            [literal('count(\'*\')'), 'count'],
          ],
          where: {voiceChannelId: {[Op.ne]: null}, isOnExpMode: true},
          group: ['guildId', 'voiceChannelId'],
        });
        for ({dataValues} of guildsAndChannels) {
          if (dataValues.count >= 2) {
            await models.User.update({
              experience: literal('experience + 1'),
            }, {
              where: {
                isActive: true, isOnExpMode: true,
                voiceChannelId: dataValues.voiceChannelId,
                guildId: dataValues.guildId,
              },
            });
          }
        }
      } catch (error) {
        logger.error(`Cronjob failed with ${error}`);
      }
    },
);

module.exports = job;
