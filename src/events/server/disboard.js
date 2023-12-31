const { Message } = require('discord.js');
const moment = require('moment');

module.exports = {
	eventName: 'messageCreate',

	/**
	 * @param {Message} message
	 */
	listener: async (message) => {
		if (message.author.id !== '302050872383242240' || message.channel.id !== '1065986146028503131') return;

		await message.channel.setTopic(`Bumped <t:${moment(message.createdAt).unix()}:R>; the next bump is <t:${moment(message.createdAt).add(2, 'hour').unix()}:R>`);
		const interval = setInterval(async () => {
			if (moment(Date.now()).unix() > moment(message.createdAt).add(2, 'hour').unix()) {
				await message.channel.setTopic(`Bumped <t:${moment(message.createdAt).unix()}:R>; the next bump is **available**`);
				clearInterval(interval);
			}
		}, 1000);
	},
};