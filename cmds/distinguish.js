const { SlashCommandBuilder } = require("@discordjs/builders");
const config = require('../config.json')
const roblox = require('noblox.js')
const discord = require('discord.js')
const fs = require('fs')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('distinguish')
        .setDescription('Change the distinguihsment status of a user.')
        .addStringOption(opt =>
            opt.setName(`action`)
            .setDescription('Action to take on the user.')
            .addChoices(
                { name: "Add", value: "add"},
                { name: "Remove", value: "remove"},
                { name: "View", value: "view"}
            )
            .setRequired(true)
        )
        .addStringOption(opt =>
            opt.setName('username')
            .setDescription('Only applicable to the add/remove actions. Roblox username of the person you want to distinguish.')
        ),
    category: "distinguished",
    async execute(interaction) {
        let usera = interaction.member.user.id
        if (!config.management.administrators.find(s => s == usera) && !config.management.lowerusers.find(s => s == usera)) return interaction.reply({ content: "You are not whitelisted to use this bot's administrative functions. Contact its owner if you feel this is a mistake.", ephemeral: true})
        let arid = interaction.options.getString('action')
        let gu = interaction.options.getString('username')
        if (config.immigration.enabled == false) return interaction.reply({ content: `Immigration is disabled. Re-enable it in the bot's config.`, ephemeral: true })
        if (arid == 'add') {
            let uID = await roblox.getIdFromUsername(gu).catch(err => {
                console.log(err)
                return interaction.reply({ content: `An error occured.`, ephemeral: true })
            })
            if (config.immigration.settings.distinguishment.list.find(element => element == uID)) {
                return interaction.reply({ content: 'This user is already distinguished.', ephemeral: true })
            }
            let realname = await roblox.getUsernameFromId(uID).catch(err => {
                return interaction.reply({ content: 'An error occured while getting this user\'s ID.', ephemeral: true })
            })
            config.immigration.settings.distinguishment.list.push(Number(uID))
            fs.writeFileSync('../config.json', JSON.stringify(config, null, 4))
            return interaction.reply({ content: `${realname} (${uID}) has been noted as a distinguished user.`, ephemeral: true })
        } else if (arid == 'remove') {
            let uID = await roblox.getIdFromUsername(gu).catch(err => {
                console.log(err)
                return interaction.reply(`An error occured while getting this user\'s proper name.`, { ephemeral: true })
            })
            if (!config.immigration.settings.distinguishment.list.find(element => element == uID)) {
                return interaction.reply({ content: 'This user is not distinguished.', ephemeral: true })
            }
            let realname = await roblox.getUsernameFromId(uID)
            for (i = 0; i < config.immigration.settings.distinguishment.list.length; i++) {
                if (config.immigration.settings.distinguishment.list[i] == uID) {
                    config.immigration.settings.distinguishment.list.splice(i, 1)
                }
            }
            fs.writeFileSync('../config.json', JSON.stringify(config, null, 4))
            return interaction.reply({ content: `${realname} (${uID}) has been removed from the distinguishment list.`, ephemeral: true })
        } else if (arid == 'view') {
            beginstr = `Here are all users distinguished in your group:\n\n`
            for (i = 0; i < config.immigration.settings.distinguishment.list.length; i++) {
                let list = config.immigration.settings.distinguishment.list
                let name = await roblox.getUsernameFromId(list[i])
                beginstr += `- \`${name}\` (${String(list[i])})\n`
            }
            const iEmbed = new discord.MessageEmbed()
                .setTitle(`Blacklisted Users`)
                .setDescription(beginstr)
                .setColor('BLUE')
                .setTimestamp()
            return interaction.reply({ embeds: [iEmbed], ephemeral: true })
        }
    }
}