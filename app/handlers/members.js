const logger = require('../common/logger').getLogger('members-handler');
const models = require('../models');

const addMember = () => {
  return async (member) => {
    try {
      const user = await models.User.findOne({
        id: member.user.id, guildId: member.guild.id,
      });
      if (!user) {
        logger.info(`User ${member.user.username} joins ${member.guild.id}`);
        const newUser = new models.User({
          id: member.user.id,
          guildId: member.guild.id,
        });
        await newUser.save();
      } else if (!user.isActive) {
        logger.info(`User ${member.user.username} re-joins ${member.guild.id}`);
        user.isActive = true;
        await user.save();
      }
    } catch (error) {
      // Handle error
      logger.error(`Member fails to join with: ${error}`);
    }
  };
};

const removeMember = () => {
  return async (member) => {
    try {
      const user = await models.User.findOne({
        where: {
          id: member.user.id,
          guildId: member.guild.id,
        },
      });
      if (user) {
        logger.info(`User ${member.user.username} leaves ${member.guild.id}`);
        user.isActive = false;
        await user.save();
      }
    } catch (error) {
      // Handle error
      logger.info(`Failed to remove user ${member.user.id} from server`);
    }
  };
};

module.exports = {
  addMember,
  removeMember,
};
