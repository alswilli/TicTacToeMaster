var Client = {};
Client.socket = io.connect();

//create a callback function
Client.makeNewPlayer = function(){
    console.log("making new player!")
    Client.socket.emit('makeNewPlayer');
};

Client.confirmNewPlayer = function(){
    console.log("confirmed new player with id: " + Client.socket.id)
    game.confirmId(Client.socket.id);
};


Client.socket.on('newplayer',function(data){
                 game.addNewPlayer(data.id,data.x,data.y);
});

Client.socket.on('startGame',function(data){
                 console.log("tell them to start!");
                 game.startMatch(data.id);
                 });

Client.socket.on('opponentFound', function(data){
     game.startMatch()
     //for(var i = 0; i < data.length; i++){
      //  game.addNewPlayer(data[i].id,data[i].x,data[i].y);
     //}
});

Client.socket.on('confirmPlayer',function(data){
    game.assignID(data.id);
    game.assignRoom(data.room);
 });

Client.socket.on('switchTurn',function(data, x, y){
     console.log("sending message to game to switch turn");
     game.updateBoard(data.id, data.board);
     game.synchronizeTurn(data.id, x, y);
});

Client.sendClick = function(board, x, y){
    console.log("Client received sendCClick, now Sending click to server")
    Client.socket.emit('click',board,x, y);
};

Client.socket.on('connectToRoom',function(data) {
                 //for debugging, prints room number
    console.log(data)
});
