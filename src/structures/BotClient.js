const { Client, Collection, Locale } = require('discord.js');
const { resolve, basename } = require('path');
const { glob } = require('glob');

/**
 * @typedef {Object} Command
 * @property {string} name The name of the command, must be in all lowercase if type is {@link ApplicationCommandType.ChatInput}
 * @property {Object<Locale, string>} [nameLocal] The localizations for the command name
 * @property {string} description The description of the command, if type is {@link ApplicationCommandType.ChatInput}
 * @property {Object<Locale, string>} [descriptionLocal] The localizations for the command description, if type is {@link ApplicationCommandType.ChatInput}
 * @property {import('discord.js').ApplicationCommandOptionData[]} [options] Options for the command
 * @property {?import('discord.js').PermissionResolvable} [userPermission] The bitfield used to determine the default permissions a member needs in order to run the command
 * @property {boolean} [dmPermission] Whether the command is enabled in DMs
 * @property {boolean} [nsfw] Whether the command is age-restricted
 *
 * @property {Function} function The function of the command
 */

/**
 * The main hub for interacting with the Discord API, and the starting point for any bot.
 * @extends Client
 */
class BotClient extends Client {
	/**
	 * @param {import('discord.js').ClientOptions} options  Options for the client
	 */
	constructor(options) {
		super(options);

		/**
		 * All of the commands the client is currently managing.
		 * @type {Collection<string,Command>}
		 */
		this.commands = new Collection();

		/**
		 * All of the events the client is currently managing.
		 * @type {Collection<string,Event>}
		 */
		this.events = new Collection();
	}

	/**
	 * @returns {Promise<Collection<string,Event>>}
	 */
	async loadEvents() {
		const files = await glob(`${resolve(__dirname, '../events').replace(/\\/g, '/')}/**/*.js`);
		files.forEach((file) => {
			delete require.cache[require.resolve(file)];

			const event = require(file);
			if (event.once) {
				this.once(event.eventName, event.listener);
			}
			else {
				this.on(event.eventName, event.listener);
			}
			this.events.set(event.eventName, event);
		});
		return this.events;
	}

	/**
	 * @returns {Promise<Collection<string,Command>>}
	 */
	async loadCommands() {
		const files = await glob(`${resolve(__dirname, '../commands').replace(/\\/g, '/')}/**/*.js`);
		const appCommands = files.map((file) => {
			delete require.cache[require.resolve(file)];

			const command = this.constructor.transformCommand(require(file));
			this.commands.set(basename(file), command);

			return command;
		});
		await this.application?.commands.set(appCommands);

		return this.commands;
	}

	/**
	 * @param {Command} command
	 * @private
	 */
	static transformCommand(command) {
		return {
			nsfw: command.nsfw ?? false,
			name: command.name,
			nameLocalizations: command.nameLocal ?? null,
			description: command.description,
			descriptionLocalizations: command.descriptionLocal ?? null,
			options: command.options ?? [],
			defaultMemberPermissions: command.userPermission ?? null,
			dmPermission: command.dmPermission ?? true,

			function: command.function,
		};
	}
}

module.exports = BotClient;