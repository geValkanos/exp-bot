const {Collection} = require('discord.js');
const {ready} = require('../../app/handlers');
const models = require('../../app/models');

describe('Test ready handler', () => {
  const discordId1 = '123456789';
  const discordId2 = '012345678';

  beforeEach(async () => {
    // User on voice channel.
    const testUser1 = new models.User({
      discordId: discordId1, isActive: true, onVoice: false,
    });
    await testUser1.save();
    const testUser2 = new models.User({
      discordId: discordId2, isActive: true, onVoice: true,
    });
    await testUser2.save();
  });

  afterEach(async () => {
    await models.User.destroy({
      where: {discordId: discordId1},
    });
    await models.User.destroy({
      where: {discordId: discordId2},
    });
  });

  test('Test ready handler', async () => {
    const mockedMembers = new Collection();
    mockedMembers.set(discordId1, {user: {id: discordId1}});
    const mockChannels = [{
      members: mockedMembers,
    }, {
      members: new Collection(),
    }];
    const mockedGuilds = {
      channels: {cache: {filter: (fn) => mockChannels}},
    };
    const mockClient = {
      user: {tag: 'Test Bot Name'},
      guilds: {cache: {get: (_arg) => mockedGuilds}},
    };
    await ready(mockClient)();
    const user1 = await models.User.findOne({where: {discordId: discordId1}});
    const user2 = await models.User.findOne({where: {discordId: discordId2}});
    expect(user1.onVoice).toBeTruthy();
    expect(user2.onVoice).toBeFalsy();
  });
});
