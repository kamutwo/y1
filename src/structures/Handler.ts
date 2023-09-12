import { Collection } from "discord.js";
import { glob } from "glob";
import path from "path";
import Kofi from "./Kofi";

class Events extends Collection<string, EventListener> {
	client: Kofi;
	folder: string;

	constructor(client: Kofi, folder: string) {
		super();

		this.client = client
		this.folder = folder;
		if (!path.isAbsolute(folder)) {
			this.folder = path.resolve(__dirname, folder);
		}
	}

	async load() {
		const files: string[] = await glob(`${this.folder.replace(/\\/g, '/')}/**/*.js`);

		files.forEach((file) => {
			delete require.cache[require.resolve(file)];
			const a = require(file);

			const event: any = new a(this.client);

			const listener = (...args: any) => {
				try {
					void event.main(...args);
				}
				catch (err) {
					return console.error(`[Event Error]: ${err}`);
				}
			};
			this.set(event.name, listener);

			if (event.once) {
				this.client.once(event.name, listener);
			}
			else {
				this.client.on(event.name, listener);
			}
		});
	}
}

export default Events