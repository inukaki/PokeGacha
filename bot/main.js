
// discord.jsから必要な機能を取得
const { Client, GatewayIntentBits } = require('discord.js');

// config.jsonからトークンを取得
const { token } = require('./config.json');

const { readyEvents } = require('./events/ready.js');
const { interactionCreateEvents } = require('./events/interactionCreate.js');
const { guildCreateEvents } = require('./events/guildCreate.js');

const client = new Client(
  { intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent
    ]
  }
);

readyEvents(client);
interactionCreateEvents(client);
guildCreateEvents(client);
client.login(token);