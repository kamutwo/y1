const { SlashCommandBuilder, PermissionFlagsBits, CommandInteraction } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('say')
		.setDescription('Make the bot say something')
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
		.addStringOption((option) => option
			.setName('message')
			.setDescription('The message to send')
			.setRequired(true))
		.addAttachmentOption((option) => option
			.setName('attachment')
			.setDescription('Attachment to attach to the message')),

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