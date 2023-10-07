import { Message } from 'discord.js';
import moment from 'moment';

export default {
	eventName: 'messageCreate',

	/**
	 * @param {Message} message
	 */
	listener: async (message) => {
		if (message.author.id !== '302050872383242240' || message.channel.id !== '1065986146028503131') return;

		message.channel.setTopic(`Bumped <t:${moment(message.createdAt).unix()}:R>; the next bump is <t:${moment(message.createdAt).add(2, 'hour').unix()}:R>`);
	},
};