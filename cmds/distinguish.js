const { SlashCommandBuilder } = require("@discordjs/builders");
const config = require('../config.json')
const roblox = require('noblox.js')
const discord = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('distinguish')
        .setDescription('Change the distinguihsment status of a user.')
        .addStringOption(opt =>
            opt.setName(`action`)
            .addChoices(
                { name: "Add", value: "add"},
                { name: "Remove", value: "remove"},
                { name: "View", value: "view"}
            )
            .setRequired(true))
        .addStringOption(opt =>
            opt.setName('username')
            .setDescription('Only applicable to the add/remove actions. Roblox username of the person you want to distinguish.')
            .setRequired(true)
        ),
    category: "distinguished",
    async execute(interaction) {
        if (!config.management.administrators[usera] && !config.management.lowerusers[usera]) return interaction.reply("You are not whitelisted to use this bot's administrative functions. Contact its owner if you feel this is a mistake.", { ephemeral: true })
        let arid = interaction.options.getString('action')
        let gu = interaction.options.getString('username')
        if (arid == 'add') {
            let uID = await roblox.getIdFromUsername(gu).catch(err => {
                console.log(err)
                return interaction.reply(`An error occured.`, { ephemeral: true })
            })
            if (config.immigration.settings.distinguishment.list.find(element => element == uID)) {
                return interaction.reply('This user is already distinguished.', { ephemeral: true })
            }
            let realname = await roblox.getUsernameFromId(uID)
            config.immigration.settings.distinguishment.list.push(Number(uID))
            fs.writeFileSync('./config.json', JSON.stringify(config, null, 4))
            return interaction.reply(`${realname} (${uID}) has been noted as a distinguished user.`, { ephemeral: true })
        } else if (arid == 'remove') {
            let uID = await roblox.getIdFromUsername(gu).catch(err => {
                console.log(err)
                return interaction.reply(`An error occured.`, { ephemeral: true })
            })
            if (!config.immigration.settings.distinguishment.list.find(element => element == uID)) {
                return interaction.reply('This user is not distinguished.', { ephemeral: true })
            }
            let realname = await roblox.getUsernameFromId(uID)
            for (i = 0; i < config.immigration.settings.distinguishment.list.length; i++) {
                if (config.immigration.settings.distinguishment.list[i] == uID) {
                    config.immigration.settings.distinguishment.list.splice(i, 1)
                }
            }
            fs.writeFileSync('./config.json', JSON.stringify(config, null, 4))
            return interaction.reply(`${realname} (${uID}) has been removed from the distinguishment list.`, { ephemeral: true })
        } else if (arid == 'view') {
            beginstr = `Here are all users blacklisted in your bot:\n\n`
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