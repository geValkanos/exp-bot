const {REST, Routes} = require('discord.js');
const {commands}= require('./app/commands');
const logger = require('./app/common/logger.js').getLogger('deploy-commands');
const commandsToJson = [];

for (const command of commands) {
  commandsToJson.push(command.data.toJSON());
}

// Construct and prepare an instance of the REST module
const rest = new REST({version: '10'}).setToken(process.env.TOKEN);

// and deploy your commands!
(async () => {
  try {
    logger.info(
        `Started refreshing ${commandsToJson.length} application (/) commands.`,
    );

    await rest.put(
        Routes.applicationGuildCommands(
            process.env.CLIENT_ID, process.env.GUILD_ID,
        ),
        {body: commandsToJson},
    );
  } catch (error) {
    // And of course, make sure you catch and log any errors!
    logger.error(`Commands deployment failed with: ${error}`);
  }
})();
