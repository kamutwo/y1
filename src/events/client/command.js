import { EmbedBuilder } from 'discord.js';

export default {
	eventName: 'interactionCreate',

	/**
	 * @param {import('discord.js').Interaction} interaction
	 */
	listener: async (interaction) => {
		if (!interaction.inGuild()) return;

		if (interaction.isChatInputCommand()) {
			const command = interaction.client.commands.get(interaction.commandName);
			if (!command) return;

			return command.function(interaction);
		}
	},
};