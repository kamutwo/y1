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
			if (!command) {
				return interaction.reply({ embeds: [new EmbedBuilder()
					.setColor('2B2D31')
					.setDescription('This command is outdated')], ephemeral: true,
				});
			}

			return command.function(interaction);
		}
	},
};