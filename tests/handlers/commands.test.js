const {commandExecute} = require('../../app/handlers');

describe('Test command handler', () => {
  jest.mock('../../app/commands', () => {
    return {
      _esModule: true,
      commands: [{
        data: {name: 'testCommand'},
        execute: () => true,
      }],
    };
  });

  test('Successful slash command', async () => {
    const mockedInteraction = {
      isChatInputCommand: () => false,
      commandName: 'testCommand',
      reply: ({}) => true,
    };
    await commandExecute({})(mockedInteraction);
  });
});
