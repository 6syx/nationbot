const express = require('express')
const app = express()
const port = 8000

app.get('/', (req, res) => {
  res.send('Bot online. Please leave this tab open or put it into https://uptimerobot.com as an HTTP monitor.')
})

app.listen(port, () => {
  console.log(`Listening on https://localhost:${port}.`)
})
require('dotenv').config()
const discord = require('discord.js')
const client = new discord.Client({ intents: [discord.Intents.FLAGS.GUILDS, discord.Intents.FLAGS.GUILD_MEMBERS] })
const roblox = require('noblox.js')
const fs = require('fs')
const commandFiles = fs.readdirSync('./cmds').filter(file => file.endsWith('.js'));
const config = require('./config.json')
const ms = require('ms')
module.exports.botclient = client

client.commands = new discord.Collection()

for (const file of commandFiles) {
	const command = require(`./cmds/${file}`);
	// Set a new item in the Collection
	// With the key as the command name and the value as the exported module
	client.commands.set(command.data.name, command);
}

client.once('ready', async () => {
	let userinfo = await roblox.getCurrentUser()
	let group = await roblox.getGroup(config.groupid)
	client.user.setActivity(`over ${group.name}`, { type: "WATCHING" })
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
	  let blacklistedgroups = config.immigration.settings.blacklistedgroups
	  let blacklistedusers = config.immigration.settings.blacklistedusers
	  const immigrants = await roblox.getPlayers(config.groupid, config.immigration.immigrantrank).catch(err => {
		  console.log(err)
	  })
	  if (!immigrants) return
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
			  .setDescription(`${immigrants[i].username} is a blacklisted user and has been successfully detained. (ID: ${String(immigrants[i].userId)})`)
			  .setThumbnail(`https://www.roblox.com/headshot-thumbnail/image?userId=${immigrants[i].userId}&width=420&height=420&format=png`)
			client.channels.cache.get(config.immigration.logchannel).send({ embeds: [iEmbed] })
			return
		  }
		}
		if (config.immigration.settings.distinguishment.enabled == true) {
			for (f = 0; f < config.immigration.settings.distinguishment.list.length; f++) {
				if (config.immigration.settings.distinguishment.list[f] == immigrants[i].userId) {
				await roblox.setRank(config.groupid, immigrants[i].userId, Number(config.immigration.settings.distinguishment.rank))
				let iEmbed = new discord.MessageEmbed()
					.setTitle('Success')
					.setColor('GREEN')
					.setDescription(`${immigrants[i].username} is a distinguished individual and has been ranked accordingly. (ID: ${String(immigrants[i].userId)})`)
					.setThumbnail(`https://www.roblox.com/headshot-thumbnail/image?userId=${immigrants[i].userId}&width=420&height=420&format=png`)
				client.channels.cache.get(config.immigration.logchannel).send({ embeds: [iEmbed] })
				return
				}
			}
		}
		const player = await roblox.getPlayerInfo(immigrants[i].userId)
		if (player.age <= config.immigration.settings.agelimit) {
			await roblox.setRank(config.groupid, immigrants[i].userId, config.immigration.failrank)
			let iEmbed = new discord.MessageEmbed()
			  .setTitle('Fail')
			  .setColor('RED')
			  .setDescription(`${immigrants[i].username} is underage and has been detained. (ID: ${String(immigrants[i].userId)})`)
			  .setThumbnail(`https://www.roblox.com/headshot-thumbnail/image?userId=${immigrants[i].userId}&width=420&height=420&format=png`)
			client.channels.cache.get(config.immigration.logchannel).send({ embeds: [iEmbed] })
			return
		}
		if (config.immigration.settings.majororganization.enabled == true) {
		  if (await roblox.getRankInGroup(config.immigration.settings.majororganization.groupid, immigrants[i].userId) >= config.immigration.settings.majororganization.org_rank_id) {
			await roblox.setRank(config.groupid, immigrants[i].userId, Number(config.immigration.settings.majororganization.your_foreign_rank_id))
			let iEmbed = new discord.MessageEmbed()
			  .setTitle('Success')
			  .setColor('GREEN')
			  .setDescription(`${immigrants[i].username} was found as a representative from the United Nations and has been ranked to Foreign Representative. (ID: ${String(immigrants[i].userId)})`)
			  .setThumbnail(`https://www.roblox.com/headshot-thumbnail/image?userId=${immigrants[i].userId}&width=420&height=420&format=png`)
			client.channels.cache.get(config.immigration.logchannel).send({ embeds: [iEmbed] })
			return
		  }
		}
		if (failedcheck == true) {
		  await roblox.setRank(config.groupid, immigrants[i].userId, Number(config.immigration.failedrank)).catch(err => {
			console.log(err)
		  })
		  let iEmbed = new discord.MessageEmbed()
			.setTitle('Fail')
			.setColor('RED')
			.setDescription(`${immigrants[i].username} was caught in ${blacklistedgroups1} blacklisted groups and successfully detained. (ID: ${String(immigrants[i].userId)})`)
			.setThumbnail(`https://www.roblox.com/headshot-thumbnail/image?userId=${immigrants[i].userId}&width=420&height=420&format=png`)
		  client.channels.cache.get(config.immigration.logchannel).send({ embeds: [iEmbed] })
		  return
		} else {
		  await roblox.setRank(config.groupid, immigrants[i].userId, Number(config.immigration.citizenrank)).catch(err => {
			console.log(err)
		  })
		  let iEmbed = new discord.MessageEmbed()
			.setTitle('Success')
			.setColor('GREEN')
			.setDescription(`${immigrants[i].username} was found in ${blacklistedgroups1} blacklisted groups and successfully immigrated. (ID: ${String(immigrants[i].userId)})`)
			.setThumbnail(`https://www.roblox.com/headshot-thumbnail/image?userId=${immigrants[i].userId}&width=420&height=420&format=png`)
		  client.channels.cache.get(config.immigration.logchannel).send({ embeds: [iEmbed] })
		  return
		}
	  }
	}
}, ms(config.immigration.settings.delay));

roblox.setCookie(process.env.COOKIE)
client.login(process.env.TOKEN)

setInterval(async () => {
	const cdtime = JSON.parse(fs.readFileSync(`./cooldown.json`, 'utf-8'))
	let nowtime = Math.round(Date.now() / 1000)
	if (cdtime.timeuntilcooled <= nowtime) {
		cdtime.timeuntilcooled = null
		fs.writeFileSync('./cooldown.json', JSON.stringify(cdtime, null, 4))
	}
}, ms('20s'))
