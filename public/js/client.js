var Client;

function makeClient()
{
    Client = {};
    Client.socket = io.connect();
    //Client.socket = io.connect();


    /*functions that can be called directly form the game to communicate with the server*/
    Client.makeNewPlayer = function(data){
        console.log("making new player!")
        Client.socket.emit('makeNewPlayer', data);
    };

    Client.sendClick = function(data){
        console.log("Client received sendClick from " + data.id +", now Sending click to server")
        Client.socket.emit('click',data);
    };

    Client.askForRematch = function(roomNo){
        console.log("Client received askForRematch, now Sending request to server")
        Client.socket.emit('askForRematch', roomNo);
    };

    Client.notifyQuit = function(){
        console.log("Client received notifyQuit, now Sending request to server")
        Client.socket.emit('playerQuit');
    };

    Client.disconnect = function(){
        console.log("Client received disconnect, now Sending request to server")
        Client.socket.io.disconnect()
        Client.socket.io.reconnect()
        //Client.socket.emit('manualDisconnect');
    };


    /*Callbacks that are called when the server sends a signal with the given name*/
    Client.socket.on('startGame',function(data){
                     console.log("tell them to start!");
                     game.loadOpponent(data);
                     Client.socket.emit('markRoomFull');
    });

    Client.socket.on('confirmPlayer',function(data){
        game.assignID(data.id);
        game.assignRoom(data.room);
                     console.log("confirming!");
     });

    Client.socket.on('switchTurn',function(data, coordInfo){
         console.log("sending message from " + data.id + " to game to switch turn");
        // if(!game.verifyBoard(data.board))
          //  return
         game.updateBoard(data.board, data.id, coordInfo);
         game.synchronizeTurn(data.id, coordInfo);
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
}
