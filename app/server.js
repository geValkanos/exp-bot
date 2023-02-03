const {Client, GatewayIntentBits, Events} = require('discord.js');

require('./models');
const handlers = require('./handlers');
const scheduler = require('./scheduler.js');
const logger = require('./common/logger.js').getLogger('server');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMembers,
  ],
});

client.on('ready', handlers.ready(client));

client.on(Events.VoiceStateUpdate, handlers.voiceStateUpdate());

client.on(Events.GuildMemberAdd, handlers.addMember());
client.on(Events.GuildMemberRemove, handlers.removeMember());

client.on(Events.InteractionCreate, handlers.commandExecute(client));

client.login(process.env.TOKEN);

scheduler.start();


logger.info('Server is running');
