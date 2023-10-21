const { Client, Collection } = require('discord.js');
const { join } = require('path');
const { glob } = require('glob');

const client = new Client({ intents: 3276543 });
client.events = new Collection();
client.commands = new Collection();
client.selectMenus = new Collection();

(async () => {
	const files = await glob(join(__dirname, './functions').replace(/\\/g, '/') + '/**/*.js');
	for (const path of files) {
		require(path)(client);
	}

	client.loadEvents();
	client.login(process.env.DISCORD_TOKEN);
})();