const { SlashCommandBuilder } = require("@discordjs/builders");
const config = require('../config.json')
const fs = require('fs')
const discord = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`whitelist`)
        .setDescription(`Whitelist a user to use the bot. Must be an admin in the bot script.`)
        .addStringOption(opt =>
            opt.setName(`action`)
            .setDescription(`Action to take on the whitelist.`)
            .addChoices(
                { name: "Add to whitelist", value: 'add' },
                { name: "Remove from whitelist", value: 'remove' },
                { name: "View whitelist", value: 'view' },
            )
            .setRequired(true)
        )
        .addUserOption(opt =>
            opt.setName('user')
            .setDescription('User to action.')
        ),
    category: "other",
    async execute(interaction) {
        let usera = interaction.member.user.id
        if (!config.management.administrators.find(s => s == usera)) return interaction.reply({ content: "You are not whitelisted to use this command. Contact the bot owner if you feel this is a mistake.", ephemeral: true})
        let action = interaction.options.getString('action')
        let user = interaction.options.getUser('user')
        if (action == 'add') {
            if (config.management.administrators.find(element => element == user.id) || config.management.lowerusers.find(element => element == user.id)) return interaction.reply({ content: "This user is already whitelisted.", ephemeral: true})
            config.management.lowerusers.push(user.id)
            fs.writeFileSync('./config.json', JSON.stringify(config, null, 4))
            return interaction.reply({ content: `${user} has been added to the whitelist.`, ephemeral: true })
        } else if (action == 'remove') {
            if (!config.management.lowerusers.find(element => element == user.id)) return interaction.reply({ content: "This user is not whitelisted.", ephemeral: true})
            for (i = 0; i < config.management.lowerusers.length; i++) {
                if (config.management.lowerusers[i] == user.id) {
                    config.management.lowerusers.splice(i, 1)
                }
            }
            fs.writeFileSync('./config.json', JSON.stringify(config, null, 4))
            return interaction.reply({ content: `${user} has been removed from the whitelist.`, ephemeral: true })
        } else if (action == 'view') {
            beginstr = `Here are all users whitelisted in your bot:\n\n**ADMINS:**\n`
            for (i = 0; i < config.management.administrators.length; i++) {
                let list = config.management.administrators
                beginstr += `- <@${list[i]}>\n`
            }
            beginstr += `\n**LOWER USERS:**\n`
            for (i = 0; i < config.management.lowerusers.length; i++) {
                let list = config.management.lowerusers
                beginstr += `- <@${list[i]}>\n`
            }
            const iEmbed = new discord.MessageEmbed()
                .setTitle(`Whitelisted Users`)
                .setDescription(beginstr)
                .setColor('BLUE')
                .setTimestamp()
            return interaction.reply({embeds: [iEmbed], ephemeral: true })
        }
    }
}