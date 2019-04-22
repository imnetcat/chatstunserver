var WebSocketServer = require("ws").Server;
var http = require("http");
var express = require("express");
var app = express();
var port = process.env.PORT || 5000;

app.use(express.static(__dirname + "/"));

var server = http.createServer(app);
server.listen(port);

var wss = new WebSocketServer({server: server});
console.log("Server created | port: " + port);

var CLIENTS = new Array();

wss.on("connection", function(sock) {
  console.log("websocket connection open");
  
  var id = CLIENTS.length;
  
  var tmp = new CLIENT(sock, "");
  CLIENTS.push(tmp);
  
  sock.on("message", function(data) {
    var arr = data.split("{");
    if(arr.length > 2){ 
      // message {receiver}{message}
      var receiver = arr[1].split("}")[0];
      var message = arr[2].split("}")[0];
      console.log("message: " + message); 
      console.log("receiver: " + receiver); 
      var n = 0;
      while(n < CLIENTS.length){
        if(CLIENTS[n].nickg == receiver){
          break;
        }
        n++;
      }
      if(n != CLIENTS.length){
        console.log(n + " != " + CLIENTS.length);
        CLIENTS[n].socketg.send(message);
        console.log("message was send");
      }else{
        console.log("receiver not found");
      }
    }else{
      // set nickname {nickname}
      console.log("the nick name set " + arr[1].split("}")[0]);
      CLIENTS[id].nicks = arr[1].split("}")[0];
    }
  });
  
  sock.on("close", function(event) {
    while(CLIENTS.length <= id){
      id--;
    }
    console.log("Connection with " + CLIENTS[id].nickg +" close");
    CLIENTS.splice(id, 1);
  });
});

function sendAll (message) {
    for (var i=0; i<CLIENTS.length; i++) {
        CLIENTS[i].socketg.send(message);
    }
}

class CLIENT {
  constructor(socket, nick) { 
    this.socket = socket;
    this.nick = nick;
  }
  get socketg() {
    return this.socket;
  }
  set sockets(newValue) {
    this.socket = newValue;
  }
  get nickg() {
    return this.nick;
  }
  set nicks(newValue) {
    this.nick = newValue;
  }
}

setInterval(() => {
  wss.clients.forEach((client) => {
    client.send("ping");
  });
}, 10000);
