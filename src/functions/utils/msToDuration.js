const moment = require('moment');

module.exports = (client) => {
	client.msToDuration = (millisecond) => {
		const duration = moment.duration(millisecond);
		const output = [];

		if (duration.days() > 0) output.push(`${duration.days()}d`);
		if (duration.hours() > 0) output.push(`${duration.hours()}h`);
		if (duration.minutes() > 0) output.push(`${duration.minutes()}m`);
		if (duration.seconds() > 0) output.push(`${duration.seconds()}s`);

		return output.join(', ');
	};
};