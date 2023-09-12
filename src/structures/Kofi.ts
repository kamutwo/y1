import { Client, ClientOptions } from 'discord.js'
import Events from './Handler';

class Kofi extends Client {
	events: Events;

	constructor(options: ClientOptions) {
		super(options);

		this.events = new Events(this, '../events');
	}
}

export default Kofi