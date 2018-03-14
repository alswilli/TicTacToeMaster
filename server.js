// Initialize necessary vars
var express = require('express');
var app = express();
var server = require('http').Server(app);
app.use(express.static('public'))

var io = require('socket.io').listen(server);

app.use('/css',express.static(__dirname + '/css'));
app.use('/js',express.static(__dirname + '/js'));
app.use('/imgs',express.static(__dirname + '/imgs'));

//redirect to login
app.get('/',function(req,res){
        res.sendFile(__dirname+'/index.html');
});

//used for running localhost
server.listen(process.env.PORT || 8081,function(){
              console.log('Listening on '+server.address().port);
              });
// Keep track of the last id assigned to a new player
server.lastPlayderID = 0; 
server.roomno = 1;
server.roomSize = 2;

//create rooms for each game
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
      
      // Signals posting of chat message
      socket.on('postChatMessage', function(data){
        console.log("message: " + data.message);
        data.user = socket.player.username; //app.username
        io.sockets.in(socket.player.roomName).emit('chatMessage', data)   
      });

      // Signals posting of chat connection message
      socket.on('chatConnected', function(data){
        io.sockets.in(socket.player.roomName).emit('chatConnection', data)  
      });

      // Signals posting of chat disconnection message
      socket.on('chatDisconnected', function(data){
        if(socket.player != undefined)
                io.sockets.in(socket.player.roomName).emit('chatDisconnection', data)  
      });
      
      //check for accepting a friend's challenge
      socket.on('checkForFriend', function(data){
          console.log("check for the room named " + data.name)
          if(io.sockets.adapter.rooms[data.name] && io.sockets.adapter.rooms[data.name].length > 0)
          {
                console.log(data.name + " exists as a room!")
                var user = data
                user.name = io.sockets.adapter.rooms[data.name].friendName
                socket.emit('confirmChallenge',user);
           }
          else{
                socket.emit('promptFriendChallenge',data);
            }
      });
      
      //called when a challenge is denied
      socket.on('denyChallenge', function(username){
                denyChallenge(username)  
        });
      
      //called disconnects the challenging friend from the room created for their friend on denial
      socket.on('friendDenied', function(roomName){
                console.log("everyone leave " + roomName)
                socket.disconnect();
      })
         
      //logic to handle players in game
      socket.on('makeNewPlayer',function(data){
            //create new player
                //Increase roomno if 2 clients are present in a room.
                var roomName = getRoomName(data)
                console.log("incoming data")
                console.log(data)
                //if there are 2 people in a room, increment the room number so 
                //the next random matching starts in a new room
                if(data.friend === undefined && needNewRoom(data.gametype) && data.challengedByFriend != true)
                {
                    console.log("increment rooms")
                    roomsNo[data.gametype].num++
                    roomName = getRoomName(data)
                }
                if(data.friend === undefined && data.challengedByFriend != true)
                     roomsNo[data.gametype].total++

                console.log("there are now " + roomsNo[data.gametype].total + " players")
                //join the roomName assigned to this player, based on gametype and 
                //if they are random matching or playing a friend
                socket.join(roomName);
                //assign the friend name to the room, if applicable
                if(data.friend != undefined)
                    io.sockets.adapter.rooms[roomName].friendName = data.name
                
                //create an object representing a player
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
                
                console.log("welcome: " + socket.player.username + " to " + socket.player.roomName)
                //broadcast messagess ; Socket.emit() sends a message to one specific socket
                //Here, we send to the newly connected client a message labeled 'allplayers',
                //and as a second argument, the output of Client.getAllPlayers()
                socket.emit('confirmPlayer',socket.player);
                
                //used to send information about a click to both players in a room,
                //i.e used to send the new board to both players
                socket.on('click',function(data)
                {
                    console.log('server received click '+data.board);
                    //if the same board is sent more than onece, ignore it
                    if(JSON.stringify(data.board) === JSON.stringify(socket.player.lastboard))
                    {
                          console.log('double click detected')
                          return
                    }
                    console.log("sent by " + data.id)
            
                    //update board info in the room
                    io.nsps['/'].adapter.rooms[socket.player.roomName].lastid = data.id
                    socket.player.lastboard = data.board
                    socket.player.board = data.board
                    //send message to switch turn in game
                    io.sockets.in(socket.player.roomName).emit('switchTurn',socket.player,data);
                          
                });

                socket.on('forfeit',function(data)
                {
                    console.log("server data.id: ", data.id)
                    io.sockets.in(socket.player.roomName).emit('forfeitTurn', data);           
                });
                
                //keep track of if both players in a room want a rematch or not
                io.nsps['/'].adapter.rooms[socket.player.roomName].readyForRematch = 0;
                socket.on('askForRematch',function(board, x, y)
                {
                    //increment number of people ready for a rematch
                    io.nsps['/'].adapter.rooms[socket.player.roomName].readyForRematch++
                    //if both players are ready, start the rematch
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
                //else challenger is first person in the room
                else
                {
                    io.nsps['/'].adapter.rooms[socket.player.roomName].challenger = socket.player.username
                    io.nsps['/'].adapter.rooms[socket.player.roomName].challengerkey = socket.player.userkey
                    io.nsps['/'].adapter.rooms[socket.player.roomName].lastid = -1
                    console.log(socket.player.roomName + "challenger is " +socket.player.username)
                }
                
                //update room status when a player disconnects
                socket.on('disconnect',function(){ 
                          // sending to all clients in 'game'
                          io.sockets.in(socket.player.roomName).emit('playerLeft')
                          updateRoomStatus(socket.player)
                          socket.disconnect();
                });
                
                //handle player quitting
                socket.on('playerQuit',function(){
                          // sending to all clients in 'game' room, including sender
                          socket.to(socket.player.roomName).emit('playerLeft')
                          updateRoomStatus(socket.player)
                          socket.disconnect();
                });
                
                //indicate that a room is full
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

// Initialize game room 
function initGameRoom(gametype)
{
    roomsNo[gametype] = Object()
    roomsNo[gametype].num = 0
    roomsNo[gametype].total = 0
}

// Creates a new room for when current room is full
function needNewRoom(gametype)
{
    console.log("roomsNo[" + gametype + "] total = " + roomsNo[gametype].total)
    return roomsNo[gametype].total % server.roomSize === 0
}

// Gets name of room passed
function getRoomName(data)
{
    console.log("friend of " + data.name + ": " + data.friend)
    if(data.friend === undefined)
        return "room-"+data.gametype+roomsNo[data.gametype].num//server.roomno
    else if(data.friend === data.name)
        return data.name
    else
        return data.friend
    
}

// Updates statuses for each room 
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

// Denies a challenger's invitation
function denyChallenge(name) {
    io.sockets.in(name).emit('playerLeft') 
}


