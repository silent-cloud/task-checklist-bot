const fs = require('node:fs');
const tdfName = '../data.json';
const tdfName2 = './data.json';
const { ActionRowBuilder, SlashCommandBuilder, ButtonStyle, ButtonBuilder, EmbedBuilder, ChannelType } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('init')
        .setDescription('Starts a new checklist.'),
        /*
        .addChannelOption(option => 
            option.setName('channel')
                .setDescription('The checklist channel to display the checklist.')
                .setRequired(true)
        )
        */
    async execute(interaction) {
        const initialize = async () => {
            const init = new Object();
            //init.channelID = interaction.options.getChannel('channel').id;
            const checklistCategory =  await interaction.guild.channels.create({ name: "Checklist", type: ChannelType.GuildCategory})
            const playersCategory =  await interaction.guild.channels.create({ name: "Participants", type: ChannelType.GuildCategory})
            init.checklist = [];
            init.players = []
            init.participants = 0;
            init.taskcount = 0;
            init.pIndex = 0;
            init.checklistCategoryID = checklistCategory.id
            init.playersCategoryID = playersCategory.id
            fs.writeFileSync(tdfName2, '')
            fs.writeFileSync(tdfName2, JSON.stringify(init))
            
        }

        if (fs.existsSync(tdfName2)) {
            const confirm = new ButtonBuilder()
                .setCustomId('confirm')
                .setLabel('Yes')
                .setStyle(ButtonStyle.Success);
            const cancel = new ButtonBuilder()
                .setCustomId('cancel')
                .setLabel('No')
                .setStyle(ButtonStyle.Danger);
            const row = new ActionRowBuilder()
                .addComponents(confirm, cancel);

            const confirmEmbed = new EmbedBuilder()
                .setTitle('Start a Blank Checklist')
                .setDescription('Would you like to start a new checklist?')

            const response = await interaction.reply({
                embeds: [confirmEmbed],
                components: [row],
                ephemeral: true
            });

            const collectorFilter = i => i.user.id === interaction.user.id

            try {
                const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: 60_000});

                if (confirmation.customId === 'confirm') {
                    initialize()
                    await confirmation.update({ content: 'Created new checklist.', components: [], embeds: []})
                } else {
                    await confirmation.update({ content: 'Start over cancelled.', components: [], embeds: []})
                }
            } catch (e) {
                console.error(e);
                await interaction.editReply({ content: 'No selection specified, cancelling initialization.', components: [] });
            }
            
        } else {
            initialize();
            await interaction.reply(`Created new checklist.`);
        }
    },
};