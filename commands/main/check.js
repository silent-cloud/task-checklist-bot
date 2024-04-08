const fs = require('node:fs');
const tdfName = '../../data.json';
const tdfName2 = './data.json';
const tdf = require(tdfName);
const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('check')
        .setDescription('Display your progress.')
        .addStringOption(option =>
            option.setName('tier')
                .setDescription('The tier the task belongs to.')
                .setRequired(true)
                .setAutocomplete(true)
        )
        .addUserOption(option =>
            option.setName('player')
                .setDescription('The target player')
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
        const tier = interaction.options.getString('tier');
        const player = interaction.options.getUser('player');
        //const task = interaction.options.getString('task');
        //const points = parseInt(interaction.options.getString('points'));
        const points = '';
        const data = JSON.parse(fs.readFileSync(tdfName2, 'utf-8'))
        const embedArray = [];

        data.taskcount -= 1;
        let ti = data.checklist.findIndex((obj) => (obj.tierName === tier));
        let pi = 0
        let firstDesc = ''
        const eArr = ['1️⃣','2️⃣','3️⃣','4️⃣','5️⃣','6️⃣','7️⃣','8️⃣','9️⃣','0️⃣']
        const guidemsg = '⬅️ - See previous 10 tasks\n➡️ - See next 10 tasks\n\n';
        const thisChannel = await interaction.channelId
        const thisPlayer = await interaction.member.user.username
        let playeri = (player !== null) ? data.players.findIndex((obj) => (obj.name === player.username)) : data.players.findIndex((obj) => (obj.name === thisPlayer));
        //console.log(playeri)

        //data.checklist[ti].tasks.sort((a, b) => a.points - b.points)

        const next = new ButtonBuilder()
            .setCustomId('next')
            .setEmoji('➡️')
            .setStyle(ButtonStyle.Secondary);
        const dNext = new ButtonBuilder()
            .setCustomId('next')
            .setEmoji('➡️')
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(true);
        const prev = new ButtonBuilder()
            .setCustomId('prev')
            .setStyle(ButtonStyle.Secondary)
            .setEmoji('⬅️');
        const dPrev = new ButtonBuilder()
            .setCustomId('prev')
            .setEmoji('⬅️')
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(true);
        const confirm = new ButtonBuilder()
            .setCustomId('confirm')
            .setStyle(ButtonStyle.Secondary)
            .setEmoji('☑️');
        const row1 = new ActionRowBuilder()

        if (data.checklist[ti].tasks.length < 10) {
            row1.addComponents(dPrev, dNext)
        } else {
            row1.addComponents(dPrev, next)
        }
        
        /*
        const one = new ButtonBuilder()
            .setCustomId('0')
            .setStyle(ButtonStyle.Secondary)
            .setEmoji('1️⃣');
        const two = new ButtonBuilder()
            .setCustomId('1')
            .setStyle(ButtonStyle.Secondary)
            .setEmoji('2️⃣');
        const three = new ButtonBuilder()
            .setCustomId('2')
            .setStyle(ButtonStyle.Secondary)
            .setEmoji('3️⃣');
        const four = new ButtonBuilder()
            .setCustomId('3')
            .setStyle(ButtonStyle.Secondary)
            .setEmoji('4️⃣');
        const five = new ButtonBuilder()
            .setCustomId('4')
            .setStyle(ButtonStyle.Secondary)
            .setEmoji('5️⃣');
        const six = new ButtonBuilder()
            .setCustomId('5')
            .setStyle(ButtonStyle.Secondary)
            .setEmoji('6️⃣');
        const seven = new ButtonBuilder()
            .setCustomId('6')
            .setStyle(ButtonStyle.Secondary)
            .setEmoji('7️⃣');
        const eight = new ButtonBuilder()
            .setCustomId('7')
            .setStyle(ButtonStyle.Secondary)
            .setEmoji('8️⃣');
        const nine = new ButtonBuilder()
            .setCustomId('8')
            .setStyle(ButtonStyle.Secondary)
            .setEmoji('9️⃣');
        const zero = new ButtonBuilder()
            .setCustomId('9')
            .setStyle(ButtonStyle.Secondary)
            .setEmoji('0️⃣');

        const choiceArr = [one, two, three, four, five, six, seven, eight, nine, zero]
        const row2 = new ActionRowBuilder()
        const row3 = new ActionRowBuilder()
        */

        l = (data.checklist[ti].tasks.length < 10) ? data.checklist[ti].tasks.length : 10
        for (let taski = 0; taski < l; taski++) {
            firstDesc += `- ${eArr[taski % 10]} - ${data.checklist[ti].tasks[taski]} - ` + ((data.players[playeri].completed[ti][taski] === 1) ? '✔️' : '❌') + '\n';
            //if (row2.components.length < 5) { row2.addComponents(choiceArr[taski]) } else { row3.addComponents(choiceArr[taski]) }
        }
        const firstEmbed = new EmbedBuilder()
            .setTitle(`${tier} Checklist`)
            .setDescription(guidemsg + firstDesc)
        
        let componentsList = [];
        componentsList.push(row1)
        //if (row2.components.length !== 0) { componentsList.push(row2) }
        //if (row3.components.length !== 0) { componentsList.push(row3) }

        const response = await interaction.reply({
            embeds: [firstEmbed],
            components: componentsList,
            ephemeral: true
        });

        const collectorFilter = i => i.user.id === interaction.user.id
        const collector = response.createMessageComponentCollector({ filter: collectorFilter })

        collector.on('collect', async i => {
            let desc = ''
            let taskStart = 0
            let limit = 0
            let embed = ''
            //let embedArray = []
            switch (i.customId) {
                case 'next':
                    pi++;
                    taskStart = (pi * 10)
                    limit = (10 + (pi * 10))
                    //row2.setComponents();
                    //row3.setComponents();
                    if (limit > data.checklist[ti].tasks.length) { limit = data.checklist[ti].tasks.length }
                    if ((taskStart + 10) > data.checklist[ti].tasks.length) { row1.setComponents(prev, dNext) } else { row1.setComponents(prev, next) }
                    for (let taski = taskStart; taski < limit; taski++) {
                        desc += `- ${eArr[taski % 10]} - ${data.checklist[ti].tasks[taski]} - ` + ((data.players[playeri].completed[ti][taski] === 1) ? '✔️' : '❌') + '\n';
                        //if (row2.components.length < 5) { row2.addComponents(choiceArr[taski % 10]) } else { row3.addComponents(choiceArr[taski % 10]) }
                    }
                    componentsList = [];
                    componentsList.push(row1)
                    //if (row2.components.length !== 0) { componentsList.push(row2) }
                    //if (row3.components.length !== 0) { componentsList.push(row3) }
                    embed = new EmbedBuilder()
                        .setTitle(`${tier} Checklist`)
                        .setDescription(guidemsg + desc)
                    i.update({
                        embeds: [embed],
                        components: componentsList,
                    })
                    break;
                case 'prev':
                    pi--;
                    taskStart = (pi * 10)
                    limit = (10 + (pi * 10))
                    //row2.setComponents();
                    //row3.setComponents();
                    if ((taskStart - 10) < 0) { row1.setComponents(dPrev, next) } else { row1.setComponents(prev, next) }
                    for (let taski = taskStart; taski < limit; taski++) {
                        desc += `- ${eArr[taski % 10]} - ${data.checklist[ti].tasks[taski]} - ` + ((data.players[playeri].completed[ti][taski] === 1) ? '✔️' : '❌') + '\n';
                        //if (row2.components.length < 5) { row2.addComponents(choiceArr[taski % 10]) } else { row3.addComponents(choiceArr[taski % 10]) }
                    }
                    componentsList = [];
                    componentsList.push(row1)
                    //if (row2.components.length !== 0) { componentsList.push(row2) }
                    //if (row3.components.length !== 0) { componentsList.push(row3) }
                    embed = new EmbedBuilder()
                        .setTitle(`${tier} Checklist`)
                        .setDescription(guidemsg + desc)
                    i.update({
                        embeds: [embed],
                        components: componentsList,
                    })
                    break;
                /*
                case 'confirm':
                    i.update({content: 'Finished awarding points.', components: [], embeds: []})
                    break;
                default:
                    awardtask = parseInt(i.customId) + (pi * 10)
                    if (data.players[playeri].completed[ti][awardtask] !== 1) { 
                        data.players[playeri].completed[ti][awardtask] = 1
                        data.players[playeri].points += data.checklist[ti].points
                    }
                    
                    taskStart = (pi * 10)
                    limit = (10 + (pi * 10))
                    row1.setComponents();
                    row2.setComponents();
                    row3.setComponents();
                    if ((taskStart - 10) < 0) { row1.addComponents(dPrev) } else { row1.addComponents(prev) }
                    if ((taskStart + 10) > data.checklist[ti].tasks.length) { row1.addComponents(dNext) } else { row1.addComponents(next) }
                    row1.addComponents(confirm)
                    if (limit > data.checklist[ti].tasks.length) { limit = data.checklist[ti].tasks.length }
                    
                    for (let taski = taskStart; taski < limit; taski++) {
                        desc += `${eArr[taski % 10]} - ${data.checklist[ti].tasks[taski]} - ` + ((data.players[playeri].completed[ti][taski] === 1) ? '✔️' : '❌') + '\n';
                        if (row2.components.length < 5) { row2.addComponents(choiceArr[taski % 10]) } else { row3.addComponents(choiceArr[taski % 10]) }
                    }
                    
                    componentsList = [];
                    componentsList.push(row1)
                    if (row2.components.length !== 0) { componentsList.push(row2) }
                    if (row3.components.length !== 0) { componentsList.push(row3) }

                    embed = new EmbedBuilder()
                        .setTitle(`Award points for ${tier}?`)
                        .setDescription(guidemsg + desc)

                    i.update({
                        embeds: [embed],
                        components: componentsList,
                    })

                    desc = ''
                    embedArray = []
                    for (let taski in data.checklist[ti].tasks) {
                        if (taski % 20 === 0 && taski > 0) {
                            const newEmbed = new EmbedBuilder()
                                .setTitle(data.checklist[ti].tierName)
                                .setDescription(desc);
                            embedArray.push(newEmbed);
                            desc = `${data.checklist[ti].tasks[taski]}\n`;
                        } else {
                            desc += `${data.checklist[ti].tasks[taski]}\n`;
                        }
                    }
                    const buildEmbed = new EmbedBuilder()
                        .setTitle(data.checklist[ti].tierName)
                    if (desc !== '') { buildEmbed.setDescription(desc); }
                    embedArray.push(buildEmbed);
                    i.guild.channels.fetch(data.checklist[ti].channelID)
                        .then(channel => channel.messages.fetch(data.checklist[ti].messageID)
                            .then((msg) => msg.edit({ embeds: embedArray }))
                    )

                    fs.writeFileSync(tdfName2, JSON.stringify(data));
                    break;
                */
            }
        });
    },
};