const {ready} = require('../../app/handlers');

test('Test ready handler', async () => {
  const mockClient = {user: {tag: 'Test Bot Name'}};
  await expect(ready(mockClient)()).resolves.toBeUndefined;
});
