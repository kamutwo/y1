const { Client } = require('discord.js');

module.exports = {
	eventName: 'ready',
	once: true,

	/**
	 * @param {Client} client
	 */
	listener: async (client) => {
		client.loadCommands();
		console.log(`[Event]: ${client.user?.username} is online.`);
	},
};