var WebSocketServer = require("ws").Server;
var http = require("http");
var express = require("express");
var app = express();
var port = process.env.PORT || 5000;

app.use(express.static(__dirname + "/"));

var server = http.createServer(app);
server.listen(port);

var wss = new WebSocketServer({server: server});
console.log("Server open");

var CLIENTS = new Array();

wss.on("connection", function(sock) {
  console.log("ws server connection open!");
  var id = CLIENTS.length;
  
  var tmp = new CLIENT(sock, "");
  CLIENTS.push(tmp);
  
  sock.on("message", function(data) {
    var arr = data.split("{");
    if(arr.length > 2){ 
      // message {sender}{receiver}{message}
      var receiver = arr[2].split("}")[0];
      console.log("receiver: " +receiver);
      var n = 0;
      while(n < CLIENTS.length){
        console.log("if " + CLIENTS[n].nickg+" == "+receiver);
        if(CLIENTS[n].nickg == receiver){
          break;
        }
        n++;
      }
      console.log("n: " +n);
      console.log("CLIENTS.length: " +CLIENTS.length);
      if(n != CLIENTS.length){
        console.log("CLIENTS[n].socketg: " +CLIENTS[n].socketg);
        CLIENTS[n].socketg.send(data);
      }
    }else{
      // set nickname {nickname}
      var nick = arr[1].split("}")[0];
      for(var n = 0; n < CLIENTS.length; n++){
        if(CLIENTS[n].nicks == nick)
          break;
      }
      if(n == CLIENTS.length){
        CLIENTS[id].nicks = nick;
        CLIENTS[id].socketg.send("true");
        console.log(nick + " connected");
      }else{
        CLIENTS[id].socketg.send("false");
        CLIENTS[id].socketg.close();
      }
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
