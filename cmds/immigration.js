const { SlashCommandBuilder } = require("@discordjs/builders");
const config = require('../config.json')
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`immigrationtoggle`)
        .setDescription(`Toggle the immigration borders.`)
        .addBooleanOption(opt => 
            opt.setName('on-off')
            .setDescription(`true = on, false = off`)
            .setRequired(true)
        ),
    category: "immigration",
    async execute(interaction) {
        if (!config.management.administrators[usera] && !config.management.lowerusers[usera]) return interaction.reply("You are not whitelisted to use this bot's administrative functions. Contact its owner if you feel this is a mistake.", { ephemeral: true })
        let bool = interaction.options.getBoolean('on-off')
        if (config.immigration.enabled == false) return interaction.reply(`Immigration is disabled. Re-enable it in the bot's config.`, { ephemeral: true })
        if (bool == true) {
            config.immigration.settings.toggle = true
            fs.writeFileSync('../config.json', JSON.stringify(config, null, 4))
            interaction.reply(`Immigration has been toggled on.`)
        } else {
            config.immigration.settings.toggle = false
            fs.writeFileSync('../config.json', JSON.stringify(config, null, 4))
            interaction.reply(`Immigration has been toggled off.`)
        }
    }
}