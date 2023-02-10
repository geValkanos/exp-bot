const logger = require('../common/logger').getLogger('members-handler');
const models = require('../models');
const {setNewGuildConfig, deleteGuildConfig} = require('../config.js');

const addGuild = () => {
  return async (guild) => {
    try {
      logger.info(`New guild ${guild.id} invites bot`);
      const newGuild = new models.Guild({id: guild.id});
      await newGuild.save();
      await setNewGuildConfig(guild.id);
    } catch (error) {
      logger.error(`Failed to add ${guild.id} with ${error}`);
    }
  };
};

const removeGuild = () => {
  return async (guild) => {
    try {
      // TODO: delete config.json for the guild
      logger.info(`Remove guild ${guild.id} invites bot`);
      await models.Guild.destroy({
        where: {id: guild.id},
      });
      await deleteGuildConfig();
    } catch (error) {
      logger.error(`Failed to remove ${guild.id} with ${error}`);
    }
  };
};

const addMember = () => {
  return async (member) => {
    try {
      const user = await models.User.findOne({
        where: {
          id: member.user.id, guildId: member.guild.id,
        },
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
      throw error;
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
  addGuild,
  removeGuild,
};
