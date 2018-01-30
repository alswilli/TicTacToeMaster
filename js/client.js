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
                 Game.addNewPlayer(data.id,data.x,data.y);
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

Client.socket.on('switchTurn',function(data){
     console.log("sending message to game to switch turn");
     game.updateBoard(data.id, data.board);
     game.switchTurn();
});

Client.sendClick = function(board){
    console.log("Client received sendCClick, now Sending click to server")
    Client.socket.emit('click',board);
};

Client.socket.on('connectToRoom',function(data) {
                 //for debugging, prints room number
    console.log(data)
});
