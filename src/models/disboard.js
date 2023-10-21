const { Model, Schema } = require('mongoose');

const schema = new Schema({
	guildId: Number,
	channelId: Number,
	previousBump: Number,
});

module.exports = new Model('Disboard', schema);