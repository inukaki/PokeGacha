
// discord.jsから必要な機能を取得
const { Client, GatewayIntentBits } = require('discord.js');

// config.jsonからトークンを取得
const { token } = require('./config.json');

const client = new Client(
  { intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent
    ]
  }
);

client.login(token);