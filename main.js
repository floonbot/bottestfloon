const Discord = require("discord.js");
require("dotenv").config();
const loadEvents = require("./handlers/handlersEvents");
const loadCommands = require("./handlers/handlersCommand");
const loadInteractions = require("./handlers/handlersInteractions");

const client = new Discord.Client({
  intents: [
    Discord.GatewayIntentBits.Guilds,
    Discord.GatewayIntentBits.GuildMessages,
    Discord.GatewayIntentBits.MessageContent,
    Discord.GatewayIntentBits.GuildVoiceStates,
  ],
});

loadEvents(client);
loadCommands(client);
loadInteractions(client);

client.login(process.env.TOKEN_DISCORD);
