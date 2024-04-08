const fs = require('node:fs');
const tdfName = '../data.json';
const tdfName2 = './data.json';
const { SlashCommandBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('addplayer')
        .setDescription('Add a new participant to the task event and create a channel for player.')
        .addUserOption(option =>
			option
				.setName('player')
				.setDescription('The new participant in the checklist event.')
				.setRequired(true))
        .addStringOption(option =>
            option
                .setName('nickname')
                .setDescription('A different name to be used for the channel creation.')),
    async execute(interaction) {
        const player = interaction.options.getUser('player')
        const nickname = interaction.options.getString('nickname')
        const data = JSON.parse(fs.readFileSync(tdfName2, 'utf-8'))
        const name = (nickname !== '' && nickname !== null) ? nickname : player.username
        const completed = []
        for (let tieri in data.checklist) {
            completed.push(Array(data.checklist[tieri].tasks.length).fill(0))
        }
        data.pIndex += 1;
        const channel = await interaction.guild.channels.create({ name: data.pIndex + "-" + name, parent: data.playersCategoryID})
        data.players.push({ name: player.username, completed: completed, points: 0, channelID: channel.id })
        await interaction.reply({ content: `Added ${player.username} to the event`, ephemeral: true});
        fs.writeFileSync(tdfName2, JSON.stringify(data));
    },
};