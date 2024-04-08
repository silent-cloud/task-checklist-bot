const fs = require('node:fs');
const tdfName = '../data.json';
const tdfName2 = './data.json';
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('takepoint')
        .setDescription('Takes 1 point from player')
        .addUserOption(option =>
			option
				.setName('player')
				.setDescription('The new participant in the checklist event.')
				.setRequired(true)),
    async execute(interaction) {
        const player = interaction.options.getUser('player')
        const data = JSON.parse(fs.readFileSync(tdfName2, 'utf-8'))
        let pi = data.players.findIndex((obj) => (obj.name === player.username));
        if (pi !== -1) { 
            data.players[pi].points-- 

            desc = ''
            embedArray = []
            let pointsColumnWidth = 6
            let userColumnWidth = 60
            data.players.sort((a, b) => b.points - a.points)
            for (let playeri in data.players) {
                if (playeri % 15 === 0 && playeri > 0) {
                    const standingsEmbed = new EmbedBuilder()
                        .setTitle('Current Standings')
                        .setDescription("```" + "Points".padStart(pointsColumnWidth, ' ') + ' | ' + "User".padEnd(userColumnWidth, ' ') + "\n" + "------".padStart(pointsColumnWidth, ' ') + ' | ' +  "----".padEnd(userColumnWidth, ' ') + '\n' + desc + "```")
                    embedArray.push(standingsEmbed);
                    desc = `${data.players[playeri].points}`.padStart(pointsColumnWidth, ' ') + ' | ' + `${data.players[playeri].name}`.padEnd(userColumnWidth, ' ') + '\n';
                } else {
                    desc += `${data.players[playeri].points}`.padStart(pointsColumnWidth, ' ') + ' | ' + `${data.players[playeri].name}`.padEnd(userColumnWidth, ' ') + '\n';
                }
            }
            const buildEmbed = new EmbedBuilder()
                .setTitle('Current Standings')
                .setDescription("```" + "Points".padStart(pointsColumnWidth, ' ') + ' | ' + "User".padEnd(userColumnWidth, ' ') + "\n" + "------".padStart(pointsColumnWidth, ' ') + ' | ' +  "----".padEnd(userColumnWidth, ' ') + '\n' + desc + "```")
            embedArray.push(buildEmbed);
            await interaction.guild.channels.fetch(data.standingsID)
                .then(channel => channel.messages.fetch(data.standingsMessageID)
                    .then((msg) => msg.edit({ embeds: embedArray }))
            )

            await interaction.reply({ content: `Gave ${player.username} 1 point.`, ephemeral: true});
            fs.writeFileSync(tdfName2, JSON.stringify(data, '', 4));
        } else {
            await interaction.reply({ content: `${player.username} is not participating`, ephemeral: true});
        }
    },
};