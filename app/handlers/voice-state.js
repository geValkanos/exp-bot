const models = require('../models');
const logger = require('../common/logger.js');

const isOnActiveExpMode = (dbUser, state) => {
  return dbUser.isActive &&
    !!state.channelId &&
    !state.serverDeaf &&
    !state.serverMute &&
    !state.selfMute &&
    !state.selfDeaf;
};

const voiceStateUpdate = () => {
  return async (_oldState, newState) => {
    try {
      const user = await models.User.findOne({
        where: {id: newState.id, guildId: newState.guild.id},
      });
      if (user) {
        user.voiceChannelId = newState.channelId;
        user.isOnExpMode = isOnActiveExpMode(user, newState);
        await user.save();
      } else {
        // Add the user first.
        const newUser = new models.User({
          id: newState.id,
          guildId: newState.guild.id,
          voiceChannelId: newState.channelId,
        });
        newUser.isOnExpMode = isOnActiveExpMode(newUser, newState);
        await newUser.save();
      }
    } catch (error) {
      logger.error(`Failed to update voice state with ${error}`);
    }
  };
};

module.exports = {voiceStateUpdate};
