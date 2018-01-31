var express = require('express');
var app = express();
var server = require('http').Server(app);

//var app = require('express')();
//var http = require('http').Server(app);
//var io = require('socket.io')(http);

//app.get('/', function(req, res) {
//        res.sendfile('index.html');
//});


var io = require('socket.io').listen(server);

app.use('/css',express.static(__dirname + '/css'));
app.use('/js',express.static(__dirname + '/js'));
app.use('/imgs',express.static(__dirname + '/imgs'));

app.get('/',function(req,res){
        res.sendFile(__dirname+'/game.html');
        });

server.listen(process.env.PORT || 8081,function(){
              console.log('Listening on '+server.address().port);
              });

server.lastPlayderID = 0; // Keep track of the last id assigned to a new player
server.roomno = 1;


/*
 -listen to connections from clients and define callbacks to process the messages sent through the sockets
 - When we receive the 'newplayer' message from a client, we create a small player object that
 we store in the socket of the client
 - To the new client, we send a list of all the other players, so that he can display them
 - To the other clients, we send the information about the newcomer
 */

//when a new connection is established, call falling function
io.on('connection',function(socket){
      console.log("new connection!")
      
      
     
      
      socket.on('makeNewPlayer',function(){
            //create new player
                //Increase roomno if 2 clients are present in a room.
                if(io.nsps['/'].adapter.rooms["room-"+server.roomno] && io.nsps['/'].adapter.rooms["room-"+server.roomno].length > 1)
                {
                server.roomno++;
                }
                socket.join("room-"+server.roomno);
                
                //Send this event to everyone in the room.
                io.sockets.in("room-"+server.roomno).emit('connectToRoom', "You are in room no. "+server.roomno);
                
                socket.player =
                {
                id: server.lastPlayderID++,
                board: [["","",""],["","",""],["","",""]],
                roomNo: server.roomno
                };
            
                //broadcast messagess ; Socket.emit() sends a message to one specific socket
                //Here, we send to the newly connected client a message labeled 'allplayers',
                //and as a second argument, the output of Client.getAllPlayers()
                socket.emit('confirmPlayer',socket.player);

                
                
                socket.on('click',function(board, x, y){
                    console.log('server received click '+board);
                    socket.player.board = board
                    io.sockets.in("room-"+socket.player.roomNo).emit('switchTurn',socket.player, x, y);
                          
                });
                
                //Increase roomno if 2 clients are present in a room.
                if(io.nsps['/'].adapter.rooms["room-"+socket.player.roomNo].length > 1)
                {
                    console.log("start the game, roomNo " +socket.player.roomNo)
                    // sending to all clients in 'game'
                    io.sockets.in("room-"+socket.player.roomNo).emit('startGame', socket.player);
                }
            }
                
                
            
        );
      }
);

function getAllPlayers(){
    var players = [];
    //io.sockets.connected is a Socket.io internal array of the sockets currently connected to the server
    Object.keys(io.sockets.connected).forEach(function(socketID){
        var player = io.sockets.connected[socketID].player;
        if(player) {
            players.push(player);
        }
    });
    return players;
}

function randomInt (low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}
