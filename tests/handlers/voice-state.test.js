const {voiceStateUpdate} = require('../../app/handlers');
const models = require('../../app/models');

describe('Test voice state update handler', () => {
  const discordId1 = '123456789';
  const guildId1 = '12345';

  beforeEach(async () => {
    // User not on voice channel.
    const testGuild1 = new models.Guild({id: guildId1});
    await testGuild1.save();
    const testUser1 = new models.User({
      id: discordId1, isActive: true, isOnExpMode: false,
      guildId: guildId1,
    });
    await testUser1.save();
  });

  afterEach(async () => {
    await models.User.destroy({
      where: {id: discordId1, guildId: guildId1},
    });
    await models.Guild.destroy({
      where: {id: guildId1},
    });
  });

  test('testUser1 enters voice channel', async () => {
    await expect(voiceStateUpdate()({}, {
      id: discordId1,
      guild: {id: guildId1},
      channelId: '123',
      selfMute: false,
      selfDeaf: false,
      serverMute: false,
      serverDeaf: false,
    }))
        .resolves
        .toBe(undefined);
    const user = await models.User.findOne({
      where: {id: discordId1, guildId: guildId1},
    });
    console.log(user);
    expect(user).not.toBeNull;
    expect(user.onVoice).toBeTruthy;
  });

  test('testUser1 mutes voice channel', async () => {
    await expect(voiceStateUpdate()({}, {
      id: discordId1,
      guild: {id: guildId1},
      channelId: '123',
      selfMute: true,
      selfDeaf: false,
      serverMute: false,
      serverDeaf: false,
    }))
        .resolves
        .toBe(undefined);
    const user = await models.User.findOne({
      where: {id: discordId1, guildId: guildId1},
    });
    expect(user).not.toBeNull;
    expect(user.onVoice).toBeFalsy();
  });

  test('testUser1 leaves voice channel', async () => {
    await expect(voiceStateUpdate()({}, {
      id: discordId1,
      guild: {id: guildId1},
      channelId: null,
      selfMute: false,
      selfDeaf: false,
      serverMute: false,
      serverDeaf: false,
    }))
        .resolves
        .toBe(undefined);
    const user = await models.User.findOne({
      where: {id: discordId1, guildId: guildId1},
    });
    expect(user).not.toBeNull;
    expect(user.onVoice).toBeFalsy();
  });
});

