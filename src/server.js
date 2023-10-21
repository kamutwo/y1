const { Hono } = require('hono');

const app = new Hono();
app.get('/', (c) => c.text('Hello!'));

module.exports = app;