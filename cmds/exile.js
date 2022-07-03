const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`exile`)
        .setDescription(`Exile a user from your group.`)
        .addStringOption(opt => 
            opt.setName('username')
            .setDescription(`User to be exiled.`)
        ),
    category: "ranking",
    async execute(interaction) {
        let group = interaction.options.getNumber('group')
        let username = interaction.options.getString('username')
        let uid = await roblox.getIdFromUsername(username).catch(err => {
            return interaction.reply({ content: 'An error occured.', ephemeral: true })
        })
    }
}