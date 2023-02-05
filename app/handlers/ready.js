const Op = require('sequelize').Op;

const logger = require('../common/logger.js').getLogger('ready-handler');
const models = require('../models');

const ready = (client) => {
  return async () => {
    const guilds = client.guilds.cache.get(process.env.GUILD_ID);
    const channels = guilds.channels.cache.filter(
        (channel) => channel.type == 2,
    );
    const usersInVoiceChannels = [];
    channels.forEach((voiceChannel) => {
      voiceChannel.members.every((member) => {
        usersInVoiceChannels.push(parseInt(member.user.id));
      });
    });
    // Update the `onVoice` status.
    await models.User.update({
      onVoice: true,
    }, {
      where: {discordId: {[Op.in]: usersInVoiceChannels}},
    });
    await models.User.update({
      onVoice: false,
    }, {
      where: {discordId: {[Op.notIn]: usersInVoiceChannels}},
    });
    logger.info(`Logged in as ${client.user.tag}!`);
  };
};

module.exports = {ready};
