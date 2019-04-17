var WebSocketServer = require("ws").Server;
var http = require("http");
var express = require("express");
var app = express();
var port = process.env.PORT || 5000;

app.use(express.static(__dirname + "/"));

var server = http.createServer(app);
server.listen(port);

var wss = new WebSocketServer({server: server});
console.log("websocket server created");

var CLIENTS = new Array();

wss.on("connection", function(sock) {
  console.log("websocket connection open");
  
  var id = CLIENTS.length;
  
  var tmp = new CLIENT(sock, "");
  CLIENTS.push(tmp);
  
  sock.on("message", function(data) {
    var arr = data.split("{");
    if(arr.length > 1){ 
      // message {receiver}{message}
      var receiver = arr[1].split("}")[0];
      var message = arr[2].split("}")[0];
      var n = 0;
      while(n < CLIENTS.length){
        if(CLIENTS[n].nick() == receiver){
          break;
        }
      }
      if(n != CLIENTS.length){
        CLIENTS[n].socket().send(message);
      }
    }else{
      // set nickname {nickname}
      CLIENTS[id].nick(arr[1].split("}")[0]);
    }
  });
  
  ws.on("close", function() {
    console.log("websocket connection close");
    CLIENTS.splice(id, 1);
  });
});

function sendAll (message) {
    for (var i=0; i<CLIENTS.length; i++) {
        CLIENTS[i].socket().send(message);
    }
}

class CLIENT {
  constructor(socket, nick) { 
    this.socket = socket;
    this.nick = nick;
  }
  get socket() {
    return '${this.socket}';
  }
  set socket(newValue) {
    this.socket = newValue;
  }
  get nick() {
    return '${this.firstName}';
  }
  set nick(newValue) {
    this.nick = newValue;
  }
}
