require('dotenv').config()
const discord = require('discord.js')
const client = new discord.Client({ intents: [discord.Intents.FLAGS.GUILDS, discord.Intents.FLAGS.GUILD_MEMBERS] })
const roblox = require('noblox.js')
const fs = require('fs')
const commandFiles = fs.readdirSync('./cmds').filter(file => file.endsWith('.js'));
const config = require('./config.json')

client.commands = new discord.Collection()

for (const file of commandFiles) {
	const command = require(`./cmds/${file}`);
	// Set a new item in the Collection
	// With the key as the command name and the value as the exported module
	client.commands.set(command.data.name, command);
}

client.once('ready', async () => {
	let userinfo = await roblox.getCurrentUser()
	console.log(userinfo)
    console.log(`Logged in as:\n\nDiscord: ${client.user.tag} (${client.user.id})\nRoblox: ${userinfo.UserName} (${userinfo.UserID})`)
	client.guilds.cache.get(config.guildid).members.fetch()
})

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
})

setInterval(async () => {
	if (config.immigration.enabled == true) {
	  let failedcheck = false
	  let blacklistedgroups1 = 0
	  let blacklistedgroups = config.immigration.blacklistedgroups
	  let blacklistedusers = config.immigration.blacklistedusers
	  const immigrants = await roblox.getPlayers(config.groupid, config.immigration.immigrationoffice)
	  for (i = 0; i < immigrants.length; i++) {
		blacklistedgroups1 = 0
		const userGroups = await roblox.getGroups(immigrants[i].userId)
		for (f = 0; f < userGroups.length; f++) {
		  for (l = 0; l < blacklistedgroups.length; l++) {
			if (blacklistedgroups[l] == userGroups[f].Id) {
			  failedcheck = true
			  blacklistedgroups1 += 1
			}
		  }
		}
		for (f = 0; f < blacklistedusers.length; f++) {
		  if (blacklistedusers[f] == immigrants[i].userId) {
			await roblox.setRank(config.groupid, immigrants[i].userId, Number(config.immigration.failrank))
			let iEmbed = new discord.MessageEmbed()
			  .setTitle('Fail')
			  .setColor('RED')
			  .setDescription(`${immigrants[i].username} is a blacklisted user and has been successfully detained.`)
			  .setThumbnail(`https://www.roblox.com/headshot-thumbnail/image?userId=${immigrants[i].userId}&width=420&height=420&format=png`)
			client.channels.cache.get(config.immigration.logchannel).send(iEmbed)
			return
		  }
		}
		const player = await roblox.getPlayerInfo(immigrants[i].userId)
		if (player.age <= config.immigration.agelimit) {
			await roblox.setRank(config.groupid, immigrants[i].userId, config.immigration.failrank)
			let iEmbed = new discord.MessageEmbed()
			  .setTitle('Fail')
			  .setColor('RED')
			  .setDescription(`${immigrants[i].username} is underage and has been detained.`)
			  .setThumbnail(`https://www.roblox.com/headshot-thumbnail/image?userId=${immigrants[i].userId}&width=420&height=420&format=png`)
			client.channels.cache.get(config.immigration.logchannel).send(iEmbed)
			return
		}
		if (config.immigration.un.enabled == true) {
		  if (await roblox.getRankInGroup(config.immigration.un.group, immigrants[i].userId) >= config.immigration.un.unrank) {
			await roblox.setRank(config.groupid, immigrants[i].userId, Number(config.immigration.un.reprank))
			let iEmbed = new discord.MessageEmbed()
			  .setTitle('Success')
			  .setColor('GREEN')
			  .setDescription(`${immigrants[i].username} was found as a representative from the United Nations and has been ranked to Foreign Representative.`)
			  .setThumbnail(`https://www.roblox.com/headshot-thumbnail/image?userId=${immigrants[i].userId}&width=420&height=420&format=png`)
			client.channels.cache.get(config.immigration.logchannel).send(iEmbed)
			return
		  }
		}
		if (failedcheck == true) {
		  await roblox.setRank(config.groupid, immigrants[i].userId, Number(config.immigration.failrank)).catch(err => {
			console.log(err)
		  })
		  let iEmbed = new discord.MessageEmbed()
			.setTitle('Fail')
			.setColor('RED')
			.setDescription(`${immigrants[i].username} was caught in ${blacklistedgroups1} blacklisted groups and successfully detained.`)
			.setThumbnail(`https://www.roblox.com/headshot-thumbnail/image?userId=${immigrants[i].userId}&width=420&height=420&format=png`)
		  client.channels.cache.get(config.immigration.logchannel).send(iEmbed)
		  return
		} else {
		  await roblox.setRank(config.groupid, immigrants[i].userId, Number(config.immigration.citizen)).catch(err => {
			console.log(err)
		  })
		  let iEmbed = new discord.MessageEmbed()
			.setTitle('Success')
			.setColor('GREEN')
			.setDescription(`${immigrants[i].username} was found in ${blacklistedgroups1} blacklisted groups and successfully immigrated.`)
			.setThumbnail(`https://www.roblox.com/headshot-thumbnail/image?userId=${immigrants[i].userId}&width=420&height=420&format=png`)
		  client.channels.cache.get(config.immigration.logchannel).send(iEmbed)
		  return
		}
	  }
	}
}, 1000);

roblox.setCookie(process.env.COOKIE)
client.login(process.env.TOKEN)