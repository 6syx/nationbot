const { SlashCommandBuilder } = require("@discordjs/builders")
const roblox = require('noblox.js')
const discord = require('discord.js')
const config = require('../config.json')


module.exports = {
    data: new SlashCommandBuilder()
        .setName('setrank')
        .setDescription('Set a user\'s rank in the Roblox group.')
        .addStringOption(opt => 
            opt.setName('username')
            .setDescription('User to rank.')
            .setRequired(true)
        )
        .addNumberOption(opt => 
            opt.setName('rankid')
            .setDescription('Rank ID to rank to.')
            .setRequired(true)
            .setMinValue(1)
            .setMaxValue(254)
        ),
    category: "ranking",
    async execute(interaction) {
        let usera = interaction.member.user.id
        if (!config.management.administrators.find(s => s == usera) && !config.management.lowerusers.find(s => s == usera)) return interaction.reply({ content: "You are not whitelisted to use this bot's administrative functions. Contact its owner if you feel this is a mistake.", ephemeral: true})
        let key = interaction.options.getNumber('group')
        let username = interaction.options.getString('username')
        let rankid = interaction.options.getNumber('rankid')
        let uID = await roblox.getIdFromUsername(username).catch(err => {
            console.log(err)
            return interaction.reply({content: 'An error occurred.', ephemeral: true})
        })
        let ginfo = await roblox.getGroup(key)
        let grole = await roblox.getRole(Number(key), Number(rankid))
          let realname = await roblox.getUsernameFromId(uID)
          let myinfo = await roblox.getCurrentUser()
          let myrankid = await roblox.getRankInGroup(config.groupid, myinfo.UserID)
          if (myrankid < rankid) return interaction.reply({content: `My rank is too low in this group to do that.`, ephemeral: true})
          await roblox.setRank(Number(key), uID, Number(rankid))
          let iEmbed = new discord.MessageEmbed()
            .setTitle(`Success`)
            .setDescription(`${realname} has been ranked to ${grole.name} in ${ginfo.name}.`)
            .setColor('GREEN')
            .setThumbnail(`https://www.roblox.com/headshot-thumbnail/image?userId=${uID}&width=420&height=420&format=png`)
            .setTimestamp()
        interaction.reply({ embeds: [iEmbed], ephemeral: true })
    }
}