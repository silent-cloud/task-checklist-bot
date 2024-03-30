const fs = require('node:fs');
const tdfName = '../../testdata/data.json';
const tdfName2 = './testdata/data.json';
const tdf = require(tdfName)
const { SlashCommandBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('addtier')
        .setDescription('Add a tier to the checklist.')
        .addStringOption(option => 
            option.setName('tiername')
                .setDescription('The new tier\'s name.')),
    async execute(interaction) {
        const tiername = interaction.options.getString('tiername')
        tdf.checklist.push({ tierName: tiername, tasks: []})
        fs.writeFileSync(tdfName2, JSON.stringify(tdf));
        await interaction.reply({ content: `Added ${tiername} to the checklist`, ephemeral: true});
    },
};