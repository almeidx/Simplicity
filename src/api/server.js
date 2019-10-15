'use strict';

const express = require('express');

function start(client) {
  const app = express();

  app.use(express.json());

  const { commands, users, guilds } = client;
  app.get('/', (_, res) => res.json({
    commands: commands.size,
    users: users.size,
    guilds: guilds.size,
    ping: client.ping,
    uptime: client.uptime,
    ram: (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2),
  }));

  app.listen(process.env.PORT || 3000, () => console.log(`Online na porta ${5000}`));
}

module.exports = start;
