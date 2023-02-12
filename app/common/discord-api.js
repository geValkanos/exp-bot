const {REST, Routes} = require('discord.js');
const logger = require('./logger.js').getLogger(
    'get-roles-discord-api',
);

// Construct and prepare an instance of the REST module
const rest = new REST({version: '10'}).setToken(process.env.TOKEN);

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
    // And of course, make sure you catch and log any errors!
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
    // And of course, make sure you catch and log any errors!
    logger.error(`Fetching roles failed with: ${error}`);
  }
};

module.exports = {
  getGuildRoles,
  getGuildMember,
};
