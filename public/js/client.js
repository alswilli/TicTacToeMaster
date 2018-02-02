var Client = {};
Client.socket = io.connect();

/*functions that can be called directly form the game to communicate with the server*/
Client.makeNewPlayer = function(){
    console.log("making new player!")
    Client.socket.emit('makeNewPlayer');
};

Client.sendClick = function(board, x, y){
    console.log("Client received sendCClick, now Sending click to server")
    Client.socket.emit('click',board,x, y);
};

Client.askForRematch = function(roomNo){
    console.log("Client received askForRematch, now Sending request to server")
    Client.socket.emit('askForRematch', roomNo);
};

/*Callbacks that are called when the server sends a signal with the given name*/
Client.socket.on('startGame',function(data){
                 console.log("tell them to start!");
                 game.startMatch(data.id);
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

Client.socket.on('restartGame',function(data) {
    //for debugging, prints room number
    console.log("sending message to game to restart");
    game.restartMatch()
    console.log(data)
});

Client.socket.on('connectToRoom',function(data) {
                 //for debugging, prints room number
    console.log(data)
});

Client.socket.on('playerLeft',function(data) {
    game.handleOpponentLeaving()
});
