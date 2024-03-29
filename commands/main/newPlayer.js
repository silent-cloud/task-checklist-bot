const fs = require('node:fs');
const tdfName = '../../testdata/data.json';
const tdfName2 = './testdata/data.json';
const tdf = require(tdfName)
const { SlashCommandBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('newplayer')
        .setDescription('Add a new participant to the task event.')
        .setDefaultMemberPermissions(16)
        .addStringOption(option => 
            option.setName('name')
                .setDescription('The new participant\'s name')),
    async execute(interaction) {
        const name = interaction.options.getString('name')
        const data = fs.readFileSync(tdfName2)
        const ci = JSON.parse(data);
        await (
            interaction.guild.channels
                .create({ name: ci.pIndex + "-" + name })
                .catch(console.error)
        );
        await interaction.reply({ content: `Added ${name} to the event`, ephemeral: true});
        tdf.pIndex += 1;
        fs.writeFileSync(tdfName2, JSON.stringify(tdf));
    },
};