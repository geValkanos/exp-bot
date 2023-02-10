const {
  addMember, removeMember, addGuild, removeGuild,
} = require('../../app/handlers');
const models = require('../../app/models');

describe('Test join/remove member to server', () => {
  const discordId1 = '123456789';
  const guildId1 = '12345';

  beforeEach(async () => {
    const testGuild1 = new models.Guild({id: guildId1});
    await testGuild1.save();
  });

  afterEach(async () => {
    await models.Guild.destroy({
      where: {id: guildId1},
    });
  });

  test('Add new member to server', async () => {
    await addMember()({
      user: {id: discordId1, username: 'Test'}, guild: {id: guildId1},
    });
    // Check if the user is added on db.
    const user = await models.User.findOne({
      where: {id: discordId1, guildId: guildId1},
    });
    expect(user).not.toBeNull();
  });

  test('Remove member from server', async () => {
    await removeMember()({user: {id: discordId1}, guild: {id: guildId1}});
    // Check if the user is added on db.
    const user = await models.User.findOne({
      where: {id: discordId1, guildId: guildId1},
    });
    expect(user).toBeNull();
  });
});

describe('Test add/remove new server', () => {
  const guildId1 = '12345';

  test('Add new server', async () => {
    await addGuild()({id: guildId1});
    // Check if the user is added on db.
    const guild = await models.Guild.findOne({
      where: {id: guildId1},
    });
    expect(guild).not.toBeNull();
  });

  test('Remove guild from server', async () => {
    await removeGuild()({id: guildId1});
    // Check if the user is added on db.
    const guild = await models.Guild.findOne({
      where: {id: guildId1},
    });
    expect(guild).toBeNull();
  });
});
