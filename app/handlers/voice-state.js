const models = require('../models');
const logger = require('../common/logger.js').getLogger('voice-state-handler');
const {isOnActiveExpMode} = require('../common/utils.js');

const voiceStateUpdate = () => {
  return async (_oldState, newState) => {
    try {
      // Get the guild of the channel.
      const guild = await models.Guild.findOne({
        where: {id: newState.guild.id},
      });
      if (!guild) throw new Error(`Guild ${newState.guild.id} not found`);
      console.log(guild);
      // Find the user in the guild, and change its voice status.
      const user = await models.User.findOne({
        where: {id: newState.id, guildId: newState.guild.id},
      });

      if (user) {
        user.voiceChannelId = newState.channelId;
        user.isOnExpMode = isOnActiveExpMode(
            user, newState, guild.expConditions,
        );
        await user.save();
      } else {
        // If it is the first time, add the user in the guild.
        const newUser = new models.User({
          id: newState.id,
          guildId: newState.guild.id,
          voiceChannelId: newState.channelId,
        });
        newUser.isOnExpMode = isOnActiveExpMode(
            newUser,
            newState,
            guild.expConditions,
        );
        await newUser.save();
      }
    } catch (error) {
      logger.error(`Failed to update voice state with ${error}`);
    }
  };
};

module.exports = {voiceStateUpdate};
