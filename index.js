const { ShardingManager } = require('discord.js');
const { serve } = require('@hono/node-server');
const { config } = require('dotenv');
const app = require('./src/server.js');
const mongoose = require('mongoose');
require('dotenv').config();

config();
serve(app, (info) => {
	console.log(`[Hono]: Listening on http://localhost:${info.port}`);
});
mongoose.connect(`mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@youone.vpbhiqt.mongodb.net/?retryWrites=true&w=majority`);

const manager = new ShardingManager('./src/bot.js', { token: process.env.DISCORD_TOKEN, totalShards: 'auto' });
manager.on('shardCreate', (shard) => {
	console.log(`[Shard]: Launched Shard ${shard.id} • ${new Date().toString()}`);
});
manager.spawn();
