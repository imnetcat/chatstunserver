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
    console.log("message " + data);
    console.log("arr[0] " + arr[0]);
    if(arr.length > 1){ 
      // message {receiver}{message}
      var receiver = arr[1].split("}")[0];
      var message = arr[2].split("}")[0];
      var n = 0;
      while(n < CLIENTS.length){
        if(CLIENTS[n].nickg() == receiver){
          break;
        }
      }
      if(n != CLIENTS.length){
        CLIENTS[n].socketg().send(message);
        console.log("message was send");
      }
    }else{
      // set nickname {nickname}
      console.log("the nick name set " + arr[1].split("}")[0]);
      CLIENTS[id].nicks(arr[1].split("}")[0]);
    }
  });
  
  sock.on("close", function() {
    console.log("websocket connection close");
    CLIENTS.splice(id, 1);
  });
});

function sendAll (message) {
    for (var i=0; i<CLIENTS.length; i++) {
        CLIENTS[i].socketg().send(message);
    }
}

class CLIENT {
  constructor(socket, nick) { 
    this.socket = socket;
    this.nick = nick;
  }
  get socketg() {
    return '${this.socket}';
  }
  set sockets(newValue) {
    this.socket = newValue;
  }
  get nickg() {
    return '${this.firstName}';
  }
  set nicks(newValue) {
    this.nick = newValue;
  }
}
