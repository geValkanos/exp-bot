const {Op} = require('sequelize');
const {SlashCommandBuilder, EmbedBuilder, roleMention} = require('discord.js');

const logger = require('../common/logger.js').getLogger('info-command');
const {getGuildRoles, getGuildMember} = require('../common/discord-api.js');
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
  execute: () => {
    return async (interaction) => {
      try {
        // Get user's from slash command.
        const discordUser = interaction.options.getUser('user');
        if (discordUser.bot) throw Error('User is a bot');

        // Get user's member info from discord api.
        const member = await getGuildMember(
            interaction.guildId, discordUser.id,
        );

        // Find user's current roles.
        const userRoles = (await getGuildRoles(interaction.guildId)).filter(
            (role) => member.roles.includes(role.id),
        ).map((role) => {
          return roleMention(role.id);
        }).toString();

        const user = await models.User.findOne({
          where: {id: discordUser.id, guildId: interaction.guildId},
          include: [{model: models.Guild, required: true}],
        });

        if (!user) throw Error('User not in database');

        // Find user's tier.
        const tiers = await models.Tier.findAll({
          where: {
            guildId: interaction.guildId,
            experience: {[Op.gte]: user.experience},
          },
          order: [['experience', 'ASC']],
        });
        const tier = tiers.length == 0 && 'No Tier' || roleMention(tiers[0].id);

        let imageUrl = '';
        if (discordUser.avatar) {
          imageUrl = `https://cdn.discordapp.com/avatars/${user.id}/${discordUser.avatar}`;
        } else {
          imageUrl = `https://cdn.discordapp.com/embed/avatars/${(discordUser.discriminator%5)}.png`;
        }

        const response = new EmbedBuilder()
            .setTitle('INFO')
            .setColor(0x0099FF)
            .setAuthor({name: discordUser.username, iconURL: imageUrl})
            .setThumbnail(imageUrl)
            .addFields({
              name: 'Tier', value: `${tier}`, inline: true,
            }, {
              name: 'Experience', value: `${user.experience}`, inline: true,
            })
            .addFields({
              name: 'Roles', value: userRoles, inline: false,
            });
        await interaction.reply({embeds: [response]});
      } catch (error) {
        logger.error(`Failed to execute command info with ${error}`);
        await interaction.reply('I have nothing to say!');
      }
    };
  },
};
