const fs = require('node:fs');
const tdfName = '../../data.json';
const tdfName2 = './data.json';
const tdf = require(tdfName);
const { SlashCommandBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('addtask')
        .setDescription('Add a task to the checklist.')
        .addStringOption(option =>
            option.setName('tier')
                .setDescription('The tier the task belongs to.')
                .setRequired(true)
                .setAutocomplete(true)
        )
        .addStringOption(option => 
            option.setName('task')
                .setDescription('The task description.'))
        .addStringOption(option => 
            option.setName('points')
                .setDescription('The amount of points awarded for completing this task.')),
    async autocomplete(interaction) { 
        const focusedValue = interaction.options.getFocused();
        const tiers = tdf.checklist;
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
        const tier = interaction.options.getString('tier');
        const task = interaction.options.getString('task');
        const points = parseInt(interaction.options.getString('points'));
        const data = JSON.parse(fs.readFileSync(tdfName2, 'utf-8'))
        data.taskcount += 1;
        ti = data.checklist.findIndex((obj) => (obj.tierName === tier));
        data.checklist[ti].tasks.push({ id: data.taskcount, task: task, points: points})
        data.checklist[ti].tasks.sort((a, b) => a.points - b.points)
        fs.writeFileSync(tdfName2, JSON.stringify(data));
        await interaction.reply({ content: `Added ${task} to ${tier} that awards ${points} points.`, ephemeral: true});
    },
};