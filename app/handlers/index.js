const command = require('./commands.js');
const guild = require('./guild.js');
const ready = require('./ready.js');
const voiceStateUpdate = require('./voice-state.js');

module.exports = {
  ...ready,
  ...voiceStateUpdate,
  ...guild,
  ...command,
};
