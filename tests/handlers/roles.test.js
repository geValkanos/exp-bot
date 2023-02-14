const {roleDelete, roleUpdate} = require('../../app/handlers');
const {TestGuild, TestTier} = require('../test-utils');

describe('Test roles update and delete', () => {
  const testGuild1 = new TestGuild('12345');
  const testTier1 = new TestTier('12', '12345');

  beforeEach(async () => {
    await testGuild1.create();
    await testTier1.create();
  });

  afterEach(async () => {
    await testGuild1.delete();
    await testTier1.delete();
  });

  test('Successfully update role', async () => {
    await expect(roleUpdate()({
      id: '12',
      guild: {id: '12345'},
      color: 42,
    })).resolves.toBe(undefined);
    const tier = await testTier1.get();
    expect(tier).not.toBeNull();
  });

  test('Successfully delete role', async () => {
    await expect(roleDelete()({
      id: '12',
      guild: {id: '12345'},
    })).resolves.toBe(undefined);
    const tier = await testTier1.get();
    expect(tier).toBeNull();
  });
});
