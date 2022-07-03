const { SlashCommandBuilder } = require("@discordjs/builders");
const config = require('../config.json')
const roblox = require('noblox.js')
const discord = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`groupinfo`)
        .setDescription(`Displays info on your main group.`),
    category: 'other',
    async execute(interaction) {
        let gid = config.groupid
        let group = await roblox.getGroup(gid).catch(err => {
            interaction.reply(`An error occurred while getting the group's info.`)
        })
        let logo = await roblox.getLogo(gid)
        let info = new discord.MessageEmbed()
            .setTitle(`${group.name}`)
            .setColor('BLUE')
            .setDescription(`${group.description}`)
            .addFields(
                { name: `Owner`, value: `[${group.owner.username}](https://www.roblox.com/users/${group.owner.userId}/profile)`, inline: true },
                { name: `Members`, value: `${group.memberCount}`, inline: true },
                { name: `Group ID`, value: `[${group.id}](https://www.roblox.com/groups/${group.id})`, inline: true },
            )
            .setThumbnail(logo)
            .setTimestamp()
        return interaction.reply({ embeds: [info], ephemeral: true })
    }
}
