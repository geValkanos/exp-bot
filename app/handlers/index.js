const command = require('./commands.js');
const members = require('./members.js');
const ready = require('./ready.js');
const voiceStateUpdate = require('./voice-state.js');

module.exports = {
  ...ready,
  ...voiceStateUpdate,
  ...members,
  ...command,
};
