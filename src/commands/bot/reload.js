const { CommandInteraction, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { join } = require('path');
const { glob } = require('glob');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('reload')
		.setDescription('reloads the bot')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

	/**
	 * @param {CommandInteraction} interaction
	 */
	function: async (interaction) => {
		await interaction.deferReply({ ephemeral: true });
		if (interaction.user.id !== '848789766522535977') return interaction.editReply({ content: 'You are not allowed to use this command.' });

		const files = await glob(join(__dirname, '../../functions').replace(/\\/g, '/') + '/**/*.js');
		for (const path of files) {
			delete require.cache[require.resolve(path)];
			require(path)(interaction.client);
		}

		for (const [eventName, listener] of interaction.client.events) {
			interaction.client.removeListener(eventName, listener);
		}

		interaction.client.events.clear();
		await interaction.client.loadEvents();

		interaction.client.commands.clear();
		await interaction.client.loadCommands();

		return interaction.editReply({ content: 'Reloaded!' });
	},
};