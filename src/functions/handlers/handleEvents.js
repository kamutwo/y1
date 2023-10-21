const { join, basename } = require('path');
const { glob } = require('glob');

module.exports = (client) => {
	client.loadEvents = async () => {
		const files = await glob(join(__dirname, '../../events').replace(/\\/g, '/') + '/**/*.js');
		for (const path of files) {
			delete require.cache[require.resolve(path)];

			const event = require(path);
			const fn = async (...args) => {
				try {
					await event.listener(...args);
				}
				catch (error) {
					client.logError(`[Event Error]: ${basename(path)}`, error);
				}
			};

			if (event.once) client.once(event.eventName, fn);
			else client.on(event.eventName, fn);

			client.events.set(event.eventName, fn);
		}
	};
};