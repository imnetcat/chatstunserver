'use strict';

const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });
 
wss.on('connection', function connection(wss) {
  wss.on('message', function incoming(message) {
    console.log('received: %s', message);
  });
 
  wss.send('something');
});
