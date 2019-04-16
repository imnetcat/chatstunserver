'use strict';

//Установка зависимостей
const express = require('express');
const SocketServer = require('ws').Server;
const path = require('path');

const port = process.env.PORT || 3000;  //берем порт
const host = __filename;

const server = express()
  .use((request, response) => response.sendFile(host) )
  .listen(port, host, () => console.log(`Listening on ${ PORT }`));

const wss = new SocketServer({ server });

wss.on('connection', (ws) => {
  console.log('Client connected');
  ws.on('close', () => console.log('Client disconnected'));
});

setInterval(() => {
  wss.clients.forEach((client) => {
    client.send(new Date().toTimeString());
  });
}, 1000);
