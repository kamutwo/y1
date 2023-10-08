import { CommandInteraction, EmbedBuilder, PermissionFlagsBits, version } from 'discord.js';
import si from 'systeminformation';

export default {
	name: 'stat',
	description: 'gets the bot\'s stat',
	userPermission: PermissionFlagsBits.ManageGuild,

	/**
	 * @param {CommandInteraction} interaction
	 */
	function: async (interaction) => {
		await interaction.deferReply();

		const osInfo = await si.osInfo();
		const cpu = await si.cpu();

		return interaction.editReply({ embeds: [new EmbedBuilder()
			.setColor('2B2D31')
			.addFields([
				{
					name: '\\> Uptime',
					value: `\`${interaction.client.utils.msToDuration(interaction.client.uptime)}\``,
				},
				{
					name: '\\> Node.js',
					value: `\`${process.version}\``,
					inline: true,
				},
				{
					name: '\\> Discord.js',
					value: `\`${version}\``,
					inline: true,
				},
				{
					name: '\\> API Latency',
					value: `\`${Math.round(interaction.client.ws.ping)}ms\``,
					inline: true,
				},
				{
					name: '\\> Arch',
					value: `\`${osInfo.arch}\``,
					inline: true,
				},
				{
					name: '\\> Platform',
					value: `\`${osInfo.platform}\``,
					inline: true,
				},
				{
					name: '\\> CPU',
					value: `\`${cpu.brand}\``,
					inline: true,
				},
			]),
		] });
	},
};