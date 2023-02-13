// Mock call to discord-api.
jest.mock('../../app/common/discord-api.js', () => {
  let _id = 42;
  return {
    _esModule: true,
    createGuildRole: (_g, _r) => {
      _id += 1;
      return {id: _id};
    },
  };
});

const models = require('../../app/models');
const {
  addMember, removeMember, addGuild, removeGuild,
} = require('../../app/handlers');
const {TestGuild} = require('../test-utils');

describe('Test join/remove member to server', () => {
  const discordId1 = '123456789';
  const testGuild1 = new TestGuild('12345');

  beforeEach(async () => {
    await testGuild1.create();
  });

  afterEach(async () => {
    await testGuild1.delete();
  });

  test('Add new member to server', async () => {
    await addMember()({
      user: {id: discordId1, username: 'Test'}, guild: {id: testGuild1.id},
    });
    // Check if the user is added on db.
    const user = await models.User.findOne({
      where: {id: discordId1, guildId: testGuild1.id},
    });
    expect(user).not.toBeNull();
  });

  test('Remove member from server', async () => {
    await removeMember()({user: {id: discordId1}, guild: {id: testGuild1.id}});
    // Check if the user is added on db.
    const user = await models.User.findOne({
      where: {id: discordId1, guildId: testGuild1.id},
    });
    expect(user).toBeNull();
  });
});

describe('Test add/remove new server', () => {
  const guildId = '12345';

  test('Add new server', async () => {
    await addGuild()({id: guildId});
    // Check if the user is added on db.
    const guild = await models.Guild.findOne({
      where: {id: guildId},
    });
    expect(guild).not.toBeNull();
  });

  test('Remove guild from server', async () => {
    await removeGuild()({id: guildId});
    // Check if the user is removed from db.
    const guild = await models.Guild.findOne({
      where: {id: guildId},
    });
    expect(guild).toBeNull();
  });
});
