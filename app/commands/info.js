const {SlashCommandBuilder, EmbedBuilder} = require('discord.js');

const logger = require('../common/logger.js').getLogger('info-command');
const models = require('../models');

module.exports = {
  data: new SlashCommandBuilder()
      .setName('info')
      .setDescription('Replies with users info!')
      .addUserOption((option) => {
        return option
            .setName('user')
            .setDescription('The member to give info')
            .setRequired(true);
      }),
  execute: (_config) => {
    return async (interaction) => {
      try {
        const discordUser = interaction.options.getUser('user');

        if (discordUser.bot) throw Error('User is a bot');

        const user = await models.User.findOne({
          where: {id: discordUser.id, guildId: interaction.guildId},
        });

        if (!user) throw Error('User not in database');
        let imageUrl = '';
        if (discordUser.avatar) {
          imageUrl = `https://cdn.discordapp.com/avatars/${user.id}/${discordUser.avatar}`;
        } else {
          imageUrl = `https://cdn.discordapp.com/embed/avatars/${(discordUser.discriminator%5)}.png`;
        }
        const response = new EmbedBuilder()
            .setColor(0x0099FF)
            .setAuthor({name: discordUser.username, iconURL: imageUrl})
            .setThumbnail(imageUrl)
            .setTitle('INFO')
            .addFields({
              name: 'Experience', value: `${user.experience}`,
            });
        await interaction.reply({embeds: [response]});
      } catch (error) {
        logger.error(`Failed to execute command info with ${error}`);
        await interaction.reply('I have nothing to say!');
      }
    };
  },
};
