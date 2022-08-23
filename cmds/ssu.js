const { SlashCommandBuilder } = require("@discordjs/builders");
const config = require('../config.json')
const ms = require('ms')
const index = require('../index.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ssu')
        .setDescription(`Host an SSU for a given place.`),
    category: 'ssu',
    async execute(interaction) {
        let game = interaction.options.getString('game')
        if (!interaction.member.roles.cache.has(config.ssu.roleid)) return interaction.reply({ content: `You do not have permission to run this command. The <@&${config.ssu.roleid}> role is required.`, ephemeral: true})
        const cdtime = JSON.parse(fs.readFileSync(`./cooldown.json`, 'utf-8'))
        if (cdtime.timeuntilcooled !== null) return interaction.reply({ content: `The SSU command is currently on cooldown!`, ephemeral: true})
        index.botclient.channels.cache.get(config.ssu.channel).send(`${config.ssu.ping} Server start-up, head on down! ${game}`)
        let nowtime = Math.round(Date.now() / 1000)
        let newcdtime = Math.round(ms(config.ssu.cooldown) / 1000)
        cdtime.timeuntilcooled = nowtime + newcdtime
        fs.writeFileSync('./cooldown.json', JSON.stringify(cdtime, null, 4))
    }
}