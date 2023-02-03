const {voiceStateUpdate} = require('../../app/handlers');
const models = require('../../app/models');

describe('Test voice state update handler', () => {
  const discordId1 = '123456789';

  beforeEach(async () => {
    // User not on voice channel.
    const testUser1 = new models.User({
      discordId: discordId1, isActive: true, onVoice: false,
    });
    await testUser1.save();
  });

  afterEach(async () => {
    await models.User.destroy({
      where: {discordId: discordId1},
    });
  });

  test('testUser1 enters voice channel', async () => {
    await expect(voiceStateUpdate()({}, {
      id: discordId1,
      channelId: '123',
      selfMute: false,
      selfDeaf: false,
      serverMute: false,
      serverDeaf: false,
    }))
        .resolves
        .toBe(undefined);
    const user = await models.User.findOne({where: {discordId: discordId1}});
    expect(user).not.toBeNull;
    expect(user.onVoice).toBeTruthy;
  });

  test('testUser1 mutes voice channel', async () => {
    await expect(voiceStateUpdate()({}, {
      id: discordId1,
      channelId: '123',
      selfMute: true,
      selfDeaf: false,
      serverMute: false,
      serverDeaf: false,
    }))
        .resolves
        .toBe(undefined);
    const user = await models.User.findOne({where: {discordId: discordId1}});
    expect(user).not.toBeNull;
    expect(user.onVoice).toBeFalsy;
  });

  test('testUser1 leaves voice channel', async () => {
    await expect(voiceStateUpdate()({}, {
      id: discordId1,
      channelId: null,
      selfMute: false,
      selfDeaf: false,
      serverMute: false,
      serverDeaf: false,
    }))
        .resolves
        .toBe(undefined);
    const user = await models.User.findOne({where: {discordId: discordId1}});
    expect(user).not.toBeNull;
    expect(user.onVoice).toBeFalsy;
  });
});

