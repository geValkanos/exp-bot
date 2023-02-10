const {Client, GatewayIntentBits, Events} = require('discord.js');

require('./models');
const handlers = require('./handlers');
const scheduler = require('./scheduler.js');
const logger = require('./common/logger.js').getLogger('server');
const {loadConfig} = require('./config.js');

const loadedConfig = loadConfig();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMembers,
  ],
});

client.on('ready', handlers.ready());

client.on(Events.VoiceStateUpdate, handlers.voiceStateUpdate(loadedConfig));

client.on(Events.GuildCreate, handlers.addGuild());
client.on(Events.GuildDelete, handlers.removeGuild());
client.on(Events.GuildMemberAdd, handlers.addMember());
client.on(Events.GuildMemberRemove, handlers.removeMember());

client.on(
    Events.InteractionCreate, handlers.commandExecute(client, loadedConfig),
);

client.login(process.env.TOKEN);

scheduler.start();


logger.info('Server is running');
