var express = require('express');

var app  = express()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server);
io.set('transports', [  
  'flashsocket' ,
   'xhr-polling'  
  ]);

app.use(express.static(__dirname + '/public'));
var redis = require('redis');
    server.listen(8000);
       
    io.sockets.on('connection', function(socket) {
        var sub = redis.createClient();
        sub.subscribe('pubsub'); //    listen to messages from channel pubsub

        sub.on("message", function(channel, message) {
	    console.log("message: " + message );
            socket.emit('message', {hello: message});
        });
	
        socket.on('message', function(msg) {
        });

        socket.on('disconnect', function() {
            subscribe.quit();
        });
    });
