(async () => {
	const BotClient = require('./structures/BotClient');

	const client = new BotClient({ intents: 3276543 });
	await client.loadEvents();

	client.login(process.env.Token);
})();