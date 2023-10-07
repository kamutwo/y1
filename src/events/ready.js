import BotClient from '../structures/BotClient.js';

export default {
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