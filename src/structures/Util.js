import { Message, TextChannel } from 'discord.js';
import moment from 'moment';
import fetch from 'node-fetch';

/**
 * Returns a formatted duration.
 * @param {number} millisecond
 * @returns {string}
 */
function msToDuration(millisecond) {
	const duration = moment.duration(millisecond);
	const output = [];

	if (duration.days() > 0) {
		output.push(`${duration.days()}d`);
	}

	if (duration.hours() > 0) {
		output.push(`${duration.hours()}h`);
	}

	if (duration.minutes() > 0) {
		output.push(`${duration.minutes()}m`);
	}

	if (duration.seconds() > 0) {
		output.push(`${duration.seconds()}s`);
	}

	return output.join(', ');
}

/**
 * @param {unknown} error
 * @param {TextChannel} channel
 */
async function logError(name, error, channel) {
	const body = {
		content: `\`\`\`\n${error}\n\`\`\``,
		username: name,
	};

	fetch(process.env.ERROR_CHANNEL_WEBHOOK, {
		method: 'POST',
		headers: {
			'Content-type': 'application/json',
		},
		body: JSON.stringify(body),
	});

	if (channel) await channel.send('An error occured while running that command.');
}

export default { msToDuration, logError };