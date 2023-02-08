const logger = require('../common/logger.js').getLogger('ready-handler');
const models = require('../models');

const ready = (client) => {
  return async () => {
    try {
      // Get all guilds the bot is currently in.
      const guilds = client.guilds.cache;
      const gU = guilds.map((guild) => {
        console.log(guild.members);
        const usersInVoiceChannels = {};
        const channelsExpStatuses = {};
        // Get guild's voice channels.
        const channels = guild.channels.cache.filter(
            (channel) => channel.type == 2,
        );
        channels.forEach((voiceChannel) => {
          channelsExpStatuses[voiceChannel.id] = voiceChannel.members.length;
          voiceChannel.members.every((member) => {
            usersInVoiceChannels[member.user.id] = voiceChannel.id;
          });
        });

        return {guild, usersInVoiceChannels, channelsExpStatuses};
      });

      // For every guild initialize voice channels states.
      for ({guild, usersInVoiceChannels, channelsExpStatuses} of gU) {
        const dbUsers = await models.User.findAll({
          where: {guildId: guild.id, isActive: true},
        });
        for (g of dbUsers) {
          g.voiceChannelId = usersInVoiceChannels[g.id];
          g.isOnExpMode = !!g.voiceChannelId &&
           (channelsExpStatuses[g.voiceChannelId] > 1);
        }
        await Promise.all(dbUsers.map((g) => g.save()));
      }
      logger.info('Bot is ready');
    } catch (error) {
      console.log(error);
      logger.error(`Initialization of bot failed with: ${error}`);
    }
  };
};

module.exports = {ready};
