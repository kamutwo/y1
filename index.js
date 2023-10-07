import { ShardingManager } from 'discord.js';
import { config } from 'dotenv';
config();

const manager = new ShardingManager('./src/Bot.js', { token: process.env.Token, totalShards: 'auto' });
manager.on('shardCreate', (shard) => {
	console.log(`[Shard]: Launched Shard ${shard.id} • ${new Date().toString()}`);
});
manager.spawn();