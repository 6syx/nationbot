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
	if (command.category.toLowerCase() == "ranking") {
		if (config.ranking.enabled == true) {
			let numberopt = new builders.SlashCommandNumberOption()
				.setName('group')
				.setDescription('Group you want to manage.')
				.setRequired(true)
			Object.entries(config.ranking.keys).forEach(([key, value]) => {
				numberopt.addChoices({name: key, value: value})
			})
			command.data.addNumberOption(numberopt)
			commands.push(command.data.toJSON());
		}
	} else if (command.category.toLowerCase() == "immigration") {
		if (config.immigration.enabled == true) {
			commands.push(command.data.toJSON());
		}
	} else if (command.category.toLowerCase() == "distinguished") {
		if (config.immigration.settings.distinguishment.enabled == true) {
			commands.push(command.data.toJSON());
		}
	} else if (command.category.toLowerCase() == 'other') {
		commands.push(command.data.toJSON());
	} else if (command.category.toLowerCase() == 'ssu') {
		if (config.ssu.enabled == true) {
			let gameopt = new builders.SlashCommandStringOption()
				.setName('game')
				.setDescription('Game to host the SSU on.')
				.setRequired(true)
			Object.entries(config.ssu.games).forEach(([key, value]) => {
				gameopt.addChoices({name: key, value: value})
			})
			commands.push(command.data.toJSON());
		}
	}
}

const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);

rest.put(Routes.applicationCommands(config.clientid), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);
