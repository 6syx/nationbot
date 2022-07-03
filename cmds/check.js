const { SlashCommandBuilder } = require("@discordjs/builders");
const config = require("../config.json");
const roblox = require('noblox.js')
const discord = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('check')
        .setDescription('Background check a user for immigration.')
        .addStringOption(opt => 
            opt.setName('username')
            .setDescription('Username of the person you would like to check.')
            .setRequired(true)
        ),
    category: "immigration",
    async execute(interaction) {
        let user = interaction.options.getString('username')
        let usera = interaction.member.user.id
        let uid = await roblox.getIdFromUsername(user)
        if (config.immigration.enabled == false) return interaction.reply({ content: `Immigration is disabled. Re-enable it in the bot's config.`, ephemeral: true })
        if (config.immigration.settings.toggle == false) return interaction.reply({ content: `Immigration is currently not enabled. Please enable it with the /immigration command.`, ephemeral: true })
        if (!uid) return interaction.reply(`This user does not exist on Roblox.`, { ephemeral: true })
        if (!config.management.administrators.find(s => s == usera) && !config.management.lowerusers.find(s => s == usera)) return interaction.reply({ content: "You are not whitelisted to use this bot's administrative functions. Contact its owner if you feel this is a mistake.", ephemeral: true})
        blacklistedgroups1 = 0
		const userGroups = await roblox.getGroups(uid)
		for (f = 0; f < userGroups.length; f++) {
		  for (l = 0; l < config.immigration.settings.blacklistedgroups.length; l++) {
			if (blacklistedgroups[l] == userGroups[f].Id) {
			  failedcheck = true
			  blacklistedgroups1 += 1
			}
		  }
		}
        for (f = 0; f < blacklistedusers.length; f++) {
            if (blacklistedusers[f] == uid) {
                await roblox.setRank(config.groupid, uid, Number(config.immigration.failrank))
                let iEmbed = new discord.MessageEmbed()
                    .setTitle('Fail')
                    .setColor('RED')
                    .setDescription(`${realname} is a blacklisted user and has been successfully detained.`)
                    .setThumbnail(`https://www.roblox.com/headshot-thumbnail/image?userId=${uID}&width=420&height=420&format=png`)
                client.channels.cache.get(config.immigration.logchannel).send({embeds: [iEmbed]})
                return interaction.reply({ content: 'This user is a blacklisted individual and deemed ineligible for immigration.', ephemeral: true })
            }
        }
        if (config.immigration.settings.distinguishment.enabled == true) {
			for (f = 0; f < config.immigration.settings.distinguishment.list.length; f++) {
				if (config.immigration.settings.distinguishment.list[f] == uid) {
				return interaction.reply({ content: 'This user is a distinguished individual and deemed eligible for immigration.', ephemeral: true })
				}
			}
		}
        if (config.immigration.settings.majororganization.enabled == true) {
            if (await roblox.getRankInGroup(config.immigration.settings.majororganization.groupid, uID) >= config.immigration.settings.majororganization.org_rank_id) {
            await roblox.setRank(config.groupid, uid, Number(config.immigration.settings.majororganization.your_foreign_rank_id))
            let iEmbed = new discord.MessageEmbed()
                .setTitle('Success')
                .setColor('GREEN')
                .setDescription(`${immigrants[i].username} was found as a representative from the United Nations and has been ranked to Foreign Representative.`)
                .setThumbnail(`https://www.roblox.com/headshot-thumbnail/image?userId=${uID}&width=420&height=420&format=png`)
            client.channels.cache.get(config.immigration.logchannel).send({ embeds: [iEmbed] })
            return interaction.reply({ content: 'This user is a foreign representative and has been ranked accordingly.', ephemeral: true })
            }
        }
        const player = await roblox.getPlayerInfo(uid)
        if (player.age <= config.immigration.settings.agelimit) {
            await roblox.setRank(config.groupid, uid, config.immigration.failedrank)
            let iEmbed = new discord.MessageEmbed()
                .setTitle('Fail')
                .setColor('RED')
                .setDescription(`${realname} is underage on Roblox and has been successfully detained.`)
                .setThumbnail(`https://www.roblox.com/headshot-thumbnail/image?userId=${uID}&width=420&height=420&format=png`)
            client.channels.cache.get(config.immigration.logchannel).send({ embeds: [iEmbed] })
            interaction.reply({ content: 'This user has been caught as underage and has been deemed ineligible for immigration.', ephemeral: true })
        }
        if (failedcheck == true) {
            await roblox.setRank(config.groupid, uid, Number(config.immigration.failedrank))
            let iEmbed = new discord.MessageEmbed()
                .setTitle('Fail')
                .setColor('RED')
                .setDescription(`${realname} was caught in ${blacklistedgroups1} blacklisted groups and successfully detained.`)
                .setThumbnail(`https://www.roblox.com/headshot-thumbnail/image?userId=${uID}&width=420&height=420&format=png`)
            client.channels.cache.get(config.immigration.logchannel).send({embeds: [iEmbed]})
            interaction.reply({ content: 'This user has been caught in blacklisted groups and deemed ineligible for immigration.', ephemeral: true })
        } else {
            interaction.reply({ content: 'This user has been checked and is deemed eligible for immigration.', ephemeral: true })
        }
    }
}
