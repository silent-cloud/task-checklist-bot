const fs = require('node:fs');
const tdfName = '../../testdata/data.json';
const tdfName2 = './testdata/data.json';
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('addtier')
        .setDescription('Add a tier to the checklist.')
        .addStringOption(option => 
            option.setName('tiername')
                .setDescription('The new tier\'s name.')),
    async execute(interaction) {
        const tiername = interaction.options.getString('tiername')
        const data = JSON.parse(fs.readFileSync(tdfName2, 'utf-8'))
        const initEmbed = new EmbedBuilder()
            .setTitle(tiername)
        const message = await interaction.guild.channels.fetch(data.channelID)
            .then(channel => channel.send({ embeds: [initEmbed] }))
        data.checklist.push({ messageID: message.id, tierName: tiername, tasks: []})
        fs.writeFileSync(tdfName2, JSON.stringify(data));
        await interaction.reply({ content: `Added ${tiername} to the checklist`, ephemeral: true});
    },
};