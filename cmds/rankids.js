const { SlashCommandBuilder } = require("@discordjs/builders");
const roblox = require('noblox.js')
const discord = require('discord.js')
const config = require('../config.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rankids')
        .setDescription(`Display a group's rank IDs.`),
    category: 'ranking',
    async execute(interaction) {
        let usera = interaction.member.user.id
        if (!config.management.administrators.find(s => s == usera) && !config.management.lowerusers.find(s => s == usera)) return interaction.reply({ content: "You are not whitelisted to use this bot's administrative functions. Contact its owner if you feel this is a mistake.", ephemeral: true})
        let key = interaction.options.getNumber('group')
        const getRoles = await roblox.getRoles(Number(key))
        const group = await roblox.getGroup(key)
        let beginstr = 'Here are all your ranks:\n\n'
        for (i = 0; i < getRoles.length; i++) {
            beginstr += `\`${getRoles[i].name}\` - Rank ID: **${getRoles[i].rank}**\n`
        }
        const rankListEmbed = new discord.MessageEmbed()
            .setTitle(`Group Ranks in ${group.name}`)
            .setDescription(beginstr)
            .setColor('BLUE')
            .setTimestamp()
        interaction.reply({ embeds: [rankListEmbed], ephemeral: true })
    }
}