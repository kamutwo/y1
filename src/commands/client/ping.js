export default {
	name: 'ping',
	description: 'pong!!',

	/**
	 * @param {import('discord.js').Interaction} interaction
	 */
	function: (interaction) => {
		return interaction.reply('pong!');
	},
};