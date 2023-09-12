import Kofi from "./structures/Kofi";

try {
	(async () => {
		const client = new Kofi({ intents: 3276543 });

		await client.events.load();
		client.login(process.env.Token);
	})()
} catch(err) {
	console.error(`[Error]: ${err}`);
}