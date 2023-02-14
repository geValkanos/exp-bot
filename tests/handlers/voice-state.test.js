const {voiceStateUpdate} = require('../../app/handlers');
const {TestGuild, TestUser} = require('../test-utils');

describe('Test voice state update handler', () => {
  const guildId = '12345';
  const userId = '123456789';
  const testUser1 = new TestUser(userId, guildId);
  const testGuild1 = new TestGuild(guildId);

  beforeEach(async () => {
    await testGuild1.create();

    // User not on voice channel.
    await testUser1.create();
  });

  afterEach(async () => {
    await testUser1.delete();
    await testGuild1.delete();
  });

  test('testUser1 enters voice channel', async () => {
    await expect(voiceStateUpdate()({}, {
      id: userId,
      guild: {id: guildId},
      channelId: '123',
      selfMute: false,
      selfDeaf: false,
      serverMute: false,
      serverDeaf: false,
    }))
        .resolves
        .toBe(undefined);
    const user = await testUser1.get();

    expect(user).not.toBeNull();
    expect(user.voiceChannelId).toBe('123');
  });

  test('testUser1 mutes voice channel', async () => {
    await expect(voiceStateUpdate()({}, {
      id: userId,
      guild: {id: guildId},
      channelId: '123',
      selfMute: true,
      selfDeaf: false,
      serverMute: false,
      serverDeaf: false,
    }))
        .resolves
        .toBe(undefined);

    const user = await testUser1.get();
    expect(user).not.toBeNull();
    expect(user.voiceChannelId).toBe('123');
  });

  test('testUser1 leaves voice channel', async () => {
    await expect(voiceStateUpdate()({}, {
      id: userId,
      guild: {id: guildId},
      channelId: null,
      selfMute: false,
      selfDeaf: false,
      serverMute: false,
      serverDeaf: false,
    }))
        .resolves
        .toBe(undefined);

    const user = await testUser1.get();
    expect(user).not.toBeNull();
    expect(user.voiceChannelId).toBeNull();
  });
});

