var keyValue = sessionStorage.getItem("userkey");
var challengesRef = firebase.database().ref('/users/' + keyValue + '/challenges');
var userRef = firebase.database().ref('/users/' + keyValue);
/*
 The actual meat of the game, game state contains all the logic for the tictactoe
 game.
 */
var ticTacState = {
    
    /*
     called every frame, we don't actually need game since the screen only changes
     when a player clicks, but we can keep it for when/if we add animations
     */
    update() {
    },
    
    /*
     called when the game starts
     */
    create () {
        /****game.var adds a new "class variable" to game state, like in other languages****/
        
        game.squareSize = 115
        //the size of the board, i.e nxn board, 3x3 for tictactoe
        game.n = 3
        game.isXTurn = true
        game.isDraw = false
        game.turns = 0
        
        //the top left coordinate to place the whole board at, we will make game
        //not hardcoded in the furture to center the board, but I believe we need jQuery
        //to get window size and I didn't feel like learning that right now
        game.startingX = game.screenWidth/2 - ((game.cache.getImage('square').width* game.n) / 2)
        game.startingY = 115
        //intialize waiting status to false, update accordingly later if multiplayer
        game.waiting = false

        //record of the pieces that have been placed
        game.placedPieces = []
        
        //asign functions ot the game object, so they can be called by the client
        this.assignFunctions()
        
        //create an internal representation of the board as a 2D array
        game.board = game.makeBoardAsArray(game.n)
        //create the board on screen and makes each square clickable
        game.makeBoardOnScreen()
        //add messages that display turn status, connection statuses
        this.addTexts()
        //folloowing logic is for multiplayer games
        if(game.singleplayer)
            return
        //if this is the first play against an opponent, create a new player on the server
        if(game.firstPlay)
        {
            makeClient();
            Client.makeNewPlayer({"name":game.username, "gametype":game.gametype, "userkey":game.userkey});
            console.log("firstPlay!")
            game.firstPlay = false
            game.waiting = true
        }
        else
        {
            game.askForRematch()
        }
        
    },
    
    /*
     returns nxn 2D array
     */
    makeBoardAsArray(n) {
        board = [];
        for (var i=0; i < n; i++) {
            board[i]=new Array(n)
        }
        return board;
    },
    
    /*
     creates the board on screen with clickable squares, game.n, game.board, and
     game.startingCX and Y must be defined before calling game function
     */
    makeBoardOnScreen(){
        //  Here we'll create a new Group
        for (var i=0; i < game.n; i++) {
            
            for (var j=0; j < game.n; j ++) {
                //create square
                var square = game.addSprite(game.startingX + i*game.squareSize, game.startingY + j * game.squareSize, 'square');
                //allow square to respond to input
                square.inputEnabled = true
                //indices used for the 2D array
                square.xIndex = i
                square.yIndex = j
                //make have placePiece be called when a square is clicked
                square.events.onInputDown.add(game.placePiece, game)
                
                //initialize 2D array boad to be empty strings
                game.board[i][j] = "";
            }
        }
    },
    
    /*
        places a piece on an empty square, either x or o depending whose turn it is
     */
    placePiece(sprite, pointer)
    {
        //if we are waiting for the opponent, do nothing on click
        if(game.waiting)
            return
        
        //the indexes in the 2D array corresponding to the clicked square
        var indexX = sprite.xIndex
        var indexY = sprite.yIndex
        
        sprite.isEnabled = false
        
        //if the clicked square is not empty, i.e it has a value other than a blank
        //string, don't do anything
        if(game.board[indexY][indexX] != "")
            return
        if(game.multiplayer)
            game.waiting = true;
           
         //place either an x or o, depending whose turn it is
        if(game.isXTurn)
        {
            var piece = game.addSprite(sprite.x, sprite.y, 'star');
            game.placedPieces.push(piece);
            game.board[indexY][indexX] = "x"
        }
        else{
            var piece = game.addSprite(sprite.x, sprite.y, 'moon');
            game.placedPieces.push(piece);
            game.board[indexY][indexX] = "o";
        }
        

        game.updateTurnStatus(indexX, indexY)
        pieceChallenge(game.turns);
    },
    
    /*
        switch current turn, and display whose turn it is
     */
    switchTurn(){
        console.log("switching current turn")
        game.isXTurn = !game.isXTurn
        game.turns++

        console.log("turn count: " + game.turns)
        var turn = game.isXTurn ? "x" : "o"
        if(game.singleplayer){
            game.turnStatusText.setText("Current Turn: " + turn.toUpperCase())
        // Below is for multiplayer
        }else if(game.player === turn){
            game.turnStatusText.setText("Your Turn")
        }else{
            game.turnStatusText.setText(game.opponent + "'s turn")
        }

        

        /*console.log('array before while loop: ', notifyArray);
        while (notifyArray.length > 0) {
            console.log('array in while loop: ', notifyArray);
            console.log('array length', notifyArray.length);
            delayNotify(notifyArray, notify, notifyCounter, notifyTime);
        }
        notifyBool = false;
        */
    },
    
    /*
        Make sure only one player is waiting at a time for the opponent
     */
    synchronizeTurn(id, coordInfo)
    {
        //if the id received is this player, that means this player just moved, so they should be waiting now
        if(game.id === id)
            game.waiting = true
        else
            game.waiting = false
        if(game.isOver(coordInfo.x, coordInfo.y))
        {
            game.displayWinner()
            console.log(board)
        }
        game.switchTurn()
    },
    
    /*
     adds a sprite to the screen and returns a reference to it, scales image down
     to half its size, we can change game later
     */
    addSprite(x, y, name) {
        var sprite = game.add.sprite(x, y, name);
        sprite.scale.setTo(0.5, 0.5);
        sprite.width = game.squareSize
        sprite.height = game.squareSize
        return sprite
    },
    
    /*
     prints 2D array board to console, used for debugging
     */
    printBoard(){
        for (var i=0; i < game.n; i++) {
            console.log(game.board[i])
        }
        console.log("");
    },
    
    /*
     check if the game is over, given the index of the piece that was just placed
     */
    isOver(col, row)
    {
        //create Sets for each direction. Since a Set has unique entries, if there
        //is only one entry and it is not an empty string, that entry is the winner
        var horizontal = new Set()
        var vertical = new Set()
        
        var posDiagonal = new Set()
        var negDiagonal = new Set()
        
        for (var y=0; y < game.n; y++){
            //check the possible horizontal and vertical wins for the given placement
            horizontal.add(game.board[row][y])
            vertical.add(game.board[y][col])
            //check the possible diagonal wins by checking the main diagonals
            posDiagonal.add(game.board[y][y])
            negDiagonal.add(game.board[game.n-1-y][y])
        }
        var gameOver = false;
        //if all entries in a row or column are the same, then the game is over
        //we don't need to check that the only entry is not a blank string, since
        //these Sets will include the piece that was just placed, which cannot possibly be blank
        if(horizontal.size === 1)
        {
            gameOver = true
            game.isDraw = false
        }
        else if(vertical.size === 1)
        {
            gameOver = true
            game.isDraw = false
        }
        //if all entries in a diagonal are the same AND that entry is not blank,
        //then the game is over
        else if(posDiagonal.size === 1 && !posDiagonal.has(""))
        {
            gameOver = true
            game.isDraw = false
        }
        else if(negDiagonal.size === 1 && !negDiagonal.has(""))
        {
            gameOver = true
            game.isDraw = false
        }
        else if(game.turns >= 8)
        {
            gameOver = true;
            game.isDraw = true
        }
        
        return gameOver
        
    },
    
    /*
     switch the the winState, indicating who the winner is
     */
    displayWinner() {
        var winningPiece = game.isXTurn ? 'x' : 'o'
        if(game.singleplayer)
            game.winner = winningPiece
        else
        {
            if(game.player === winningPiece)
                game.winner = game.username
            else
                game.winner = game.opponent
        }

        
        game.saveBoard()
        
        game.state.start('win')
    },
    
    
    /*
     save the ending board for game state, so that is can be displayed in the winState
     */
    saveBoard()
    {
        game.endingBoard = []
        game.world.forEach(function(item)
        {
              game.endingBoard.push(item)
        });
    },
    
    /*
        Update the board, given a 2D array of the board. Used to update boards between two players
     */
    updateBoard(board, id, coordInfo)
    {
        if(game.state.current==="win")
            return
        /*if(game.id === id)
            return
        //updated the game board
        game.board = board
        console.log(board)
            
        var row = coordInfo.x
        var col = coordInfo.y
            
        if(game.isXTurn)
        {
            var coords = game.convertIndexesToCoords(row, col)
            game.addSprite(coords[0], coords[1], 'star');
        }
        else
        {
            var coords = game.convertIndexesToCoords(row, col)
            game.addSprite(coords[0], coords[1], 'moon');
        }
        return*/
        game.board = board
        //rub out pieces, so we don't draw multiple on top of each other
        for(var i in game.placedPieces)
        {
            game.placedPieces[i].kill();
            game.placedPieces.splice(i, 1);
        }
        //draw the pieces on the screen
        for(var i=0; i < game.n; i++) {
            for (var j=0; j < game.n; j ++) {
                
                var x = game.startingX + i*game.squareSize;
                var y = game.startingY + j * game.squareSize;
                if(game.board[j][i] === "x"){
                    game.addSprite(x, y, 'star');
                }
                if(game.board[j][i] === "o"){
                    game.addSprite(x, y, 'moon');
                }
            }
        }
    },
    
    convertIndexesToCoords(row, col)
    {
        var x = game.startingX + row *game.squareSize;
        var y = game.startingY + col * game.squareSize;
        return [x, y]
    },
    
    
    assignID(id){
        game.id = id;
        console.log("id is "+ game.id)
    },
    
    assignRoom(room){
        game.room = room
    },
    
    /*
        Start an initial match between two players
     */
    startMatch(data){
        //assign a player to be O, this will be the second player to join a match
        if(game.id === data.id)
        {
            game.waiting = true
            game.player = "o"
            game.playerPieceText.setText("You are O")
            game.opponent = data.challenger
            game.turnStatusText.setText(game.opponent + "'s turn")
            game.opponentKey = data.challengerkey
            
        }
        else
        {
            game.waiting = false
            console.log("no longer waiting!")
            game.player = "x"
            game.playerPieceText.setText("You are X")
            game.opponent = data.username
            game.opponentKey = data.userkey
            game.turnStatusText.setText("Your Turn")
        }
        //game.showOpponent();
        console.log("you are challenged by " + game.opponent)
        console.log("you are challenged by key " + game.opponentKey)
        
    },
    
    /*
        Restart a match between two players, switches the last x player to be o this time and vice versa
     */
    restartMatch(){
       console.log("REMATCH BITCH")
        if(game.player === "x")
        {
            game.waiting = true
            game.player = "o"
            game.playerPieceText.setText("You are O")
            game.turnStatusText.setText(game.opponent + "'s turn")
        }
        else if(game.player === "o")
        {
            game.waiting = false
            console.log("no longer waiting!")
            game.player = "x"
            game.playerPieceText.setText("You are X")
            game.turnStatusText.setText("Your Turn")
        }
        
    },

    /*
        Notify the server that this palyer wants to play again, and wait until the other player responds
     */
    askForRematch(){
        game.waiting = true
        console.log("ask client for rematch")
        game.playerPieceText.setText("")
        game.turnStatusText.setText("Waiting for opponent")
        Client.askForRematch(game.room)
    },
    
    /*
        Initialize the texts used to display turn status and matching status
     */
    addTexts(){
        var startingMessage = game.singleplayer ? "Current Turn: X" : "Searching for Opponent"
        
        game.turnStatusText = game.add.text(
            game.world.centerX, 50, startingMessage,
                    { font: '50px Arial', fill: '#ffffff' }
        )
        //setting anchor centers the text on its x, y coordinates
        game.turnStatusText.anchor.setTo(0.5, 0.5)
        game.turnStatusText.key = 'text'
        
        game.playerPieceText = game.add.text(
            game.world.centerX, 600-50, '',
                { font: '50px Arial', fill: '#ffffff' }
        )
        //setting anchor centers the text on its x, y coordinates
        game.playerPieceText .anchor.setTo(0.5, 0.5)
        game.playerPieceText.key = 'text'
        
        
        
    },
    
    /*
        Update the status of the current turn player
     */
    updateTurnStatus(indexX, indexY)
    {
        if(game.singleplayer)
        {
            //if single player, check if game ended right after placing a piece
            if(game.isOver(indexX, indexY))
                game.displayWinner()
            else
                game.switchTurn()
        }
        //if multiplayer, set waiting to true so that you can't place two pieces in one turn
        else
        {
            //send updated board to the server so the opponent's board is updated too
            var data = {board:game.board, x:indexX, y:indexY,id:game.id};
            Client.sendClick(data);
        }
        
        //for debugging
        game.printBoard();
    },
    
    
    
    /*
        asign functions ot the game object, so they can be called by the client
        technically this is a state object, so the functions in this file are not 
        automatically assigned to the game object.
     */
    assignFunctions()
    {
        game.makeBoardOnScreen = this.makeBoardOnScreen;
        game.switchTurn = this.switchTurn;
        game.placePiece = this.placePiece
        game.makeBoardAsArray = this.makeBoardAsArray
        game.addSprite = this.addSprite
        game.displayDraw = this.displayDraw
        game.displayWinner = this.displayWinner
        game.saveBoard = this.saveBoard
        game.isOver = this.isOver
        game.printBoard = this.printBoard
        game.updateBoard = this.updateBoard
        game.assignID = this.assignID
        game.assignRoom = this.assignRoom
        game.startMatch = this.startMatch
        game.synchronizeTurn = this.synchronizeTurn
        game.restartMatch = this.restartMatch
        game.askForRematch = this.askForRematch
        game.updateTurnStatus = this.updateTurnStatus
        game.convertIndexesToCoords = this.convertIndexesToCoords
    }


};

function pieceChallenge(turn) {
    console.log("pieceChallenge");
    var cashMoney;
    var stringCash = app.money;

    if (game.turns == 1) {
        console.log("pieceChallenge turn 1");
        challengesRef.once('value').then(function (snapshot) {
            var check;
            //check for placing first piece challenge                  
            check = snapshot.val().piece;
            if (check == '100%') {
                //do nothing if challence is complete
            } else {
                challengesRef.update({piece: '100%'});
                notification("Challenge: Baby Steps Unlocked! +50 Cash Money");
                console.log('array in piece after push: ', notifyArray);
                cashMoney = parseInt(stringCash);
                cashMoney = cashMoney + 50;
                app.money = cashMoney;//updates cash to session storage
                root.$broadcast('update', "homePageLink");
                console.log("cashMoney: ", cashMoney);
                console.log("session money: ", sessionStorage.getItem("cash"));
                userRef.update({ cash: cashMoney }); //updates cash to firebase;
            }
        });
    }
}

function notification(message) {
    var x = document.getElementById("snackbar")
    x.className = "show";
    x.innerHTML = message;
    setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
}