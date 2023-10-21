module.exports = (client) => {
	client.logError = async (name, error, channel) => {
		const body = {
			content: `\`\`\`\n${error}\n\`\`\``,
			username: name,
		};

		if (channel) await channel.send('An error occured while running that command.');

		return fetch(process.env.ERROR_CHANNEL_WEBHOOK, {
			method: 'POST',
			headers: {
				'Content-type': 'application/json',
			},
			body: JSON.stringify(body),
		});
	};
};