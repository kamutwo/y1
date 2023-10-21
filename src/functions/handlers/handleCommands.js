const { join } = require('path');
const { glob } = require('glob');

module.exports = (client) => {
	client.loadCommands = async () => {
		const files = await glob(join(__dirname, '../../commands').replace(/\\/g, '/') + '/**/*.js');
		const commands = [];

		for (const path of files) {
			delete require.cache[require.resolve(path)];

			const command = require(path);
			client.commands.set(command.data.name, command);

			commands.push(command.data);
		}
		client.application?.commands.set(commands);
	};
};