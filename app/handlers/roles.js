const logger = require('../common/logger').getLogger('roles-handler');
const models = require('../models');

const roleUpdate = () => {
  return async (role) => {
    try {
      const tier = await models.Tier.findOne({
        where: {id: role.id, guildId: role.guild.id},
      });
      if (tier) {
        tier.color = role.color;
        await tier.save();
      }
    } catch (error) {
      logger.error(`Failed to update role with: ${error}`);
    }
  };
};

const roleDelete = () => {
  return async (role) => {
    try {
      await models.Tier.destroy({
        where: {id: role.id, guildId: role.guild.id},
      });
    } catch (error) {
      logger.error(`Failed to update role with: ${error}`);
    }
  };
};

module.exports = {
  roleDelete,
  roleUpdate,
};
