var Client;

function makeClient() {
   Client = {};
   Client.socket = io.connect();

/*functions that can be called directly form the game to communicate with the server*/
   Client.chatMessage = function (data) {
      console.log("sending new message!")
      console.log("Message at client: ", data.message)
      Client.socket.emit('postChatMessage', data);
   };

   Client.connectedToChat = function (data) {
      console.log("Opponent connected: ", data.opponent)
      Client.socket.emit('chatConnected', data);
   }

   Client.disconnectedFromChat = function (data) {
      console.log("Opponent disconnected: ", data.opponent)
      Client.socket.emit('chatDisconnected', data);
   }

   Client.makeNewPlayer = function (data) {
      console.log("making new player!")
      console.log(data)
      Client.socket.emit('makeNewPlayer', data);
   };

   Client.forfeit = function (data) {
      console.log("data id:", data.id)
      Client.socket.emit('forfeit', data);
   };

   Client.sendClick = function (data) {
      console.log("Client received sendClick from " + data.id + ", now Sending click to server")
      Client.socket.emit('click', data);
   };

   Client.askForRematch = function (roomNo) {
      console.log("Client received askForRematch, now Sending request to server")
      Client.socket.emit('askForRematch', roomNo);
   };

   Client.notifyQuit = function () {
      console.log("Client received notifyQuit, now Sending request to server")
      Client.socket.emit('playerQuit');
   };

   Client.disconnect = function () {
      console.log("Client received disconnect, now Sending request to server")
      Client.socket.io.disconnect()
      Client.socket.io.reconnect()
   };

   Client.checkForFriendChallenge = function (data) {
      Client.socket.emit('checkForFriend', data)
   };

   Client.acceptFriendChallenge = function (data) {
      data.challengedByFriend = true
      console.log("accept friend challenge!")
      Client.socket.emit('makeNewPlayer', data);
   };

   Client.denyChallenge = function (username) {
      Client.socket.emit('denyChallenge', username);
   };

   /*Callbacks that are called when the server sends a signal with the given name*/
   Client.socket.on('chatMessage', function (msg) {
      console.log("back in client!")
      
      // Get notification count for cleint
      var notificationCount = game.notificationCount;
      console.log("Notification Count: ", game.notificationCount)
      notificationCount++
      game.notificationCount++
      console.log("Notification Count After: ", notificationCount)
      var strNotif = notificationCount.toString()

      // Set html elements related to notifications in chat box
      document.getElementById("notifications").innerHTML = "(" + strNotif + ")";
      document.getElementById("notifications").style.visibility = "visible";
      document.getElementById("notifications").style.color = "red";
      if (document.getElementById("inputBox").style.visibility == "visible") {
         document.getElementById("notifications").style.visibility = "hidden";
      }

      // Append message to chat div
      $('#messages').append($('<li>').text(msg.user + ": " + msg.message));
   });

   Client.socket.on('chatConnection', function (msg) {
      console.log("connection in chat!")
      
      // Append connection message to chat div
      $('#messages').append($('<ul>').text(msg.opponent + " connected!"));
   });

   Client.socket.on('chatDisconnection', function (msg) {
      console.log("disconnection from chat!")
    
      // Append disconnection message to chat div
      $('#messages').append($('<ul>').text(msg.opponent + " disconnected!"));
   });

   Client.socket.on('startGame', function (data) {
      console.log("tell them to start!");
      game.loadOpponent(data);
      Client.socket.emit('markRoomFull');
   });

   Client.socket.on('confirmPlayer', function (data) {
      game.assignID(data.id);
      game.assignRoom(data.room);
      console.log("confirming!");
   });

   Client.socket.on('forfeitTurn', function (data) {
      game.forfeit = true;
      game.forfeitGame(data.id);
   });

   Client.socket.on('switchTurn', function (data, coordInfo) {
      console.log("sending message from " + data.id + " to game to switch turn");
      game.updateBoard(data.board, data.id, coordInfo);
      game.synchronizeTurn(data.id, coordInfo);
   });

   Client.socket.on('restartGame', function (data) {
      //for debugging, prints room number
      console.log("sending message to game to restart");
      game.restartMatch()
      console.log(data)
   });

   Client.socket.on('connectToRoom', function (data) {
      //for debugging, prints room number
      console.log(data)
   });

   Client.socket.on('playerLeft', function (data) {
      game.handleOpponentLeaving()
   })

   Client.socket.on('confirmChallenge', function (data) {
      data.challengedByFriend = true
      console.log(data)
      game.confirmChallenge(data)

   })
   Client.socket.on('promptFriendChallenge', function (data) {
      game.makeChallengeMenu()
   })

}
