import { GuildMember } from 'discord.js';

export default {
	eventName: 'guildMemberAdd',

	/**
	 * @param {GuildMember} member
	 */
	listener: async (member) => {
		if (member.guild.id !== '1065959450323734609') return;

		await member.roles.add(member.guild.roles.fetch('1065989746700066926'));
	},
};