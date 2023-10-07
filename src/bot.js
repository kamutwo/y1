import BotClient from './structures/BotClient.js';

(async () => {
	const client = new BotClient({ intents: 3276543 });
	await client.loadEvents();

	client.login(process.env.Token);
})();