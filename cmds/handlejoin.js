const { SlashCommandBuilder } = require("@discordjs/builders");

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
            .setDescription(`true = accept, false = deny`))
            .setRequired(true)
}