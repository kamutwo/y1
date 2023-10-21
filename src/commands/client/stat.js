const { CommandInteraction, SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, version } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('stat')
		.setDescription('gets the bot\'s stat')
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

	/**
	 * @param {CommandInteraction} interaction
	 */
	function: async (interaction) => {
		await interaction.deferReply();

		return interaction.editReply({ embeds: [new EmbedBuilder()
			.setColor('2B2D31')
			.addFields([
				{
					name: 'Uptime',
					value: `\` ${interaction.client.msToDuration(interaction.client.uptime)} \``,
				},
				{
					name: 'Node.js Version',
					value: `\` ${process.version} \``,
				},
				{
					name: 'Discord.js Version',
					value: `\` ${version} \``,
				},
				{
					name: 'API Latency',
					value: `\` ${Math.round(interaction.client.ws.ping)}ms \``,
				},
			]),
		] });
	},
};