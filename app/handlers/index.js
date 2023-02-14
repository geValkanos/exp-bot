const command = require('./commands.js');
const guild = require('./guild.js');
const ready = require('./ready.js');
const roles = require('./roles.js');
const voiceStateUpdate = require('./voice-state.js');

module.exports = {
  ...ready,
  ...roles,
  ...voiceStateUpdate,
  ...guild,
  ...command,
};
