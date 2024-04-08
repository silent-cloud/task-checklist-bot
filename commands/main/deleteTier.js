const fs = require('node:fs');
const tdfName = '../data.json';
const tdfName2 = './data.json';
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('deletetier')
        .setDescription('Delete a tier from the checklist.')
        .addStringOption(option => 
            option.setName('tiername')
                .setDescription('The tier\'s name.')
                .setRequired(true)
                .setAutocomplete(true)
        ),
    async autocomplete(interaction) { 
        const data = JSON.parse(fs.readFileSync(tdfName2, 'utf-8'))
        const focusedValue = interaction.options.getFocused();
        const tiers = data.checklist
        const choices = [];
        for (let i in tiers) {
            choices.push(tiers[i].tierName)
        }
        const filtered = choices.filter(choice => choice.startsWith(focusedValue));
        await interaction.respond(
            filtered.map(choice => ({ name: choice, value: choice })),
        );
    },
    async execute(interaction) {
        const tier = interaction.options.getString('tiername')
        const data = JSON.parse(fs.readFileSync(tdfName2, 'utf-8'))
        let ti = data.checklist.findIndex((obj) => (obj.tierName === tier));
        await interaction.guild.channels.fetch(data.checklist[ti].channelID).then(channel => channel.delete())
        data.checklist.splice(ti, 1)
        for (let playeri in data.players) {
            data.players[playeri].completed.splice(ti, 1)
        }
        fs.writeFileSync(tdfName2, JSON.stringify(data));
        await interaction.reply({ content: `Removed ${tier} tier from the checklist.`, ephemeral: true});
    },
};