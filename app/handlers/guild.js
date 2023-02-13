const logger = require('../common/logger').getLogger('members-handler');
const models = require('../models');
const {
  expToRolesMapping, expConditions,
} = require('../config.js').defaultConfig.default;
const {createGuildRole} = require('../common/discord-api.js');

const addGuild = () => {
  return async (guild) => {
    try {
      logger.info(`New guild ${guild.id} invites bot`);

      // Create the tier roles.
      const guildTiers = [];
      for (
        const [roleName, values] of Object.entries(expToRolesMapping)
      ) {
        const r = await createGuildRole(
            guild.id,
            {name: roleName, color: values.color},
        );
        guildTiers.push({
          id: r.id,
          color: values.color,
          experience: values.experience,
        });
      }

      // Add the guild to database.
      await models.Guild.create({
        id: guild.id,
        expConditions: expConditions,
        tiers: guildTiers,
      }, {
        include: [models.Tier],
      });
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
