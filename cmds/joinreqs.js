const { SlashCommandBuilder } = require("@discordjs/builders");
const roblox = require('noblox.js')
const discord = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`joinreqs`)
        .setDescription('Check the join requests on a group.'),
    category: "ranking",
    async execute(interaction) {
        let key = interaction.options.getNumber('key')
        let joinreqs = await roblox.getJoinRequests(key)
        console.log(joinreqs.data)
    }
}