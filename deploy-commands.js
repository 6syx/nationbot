const { SlashCommandBuilder } = require('@discordjs/builders');
require('dotenv').config()
const builders = require(`@discordjs/builders`)
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const config = require('./config.json')
const fs = require('fs')

const commands = []
const commandFiles = fs.readdirSync('./cmds').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./cmds/${file}`);
	commands.push(command.data.toJSON());
}

const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);

rest.put(Routes.applicationGuildCommands(config.clientid, config.guildid), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);