const { SlashCommandBuilder } = require("@discordjs/builders");
const roblox = require('noblox.js')
const discord = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`joinreqs`)
        .setDescription('Check the join requests on a group.'),
    category: "ranking",
    async execute(interaction) {
        let usera = interaction.member.user.id
        if (!config.management.administrators.find(s => s == usera) && !config.management.lowerusers.find(s => s == usera)) return interaction.reply({ content: "You are not whitelisted to use this bot's administrative functions. Contact its owner if you feel this is a mistake.", ephemeral: true})
        let key = interaction.options.getNumber('key')
        let joinreqs = await roblox.getJoinRequests(key)
        let group = await roblox.getGroup(key)
        let beginstr = "Here is a list of people requesting to join your group:\n\n"
        for (i = 0; i < joinreqs.data.length; i++) {
            beginstr += `\`- ${joinreqs.data[i].requester.username} (${joinreqs.data[i].requester.userId})\`\n`
        }
        let iEmbed = new discord.MessageEmbed()
            .setTitle(`Join Requests for ${group.name}`)
            .setColor('BLUE')
            .setDescription(beginstr)
        interaction.reply({ embeds: [iEmbed], ephemeral: true })
    }
}