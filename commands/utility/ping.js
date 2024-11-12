const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Check the bot\'s latency and API response time'),
    async execute(interaction) {
        const sent = await interaction.deferReply({ ephemeral: false, fetchReply: true });
        const latency = sent.createdTimestamp - interaction.createdTimestamp;
        const apiLatency = Math.round(interaction.client.ws.ping);

        const embed = new EmbedBuilder()
            .setColor('#00FF00')
            .setTitle('🏓 Pong!')
            .addFields(
                { name: 'Bot Latency', value: `${latency}ms`, inline: true },
                { name: 'API Latency', value: `${apiLatency}ms`, inline: true }
            )
            .setFooter({ text: 'Ping requested by ' + interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
            .setTimestamp();

        // Determine the status based on latency
        let status;
        if (latency < 200) {
            status = '🟢 Excellent';
        } else if (latency < 400) {
            status = '🟡 Good';
        } else {
            status = '🔴 Poor';
        }
        embed.addFields({ name: 'Status', value: status, inline: false });

        await interaction.editReply({ embeds: [embed] });
    },
};
