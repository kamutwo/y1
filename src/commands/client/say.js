import { PermissionFlagsBits, SlashCommandStringOption, SlashCommandAttachmentOption, CommandInteraction } from 'discord.js';

export default {
	name: 'say',
	description: 'Make the bot say something',
	options: [
		new SlashCommandStringOption()
			.setName('message')
			.setDescription('The message to send.')
			.setRequired(true),
		new SlashCommandAttachmentOption()
			.setName('attachment')
			.setDescription('Attachment to attach to the message.'),
	],
	userPermission: PermissionFlagsBits.ManageMessages,

	/**
	 * @param {CommandInteraction} interaction
	 */
	function: async (interaction) => {
		await interaction.deferReply({ ephemeral: true });

		const attachment = interaction.options.get('attachment')?.attachment;
		await interaction.channel.send({ content: interaction.options.get('message')?.value, files: attachment ? [attachment] : undefined });

		return await interaction.editReply({ content: 'sent!' });
	},
};