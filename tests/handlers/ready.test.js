const {Collection} = require('discord.js');
const {ready} = require('../../app/handlers');
const models = require('../../app/models');

describe('Test ready handler', () => {
  const discordId1 = '123456789';
  const discordId2 = '012345678';
  const guildId1 = '12345';
  const guildId2 = '23456';

  beforeEach(async () => {
    // Create guilds.
    const testGuild1 = new models.Guild({id: guildId1});
    await testGuild1.save();
    const testGuild2 = new models.Guild({id: guildId2});
    await testGuild2.save();

    // Add users on guilds.
    await (new models.User({guildId: guildId1, id: discordId1})).save();
    await (new models.User({guildId: guildId2, id: discordId1})).save();
    await (new models.User({guildId: guildId1, id: discordId2})).save();
  });

  afterEach(async () => {
    await models.Guild.destroy({
      where: {id: guildId1},
    });
    await models.Guild.destroy({
      where: {id: guildId2},
    });
  });

  test('Test ready handler', async () => {
    const mockedMembers = new Collection();
    mockedMembers.set(discordId1, {user: {id: discordId1}});
    const mockChannels = [{
      members: mockedMembers,
      id: '9494',
    }, {
      members: new Collection(),
      id: '9595',
    }];
    const mockedGuilds = new Collection();
    mockedGuilds.set(guildId1, {
      id: guildId1,
      channels: {cache: {filter: (fn) => mockChannels}},
    });
    mockedGuilds.set(guildId2, {
      id: guildId2,
      channels: {cache: {filter: (fn) => []}},
    });
    const mockClient = {
      user: {tag: 'Test Bot Name'},
      guilds: {cache: mockedGuilds},
    };
    await ready(mockClient)();
    // User1, Guild1
    const user11 = await models.User.findOne({
      where: {id: discordId1, guildId: guildId1},
    });
    expect(user11.voiceChannelId).toBe('9494');
    expect(user11.isOnExpMode).toBeFalsy();

    // User1, Guild2
    const user12 = await models.User.findOne({
      where: {id: discordId1, guildId: guildId2},
    });
    expect(user12.voiceChannelId).toBeNull();

    // User2, Guild1
    const user21 = await models.User.findOne({
      where: {id: discordId2, guildId: guildId1},
    });
    expect(user21.voiceChannelId).toBeNull();
  });
});
