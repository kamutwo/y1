const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const CommandContext = require('../../structures/CommandContext');

module.exports = {
	eventName: 'interactionCreate',

	/**
	 * @param {import('discord.js').Interaction} interaction
	 */
	listener: async (interaction) => {
		if (!interaction.inGuild()) return;

		if (interaction.isChatInputCommand()) {
			const command = interaction.client.commands.find((v) => v.name.toLowerCase() == interaction.commandName.toLowerCase());
			if (!command) {
				return interaction.reply({ embeds: [new EmbedBuilder()
					.setColor('2B2D31')
					.setDescription('This command is outdated')], ephemeral: true,
				});
			}

			try {
				const args = interaction.options.data.reduce((result, option) => {
					if (option.type != ApplicationCommandOptionType.Attachment) result.push(option.value.toString());
					return result;
				}, [interaction.commandName]);

				return command.function(new CommandContext(interaction, args));
			}
			catch (err) {
				return console.error(`[Command Error]: ${err}`);
			}
		}
	},
};