const {voiceStateUpdate} = require('../../app/handlers');
const {TestGuild, TestUser} = require('../test-utils');

describe('Test voice state update handler', () => {
  const testUser1 = new TestUser('123456789', '12345');
  const testGuild1 = new TestGuild('12345');

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
      id: testUser1.id,
      guild: {id: testGuild1.id},
      channelId: '123',
      selfMute: false,
      selfDeaf: false,
      serverMute: false,
      serverDeaf: false,
    }))
        .resolves
        .toBe(undefined);
    const user = await testUser1.get();

    expect(user).not.toBeNull;
    expect(user.onVoice).toBeTruthy;
  });

  test('testUser1 mutes voice channel', async () => {
    await expect(voiceStateUpdate()({}, {
      id: testUser1.id,
      guild: {id: testGuild1.id},
      channelId: '123',
      selfMute: true,
      selfDeaf: false,
      serverMute: false,
      serverDeaf: false,
    }))
        .resolves
        .toBe(undefined);

    const user = await testUser1.get();
    expect(user).not.toBeNull;
    expect(user.onVoice).toBeFalsy();
  });

  test('testUser1 leaves voice channel', async () => {
    await expect(voiceStateUpdate()({}, {
      id: testUser1.id,
      guild: {id: testGuild1.id},
      channelId: null,
      selfMute: false,
      selfDeaf: false,
      serverMute: false,
      serverDeaf: false,
    }))
        .resolves
        .toBe(undefined);

    const user = await testUser1.get();
    expect(user).not.toBeNull;
    expect(user.onVoice).toBeFalsy();
  });
});

