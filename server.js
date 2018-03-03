var express = require('express');
var app = express();
var server = require('http').Server(app);
//app.use(express.static(__dirname + '/Public'));
app.use(express.static('public'))

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
        res.sendFile(__dirname+'/index.html');
});

server.listen(process.env.PORT || 8081,function(){
              console.log('Listening on '+server.address().port);
              });

server.lastPlayderID = 0; // Keep track of the last id assigned to a new player
server.roomno = 1;
server.roomSize = 2;

var roomsNo = {}
initGameRoom("original")
initGameRoom("3d")
initGameRoom("orderChaos")
initGameRoom("ultimate")



/*
 -listen to connections from clients and define callbacks to process the messages sent through the sockets
 - When we receive the 'newplayer' message from a client, we create a small player object that
 we store in the socket of the client
 - To the new client, we send a list of all the other players, so that he can display them
 - To the other clients, we send the information about the newcomer
 */

//when a new connection is established, call falling function
io.on('connection',function(socket)
{
      console.log("new connection!")
      
      
      socket.on('postChatMessage', function(data){
        console.log("message: " + data.message);
        data.user = socket.player.username; //app.username
        // socket.emit('chatMessage', msg);
        io.sockets.in(socket.player.roomName).emit('chatMessage', data)  
        // io.emit('chatMessage', data) 
      });

      socket.on('chatConnected', function(data){
        // console.log("message: " + data.message);
        io.sockets.in(socket.player.roomName).emit('chatConnection', data)  
      });

      socket.on('chatDisconnected', function(data){
        // console.log("message: " + data.message);
        io.sockets.in(socket.player.roomName).emit('chatDisconnection', data)  
      });
         
      socket.on('makeNewPlayer',function(data){
            //create new player
                //Increase roomno if 2 clients are present in a room.
                var roomName = getRoomName(data)
                if(needNewRoom(data.gametype))
                //(io.nsps['/'].adapter.rooms[roomName] && io.nsps['/'].adapter.rooms[roomName].length >= server.roomSize)
                {
                    roomsNo[data.gametype].num++
                    roomName = getRoomName(data)
                }
                roomsNo[data.gametype].total++
                console.log("there are now " + roomsNo[data.gametype].total + " players")
                socket.join(roomName);
                
                
                
                //Send this event to everyone in the room. Fore debugging
                //io.sockets.in("room-"+data.gametype+server.roomno).emit('connectToRoom', "You are in room no. "+server.roomno);
                
                socket.player =
                {
                    id: server.lastPlayderID++,
                    board: [["","",""],["","",""],["","",""]],
                    roomNo: server.roomno,
                    username: data.name,
                    gametype: data.gametype,
                    userkey: data.userkey,
                    roomName: roomName,
                    inFullRoom: false,
                };
                
                //io.nsps['/'].adapter.rooms[socket.player.roomName].full = false
                
                console.log("welcome: " + socket.player.username + " to " + socket.player.roomName)
                //broadcast messagess ; Socket.emit() sends a message to one specific socket
                //Here, we send to the newly connected client a message labeled 'allplayers',
                //and as a second argument, the output of Client.getAllPlayers()
                socket.emit('confirmPlayer',socket.player);
                
                socket.on('click',function(data)
                {
                    console.log('server received click '+data.board);
                    if(JSON.stringify(data.board) === JSON.stringify(socket.player.lastboard))
                          {
                          console.log('wut')
                          return
                          }
                    console.log("sent by " + data.id)
                    if(io.nsps['/'].adapter.rooms[socket.player.roomName].lastid === data.id)
                    {
                          console.log('wut duh')
                          console.log(io.nsps['/'].adapter.rooms[socket.player.roomName].lastid + " " + data.id)
                          return
                    }
                    io.nsps['/'].adapter.rooms[socket.player.roomName].lastid = data.id
                    socket.player.lastboard = data.board
                    socket.player.board = data.board
                    io.sockets.in(socket.player.roomName).emit('switchTurn',socket.player,data);
                          
                });
                
                //keep track of if both players in a room want a rematch or not
                io.nsps['/'].adapter.rooms[socket.player.roomName].readyForRematch = 0;
                socket.on('askForRematch',function(board, x, y)
                {
                          //increment number of people ready for a rematch
                    io.nsps['/'].adapter.rooms[socket.player.roomName].readyForRematch++
                    if(io.nsps['/'].adapter.rooms[socket.player.roomName].readyForRematch >= server.roomSize)
                    {
                        // sending to all clients in 'game'
                        io.sockets.in(socket.player.roomName).emit('restartGame', socket.player);
                        io.nsps['/'].adapter.rooms[socket.player.roomName].readyForRematch = 0;
                    }
                    
                });
                
                //Increase roomno if 2 clients are present in a room.
                if(io.nsps['/'].adapter.rooms[socket.player.roomName].length >= server.roomSize)
                {
                
                    socket.player.challenger = io.nsps['/'].adapter.rooms[socket.player.roomName].challenger
                    socket.player.challengerkey = io.nsps['/'].adapter.rooms[socket.player.roomName].challengerkey
                    console.log("start the game, " +socket.player.roomName)
                    // sending to all clients in 'game'
                    io.sockets.in(socket.player.roomName).emit('startGame', socket.player);
                }
                //challenger is first person in the room
                else
                {
                    io.nsps['/'].adapter.rooms[socket.player.roomName].challenger = socket.player.username
                    io.nsps['/'].adapter.rooms[socket.player.roomName].challengerkey = socket.player.userkey
                    io.nsps['/'].adapter.rooms[socket.player.roomName].lastid = -1
                    console.log(socket.player.roomName + "challenger is " +socket.player.username)
                }
                
                /*socket.on('disconnect',function(){
                    // sending to all clients in 'game'
                    io.sockets.in(socket.player.roomName).emit('playerLeft')
                });*/
                
                socket.on('disconnect',function(){ //change this
                          // sending to all clients in 'game'
                          io.sockets.in(socket.player.roomName).emit('playerLeft')
                          updateRoomStatus(socket.player)
                });
                
                socket.on('playerQuit',function(){
                          // sending to all clients in 'game' room, including sender
                          socket.to(socket.player.roomName).emit('playerLeft')
                          updateRoomStatus(socket.player)
                });
                
                socket.on('markRoomFull',function(){
                          socket.player.inFullRoom = true;
                          console.log(socket.player.username + " is in a full room ")
                });
                
                socket.on('manualDisconnect',function(){
                          console.log(socket.player.username + " disconnecting")
                          socket.disconnect()
                 });
                
                
            }
                
        );
      }
);

function initGameRoom(gametype)
{
    roomsNo[gametype] = Object()
    roomsNo[gametype].num = 0
    roomsNo[gametype].total = 0
}

function needNewRoom(gametype)
{
    return roomsNo[gametype].total % server.roomSize === 0
}
function getRoomName(data)
{
    return "room-"+data.gametype+roomsNo[data.gametype].num//server.roomno
}

function updateRoomStatus(data)
{
    console.log(data.username + " left " + data.roomName)
    console.log("there were " + roomsNo[data.gametype].total)
    if(!data.inFullRoom && !needNewRoom(data.gametype))
    {
        roomsNo[data.gametype].total++
    }

     console.log("now there are " +roomsNo[data.gametype].total)
}


function randomInt (low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}
