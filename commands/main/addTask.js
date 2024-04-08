const fs = require('node:fs');
const tdfName = '../../data.json';
const tdfName2 = './data.json';
const tdf = require(tdfName);
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

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
                .setDescription('The task description.')
                .setRequired(true)
        ),
        /*
        .addStringOption(option => 
            option.setName('points')
                .setDescription('The amount of points awarded for completing this task.')
        ),
        */
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
        const tier = interaction.options.getString('tier');
        const task = interaction.options.getString('task');
        //const points = parseInt(interaction.options.getString('points'));
        const points = '';
        const data = JSON.parse(fs.readFileSync(tdfName2, 'utf-8'))
        const embedArray = [];
        let description = ''
        
        data.taskcount += 1;
        let ti = data.checklist.findIndex((obj) => (obj.tierName === tier));
        //data.checklist[ti].tasks.sort((a, b) => a.points - b.points)
        data.checklist[ti].tasks.push(task)
        for (let taski in data.checklist[ti].tasks) {
            if (taski % 20 === 0 && taski > 0) {
                const newEmbed = new EmbedBuilder()
                    .setTitle(data.checklist[ti].tierName)
                    .setDescription(description);
                embedArray.push(newEmbed);
                description = `- ${data.checklist[ti].tasks[taski]}\n`;
            } else {
                description += `- ${data.checklist[ti].tasks[taski]}\n`;
            }
        }
        const buildEmbed = new EmbedBuilder()
            .setTitle(data.checklist[ti].tierName)
            .setDescription(description);
        embedArray.push(buildEmbed);
        await interaction.guild.channels.fetch(data.checklist[ti].channelID)
            .then(channel => channel.messages.fetch(data.checklist[ti].messageID)
                .then((msg) => msg.edit({ embeds: embedArray }))
        )
        for (let playeri in data.players) {
            data.players[playeri].completed[ti].push(0)
        }
        fs.writeFileSync(tdfName2, JSON.stringify(data, '', 4));
        const reply = (points) ? `Added ${task} to ${tier} that awards ${points} points.` : `Added ${task} to ${tier}`;
        await interaction.reply({ content: reply, ephemeral: true});
    },
};