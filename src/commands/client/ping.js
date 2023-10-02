const CommandContext = require('../../structures/CommandContext');

module.exports = {
	name: 'ping',
	description: 'pong!!',

	/**
	 * @param {CommandContext} context
	 */
	function: (context) => {
		return context.reply('pong!');
	},
};