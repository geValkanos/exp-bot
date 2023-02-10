const {SlashCommandBuilder} = require('discord.js');

const logger = require('../common/logger.js').getLogger(
    'exp-conditions-command',
);

module.exports = {
  data: new SlashCommandBuilder()
      .setName('edit-exp-settings')
      .setDescription('Edit what voice states count as `exp eligible`.')
      .addSubcommand((subcommand) => {
        return subcommand
            .setName('self-mute')
            .setDescription('How self mute affects exp earning')
            .addIntegerOption((option) => {
              return option
                  .setName('value')
                  .setDescription('Either `muted`, `not-muted`, `both`')
                  .setRequired(true)
                  .addChoices(
                      {name: 'muted', value: 0},
                      {name: 'not-muted', value: 1},
                      {name: 'both', value: 2},
                  );
            });
      })
      .addSubcommand((subcommand) => {
        return subcommand
            .setName('self-deaf')
            .setDescription('How self deaf affects exp earning')
            .addIntegerOption((option) => {
              return option
                  .setName('value')
                  .setDescription('Either `deaf`, `not-deaf`, `both`')
                  .setRequired(true)
                  .addChoices(
                      {name: 'deaf', value: 0},
                      {name: 'not-deaf', value: 1},
                      {name: 'both', value: 2},
                  );
            });
      }),
  execute: (config) => {
    return async (interaction) => {
      try {
        const newExpConditions = {};
        const value = interaction.options.getInteger('value');
        switch (interaction.options.getSubcommand()) {
          case 'self-mute':
            logger.info('self-mute');
            newExpConditions.selfMute = value;
            break;
          case 'self-deaf':
            logger.info('self-deaf');
            newExpConditions.selfDeaf = value;
            break;
          case 'server-mute':
            logger.info('server-mute');
            newExpConditions.serverMute = value;
            break;
          case 'server-deaf':
            logger.info('server-deaf');
            newExpConditions.serverDeaf = value;
            break;
          case 'suppress':
            logger.info('suppress');
            newExpConditions.suppress = value;
            break;
          case 'default':
            break;
        }
        await config.editExpConditions(interaction.guildId, newExpConditions);
        await interaction.reply('Exp conditions updated successfully');
      } catch (error) {
        logger.error(`Failed to execute command info with ${error}`);
        await interaction.reply('I have nothing to say!');
      }
    };
  },
};
