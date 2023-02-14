const {REST, Routes} = require('discord.js');
const logger = require('./logger.js').getLogger(
    'discord-api',
);

// Construct and prepare an instance of the REST module
const rest = new REST({version: '10'}).setToken(process.env.TOKEN);

/**
 * Creates a role for a guild.
 * @async
 * @param {string} guildId - The ID of the guild you want to create a role.
 * @param {object} role - Object with discord role attributes
 * @param {string} role.name - The name of the new role.
 * @param {number} role.color - The integer code of color, by discord docs.
 * @return {object} The role object from discord api.
 */
const createGuildRole = async (guildId, role) => {
  try {
    logger.info(
        `For guild ${guildId} create role ${role.name}`,
    );

    return await rest.post(
        Routes.guildRoles(guildId),
        {body: role},
    );
  } catch (error) {
    logger.error(`Faile to create role with: ${error}`);
  }
};

const getGuildRoles = async (guildId) => {
  try {
    logger.info(
        `Fetch roles for guild ${guildId}`,
    );

    return await rest.get(
        Routes.guildRoles(guildId),
        {params: {limit: 1000, offset: 0}},
    );
  } catch (error) {
    logger.error(`Fetching roles failed with: ${error}`);
  }
};

const getGuildMember = async (guildId, userId) => {
  try {
    logger.info(
        `Fetch roles for guild ${guildId}`,
    );

    return await rest.get(
        Routes.guildMember(guildId, userId),
    );
  } catch (error) {
    logger.error(`Fetching roles failed with: ${error}`);
  }
};

module.exports = {
  createGuildRole,
  getGuildRoles,
  getGuildMember,
};
