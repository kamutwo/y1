import { ShardingManager } from 'discord.js';
import { serve } from '@hono/node-server';
import { config } from 'dotenv';
import app from './src/server.js';

config();
serve(app, (info) => {
	console.log(`[Hono]: Listening on http://localhost:${info.port}`);
});

const manager = new ShardingManager('./src/Bot.js', { token: process.env.Token, totalShards: 'auto' });
manager.on('shardCreate', (shard) => {
	console.log(`[Shard]: Launched Shard ${shard.id} • ${new Date().toString()}`);
});
manager.spawn();
