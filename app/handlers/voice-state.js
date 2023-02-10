const models = require('../models');
const logger = require('../common/logger.js').getLogger('voice-state-handler');
const {isOnActiveExpMode} = require('../common/utils.js');
const {config} = require('../config.js');

const voiceStateUpdate = () => {
  return async (_oldState, newState) => {
    try {
      const expConditions = (
        config[newState.guild.id] || config.default
      ).expConditions;
      const user = await models.User.findOne({
        where: {id: newState.id, guildId: newState.guild.id},
      });
      if (user) {
        user.voiceChannelId = newState.channelId;
        user.isOnExpMode = isOnActiveExpMode(user, newState, expConditions);
        await user.save();
      } else {
        // Add the user first.
        const newUser = new models.User({
          id: newState.id,
          guildId: newState.guild.id,
          voiceChannelId: newState.channelId,
        });
        newUser.isOnExpMode = isOnActiveExpMode(
            newUser,
            newState,
            expConditions,
        );
        await newUser.save();
      }
    } catch (error) {
      logger.error(`Failed to update voice state with ${error}`);
    }
  };
};

module.exports = {voiceStateUpdate};
