const fs = require('node:fs');
const tdfName = '../../testdata/data.json';
const tdfName2 = './testdata/data.json';
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
        const data = JSON.parse(fs.readFileSync(tdfName2, 'utf-8'))
        data.pIndex += 1;
        await (
            interaction.guild.channels
                .create({ name: data.pIndex + "-" + name })
                .catch(console.error)
        );
        await interaction.reply({ content: `Added ${name} to the event`, ephemeral: true});
        fs.writeFileSync(tdfName2, JSON.stringify(data));
    },
};