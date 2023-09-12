import { ShardingManager } from "discord.js";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import dotenv from "dotenv";

dotenv.config();
const manager = new ShardingManager('./dist/Bot.js', { token: process.env.Token, totalShards: 'auto' } );

manager.on('shardCreate', (shard) => {
	console.log(`[Shards]: Launched Shard ${shard.id} • ${new Date().toString()}`);
})
manager.spawn();

const app = new Hono();
app.get('/', (c) => c.text('Hello!'));

serve({
	fetch: app.fetch,
	port: 3000,
});