const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('send')
        .setDescription('Send test message')
        .addChannelOption(option => 
            option.setName('channel')
                .setDescription('Channel to send the message')
                .setRequired(true)
        ),
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setTitle('Init')
        await interaction.options.getChannel('channel').send({ embeds: [embed] });
    },
};