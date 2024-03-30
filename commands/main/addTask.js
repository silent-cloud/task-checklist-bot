const fs = require('node:fs');
const tdfName = '../../testdata/data.json';
const tdfName2 = './testdata/data.json';
const { SlashCommandBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('addtask')
        .setDescription('Add a task to the checklist.')
        .addStringOption(option => 
            option.setName('tier')
                .setDescription('The tier the task belongs to.'))
        .addStringOption(option => 
            option.setName('task')
                .setDescription('The task description.'))
        .addStringOption(option => 
            option.setName('points')
                .setDescription('The amount of points awarded for completing this task.')),
    async execute(interaction) {
        const tier = interaction.options.getString('tier');
        const task = interaction.options.getString('task');
        const points = parseInt(interaction.options.getString('points'));
        const data = JSON.parse(fs.readFileSync(tdfName2, 'utf-8'))
        data.taskcount += 1;
        ti = data.checklist.findIndex((obj) => (obj.tierName === tier));
        data.checklist[ti].tasks.push({ id: data.taskcount, task: task, points: points})
        fs.writeFileSync(tdfName2, JSON.stringify(data));
        await interaction.reply({ content: `Added ${task} to ${tier} that awards ${points} points.`, ephemeral: true});
    },
};