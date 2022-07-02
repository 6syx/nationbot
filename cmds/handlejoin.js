const { SlashCommandBuilder } = require("@discordjs/builders");
const roblox = require('noblox.js')
const discord = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`handlejoin`)
        .setDescription(`Handle a join request in a group.`)
        .addStringOption(opt =>
            opt.setName(`username`)
            .setDescription(`Username of the user you want to accept.`)
            .setRequired(true)
        )
        .addBooleanOption(opt => 
            opt.setName('accept-deny')
            .setDescription(`true = accept, false = deny`)
            .setRequired(true)
        ),
    category: "ranking",
    async execute(interaction) {
        if (!config.management.administrators[usera] && !config.management.lowerusers[usera]) return interaction.reply("You are not whitelisted to use this bot's administrative functions. Contact its owner if you feel this is a mistake.", { ephemeral: true })
        let key = interaction.options.getNumber('key')
        let username = interaction.options.getString('username')
        let status = interaction.options.getBoolean('accept-deny')
        if (config.ranking.enabled == false) return interaction.reply(`Ranking is currently not enabled. Please enable it in the bot's config.`, { ephemeral: true })
        let groupObj = await roblox.getGroup(Number(gID))
        let uID = await roblox.getIdFromUsername(username).catch(err => {
            return interaction.reply('An error occured.', { ephemeral: true })
        })
        let joinreq = await roblox.getJoinRequest(key, uID)
        if (!joinreq) return interaction.reply(`This user is not pending.`, { ephemeral: true })
        let realname = await roblox.getUsernameFromId(uID)
        if (status == true) {
            await roblox.handleJoinRequest(Number(gID), uID, true)
            let iEmbed = new discord.MessageEmbed()
                .setTitle(`Success`)
                .setDescription(`${realname} has been accepted into ${groupObj.name}.`)
                .setColor('GREEN')
                .setThumbnail(`https://www.roblox.com/headshot-thumbnail/image?userId=${uID}&width=420&height=420&format=png`)
                .setTimestamp()
            interaction.reply({ embed: iEmbed, ephemeral: true })
        } else {
            await roblox.handleJoinRequest(Number(gID), uID, false)
            let iEmbed = new discord.MessageEmbed()
                .setTitle(`Success`)
                .setDescription(`${realname} has been denied from joining ${groupObj.name}.`)
                .setColor('GREEN')
                .setThumbnail(`https://www.roblox.com/headshot-thumbnail/image?userId=${uID}&width=420&height=420&format=png`)
                .setTimestamp()
            interaction.reply({ embed: iEmbed, ephemeral: true })
        }
    }
}