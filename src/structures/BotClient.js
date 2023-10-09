import { Client, Collection, Locale } from 'discord.js';
import { join, dirname, basename } from 'path';
import { pathToFileURL } from 'url';
import { glob } from 'glob';
import Util from './Util.js';

const moduleURL = new URL(import.meta.url);
const __dirname = dirname(moduleURL.pathname);

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
 * @property {Function} function The command function
 */

/**
 * @typedef {Object} Event
 * @property {string} eventName The name of the event
 * @property {?boolean} once Whether the listener is destroyed after invoke
 *
 * @property {Function} listener The event listener
 */

/**
 * The main hub for interacting with the Discord API, and the starting point for any bot.
 * @extends Client
 */
export default class extends Client {
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

		/**
		 * The bot utilities.
		 * @type {Object}
		 */
		this.utils = Util;
	}

	/**
	 * @returns {Promise<Collection<string,Event>>}
	 */
	async loadEvents() {
		try {
			const files = await glob(join(__dirname, '../events').replace(/\\/g, '/') + '/**/*.js');

			files.forEach(async (file) => {
				/**
				 * @type {Event}
				 */
				const event = (await import(pathToFileURL(file))).default;
				if (event.once) {
					this.once(event.eventName, async (...args) => {
						try {
							await event.listener(...args);
						}
						catch (error) {
							this.utils.logError(`[Event Error]: ${basename(file)}`, error);
						}
					});
				}
				else {
					this.on(event.eventName, async (...args) => {
						try {
							await event.listener(...args);
						}
						catch (error) {
							this.utils.logError(`[Event Error]: ${basename(file)}`, error);
						}
					});
				}
				this.events.set(event.eventName, event);
			});
			return this.events;
		}
		catch (err) {
			console.log(`[Error]: ${err}`);
		}
	}

	/**
	 * @returns {Promise<Collection<string,Command>>}
	 */
	async loadCommands() {
		const files = await glob(join(__dirname, '../commands').replace(/\\/g, '/') + '/**/*.js');
		const appCommands = [];

		for (const file of files) {
			/**
			 * @type {Command}
			 */
			const command = this.constructor.transformCommand((await import(pathToFileURL(file))).default);
			this.commands.set(command.name, command);

			appCommands.push(command);
		}
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