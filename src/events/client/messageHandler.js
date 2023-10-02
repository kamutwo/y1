const { Message, ChannelType, EmbedBuilder } = require('discord.js');
const CommandContext = require('../../structures/CommandContext');

module.exports = {
	eventName: 'messageCreate',

	/**
	 * @param {Message} message
	 */
	listener: async (message) => {
		const trimmed = message.content.trim().toLowerCase();
		if (message.author.bot || message.channel.type === ChannelType.DM || !trimmed.startsWith(process.env.PREFIX)) return;

		const args = trimmed.slice(process.env.PREFIX.length).split(/\s+/);
		const command = message.client.commands.find((v) => v.name.toLowerCase() == args[0]);
		if (!command) return;

		try {
			if (command.defaultMemberPermissions) {
				const missing = message.member.permissions.missing(command.defaultMemberPermissions);
				if (missing.length > 0) {
					return message.reply({ embeds: [new EmbedBuilder()
						.setColor('2B2D31')
						.setDescription(`You need the following permissions in order to use this command:\n\n**${missing.join('**, **')}**`)], allowedMentions: { repliedUser: false },
					});
				}
			}

			return command.function(new CommandContext(message, args));
		}
		catch (err) {
			return console.error(`[Error]: ${err}`);
		}
	},
};