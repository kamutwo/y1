import moment from 'moment';

/**
 * Returns a formatted duration.
 * @param {number} millisecond
 * @returns {string}
 */
function msToDuration(millisecond) {
	const duration = moment.duration(millisecond);
	const output = [];

	if (duration.days() > 0) {
		output.push(`${duration.days()} Day${duration.days() > 1 ? 's' : ''}`);
	}

	if (duration.hours() > 0) {
		output.push(`${duration.hours()} Day${duration.hours() > 1 ? 's' : ''}`);
	}

	if (duration.minutes() > 0) {
		output.push(`${duration.minutes()} Day${duration.minutes() > 1 ? 's' : ''}`);
	}

	if (duration.seconds() > 0) {
		output.push(`${duration.seconds()} Day${duration.seconds() > 1 ? 's' : ''}`);
	}

	return output.join(', ');
}

export default { msToDuration };