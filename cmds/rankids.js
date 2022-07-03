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
        let key = interaction.options.getNumber('group')
        const getRoles = await roblox.getRoles(Number(key))
        const formattedRoles = getRoles.map((r) => `\`${r.name}\` - Rank ID: **${r.rank}**`);
        const rankListEmbed = new discord.MessageEmbed()
            .setTitle('Here are all your ranks:')
            .setDescription(formattedRoles)
            .setColor('BLUE')
            .setTimestamp()
        interaction.reply({ embeds: [rankListEmbed], ephemeral: true })
    }
}