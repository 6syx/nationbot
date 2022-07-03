const { SlashCommandBuilder } = require("@discordjs/builders");
const config = require("../config.json");
const roblox = require('noblox.js')
const discord = require('discord.js')
const fs = require('fs')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('blacklist')
        .setDescription(`Blacklist a group or user.`)
        .addStringOption(opt =>
            opt.setName('category')
            .setDescription("Groups or users.")
            .setRequired(true)
            .setChoices(
                { name: "Blacklisted Groups", value: "groups"},
                { name: "Blacklisted Users", value: "users"},
            )
        )
        .addStringOption(opt =>
            opt.setName('action')
            .setDescription("Add or remove.")
            .setRequired(true)
            .setChoices(
                { name: "Add to blacklist", value: "add"},
                { name: "Remove from blacklist", value: "remove"},
                { name: "View blacklist", value: "view"},
            )
        )
        .addStringOption(opt =>
            opt.setName('user-or-group')
            .setDescription("The user/group to action.")
            .setRequired(true)
        ),
    category: "immigration",
    async execute(interaction) {
        let usera = interaction.member.user.id
        let guid = interaction.options.getString('category')
        let arid = interaction.options.getString('action')
        let gu = interaction.options.getString('user-or-group')
        if (!config.management.administrators.find(s => s == usera) && !config.management.lowerusers.find(s => s == usera)) return interaction.reply({ content: "You are not whitelisted to use this bot's administrative functions. Contact its owner if you feel this is a mistake.", ephemeral: true})
        if (guid.toLowerCase() == 'groups') {
        if (arid.toLowerCase() == 'add') {
            if (config.immigration.settings.blacklistedgroups.find(element => element == usera)) return interaction.reply({ content: 'This group is already on the blacklist.', ephemeral: true})
            const gObj = await roblox.getGroup(Number(gu)).catch(err => {
                console.log(err)
                return interaction.reply({ content: "An error occurred while getting the group.", ephemeral: true})
            })
            config.immigration.settings.blacklistedgroups.push(Number(gu))
            fs.writeFileSync('./config.json', JSON.stringify(config, null, 4))
            return interaction.reply({ content: `${gObj.name} (${gu}) has been added to the immigration blacklist.`, ephemeral: true})
        } else if (arid.toLowerCase() == 'remove') {
            const gObj = await roblox.getGroup(Number(gu)).catch(err => {
                console.log(err)
                return interaction.reply({ content: "An error occurred while getting the group.", ephemeral: true})
            })
            if (!config.immigration.settings.blacklistedgroups.find(element => element == uID)) {
                return interaction.reply({ content: 'This group is not blacklisted.', ephemeral: true })
            }
            for (i = 0; i < config.immigration.settings.blacklistedgroups.length; i++) {
                if (config.immigration.settings.blacklistedgroups[i] == Number(gu)) {
                    config.immigration.settings.blacklistedgroups.splice(i, 1)
                }
            }
            fs.writeFileSync('./config.json', JSON.stringify(config, null, 4))
            return interaction.reply({ content: `${gObj.name} (${gu}) has been removed from the immigration blacklist.`, ephemeral: true})
        } else if (arid.toLowerCase() == 'view') {
            beginstr = `Here are all groups blacklisted in your bot:\n\n`
            for (i = 0; i < config.immigration.settings.blacklistedgroups.length; i++) {
            let list = config.immigration.settings.blacklistedgroups
            let group = await roblox.getGroup(list[i]).catch(err => {
                console.log(err)
            })
            let name
            if (!group) {
                name = "Name could not be retrieved for this group"
            } else {
                name = group.name
            }
            beginstr += `- \`${name}\` (${String(list[i])})\n`
            }
            const iEmbed = new discord.MessageEmbed()
                .setTitle(`Blacklisted Groups`)
                .setDescription(beginstr)
                .setColor('BLUE')
                .setTimestamp()
            return interaction.reply({ embeds: [iEmbed] }, { ephemeral: true })
        } else {
            return interaction.reply({ content: `Second argument must be either \`add\`, \`remove\`, or \`view\`.`, ephemeral: true })
        }
        } else if (guid.toLowerCase() == 'users') {
        if (arid.toLowerCase() == 'add') {
            let uID = await roblox.getIdFromUsername(gu).catch(err => {
                console.log(err)
                return interaction.reply(`An error occurred.`, { ephemeral: true })
            })
            if (config.immigration.settings.blacklistedusers.find(element => element == gu)) {
                return interaction.reply({ content: 'This user is already on the blacklist.', ephemeral: true })
            }
            let realname = await roblox.getUsernameFromId(uID)
            config.immigration.settings.blacklistedusers.push(Number(uID))
            fs.writeFileSync('./config.json', JSON.stringify(config, null, 4))
            return interaction.reply(`${realname} (${uID}) has been added to the immigration blacklist.`, { ephemeral: true })
        } else if (arid.toLowerCase() == 'remove') {
                let uID = await roblox.getIdFromUsername(gu).catch(err => {
                console.log(err)
                return interaction.reply({ content: `An error occurred.`, ephemeral: true })
            })
            let realname = await roblox.getUsernameFromId(uID)
            if (!config.immigration.settings.blacklistedusers.find(element => element == uID)) {
                return interaction.reply({ content: 'This user is not blacklisted.', ephemeral: true })
            }
            for (i = 0; i < config.immigration.settings.blacklistedusers.length; i++) {
                if (config.immigration.settings.blacklistedusers[i] == uID) {
                    config.immigration.settings.blacklistedusers.splice(i, 1)
                }
            }
            fs.writeFileSync('./config.json', JSON.stringify(config, null, 4))
            return interaction.reply({ content: `${realname} (${uID}) has been removed from the immigration blacklist.`, ephemeral: true })
        } else if (arid.toLowerCase() == 'view') {
            beginstr = `Here are all users blacklisted in your bot:\n\n`
            for (i = 0; i < config.immigration.settings.blacklistedusers.length; i++) {
                let list = config.immigration.settings.blacklistedusers
                let name = await roblox.getUsernameFromId(list[i])
                beginstr += `- \`${name}\` (${String(list[i])})\n`
            }
            const iEmbed = new discord.MessageEmbed()
                .setTitle(`Blacklisted Users`)
                .setDescription(beginstr)
                .setColor('BLUE')
                .setTimestamp()
            return interaction.reply({embeds: [iEmbed], ephemeral: true })
        } else {
            return interaction.reply({ content: `Second argument must be either \`add\`, \`remove\`, or \`view\`.`, ephemeral: true })
        }
        } else {
            return interaction.reply({ content: `First argument must be either \`groups\` or \`users\`.`, ephemeral: true })
        }
    }
}