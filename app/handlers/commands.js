const {Collection} = require('discord.js');
const logger = require('../common/logger.js').getLogger('command-execute');
const {commands} = require('../commands');

const commandExecute = (client) => {
  client.commands = new Collection();
  for (command of commands) {
    client.commands.set(command.data.name, command);
  }

  return async (interaction) => {
    try {
      if (!interaction.isChatInputCommand()) return;

      logger.info(`Try to execute command ${interaction.commandName}`);

      const command = client.commands.get(interaction.commandName);
      await command.execute()(interaction);

      logger.info(`Command ${interaction.commandName} successfully executed`);
    } catch (error) {
      logger.error(`Command execution failed with: ${error}`);
      await interaction.reply({
        content: 'There was an error while executing this command!',
        ephemeral: true,
      });
    }
  };
};

module.exports = {commandExecute};
