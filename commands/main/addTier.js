const fs = require('node:fs');
const tdfName = '../data.json';
const tdfName2 = './data.json';
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('addtier')
        .setDescription('Add a tier to the checklist.')
        .addStringOption(option => 
            option.setName('tiername')
                .setDescription('The new tier\'s name.')
                .setRequired(true)
        )
        .addStringOption(option => 
            option.setName('points')
                .setDescription('The amount of points awarded in this tier.')
                .setRequired(true)
        ),
    async execute(interaction) {
        const tiername = interaction.options.getString('tiername')
        const points = interaction.options.getString('points')
        const data = JSON.parse(fs.readFileSync(tdfName2, 'utf-8'))
        const initEmbed = new EmbedBuilder()
            .setTitle(tiername)
        const channel = await interaction.guild.channels.create({ name: tiername, parent: data.categoryID })
        const channelID = channel.id
        const message = await interaction.guild.channels.fetch(channelID).then(channel => channel.send({ embeds: [initEmbed] }))
        data.checklist.push({ channelID: channelID, messageID: [message.id], tierName: tiername, tasks: [], points: points})
        fs.writeFileSync(tdfName2, JSON.stringify(data));
        await interaction.reply({ content: `Added ${tiername} to the checklist. Each task awards ${points} point(s)`, ephemeral: true});
    },
};