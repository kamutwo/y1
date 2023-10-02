const BotClient = require('../structures/BotClient');

module.exports = {
	eventName: 'ready',
	once: true,

	/**
	 * @param {BotClient} client
	 */
	listener: async (client) => {
		await client.loadCommands();

		console.log(`[Event]: ${client.user?.username} is online.`);
	},
};