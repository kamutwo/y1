module.exports = {
	eventName: 'interactionCreate',

	/**
	 * @param {import('discord.js').Interaction} interaction
	 */
	listener: async (interaction) => {
		if (!interaction.inGuild()) return;

		if (interaction.isChatInputCommand()) {
			const command = interaction.client.commands.get(interaction.commandName);
			if (!command) return;

			try {
				return await command.function(interaction);
			}
			catch (error) {
				interaction.client.logError(`[Command Error]: ${interaction.commandName}`, error, interaction.channel);
			}
		}
	},
};