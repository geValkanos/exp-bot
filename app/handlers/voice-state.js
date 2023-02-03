const models = require('../models');
const logger = require('../common/logger.js');

const isOnActiveExpMode = (discordUser, state) => {
  return discordUser.isActive &&
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
        where: {discordId: newState.id},
      });

      if (user) {
        user.onVoice = isOnActiveExpMode(user, newState);
        await user.save();
      }
    } catch (error) {
      logger.error(`Failed to update voice state with ${error}`);
    }
  };
};

module.exports = {voiceStateUpdate};
