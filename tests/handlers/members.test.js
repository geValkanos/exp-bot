const {addMember, removeMember} = require('../../app/handlers');
const models = require('../../app/models');

describe('Test join/remove member to server', () => {
  const discordId1 = '123456789';
  const guildId1 = '12345';

  test('Add new member to server', async () => {
    await addMember()({user: {id: discordId1}, guild: {id: guildId1}});
    // Check if the user is added on db.
    const user = await models.User.findOne({
      where: {id: discordId1, guildId: guildId1},
    });
    expect(user).not.toBeNull;
  });

  test('Remove member from server', async () => {
    await removeMember()({user: {id: discordId1}, guild: {id: guildId1}});
    // Check if the user is added on db.
    const user = await models.User.findOne({
      where: {id: discordId1, guildId: guildId1},
    });
    expect(user).toBeNull;
  });
});
