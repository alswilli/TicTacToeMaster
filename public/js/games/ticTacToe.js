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
        
				var background = game.add.sprite(game.world.centerX, game.world.centerY, 'background');
    		background.anchor.set(0.5);
				background.width = game.screenWidth;
        background.height = 700;
			
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

        game.cursorSquares = []
        for (var i=0; i < game.n; i++) {
            game.cursorSquares[i]=new Array(game.n)
        }  

        for (var i=0; i < game.n; i++)
        {
            for (var j=0; j < game.n; j++)
            {
                console.log("HERE")
                game.cursorSquares[i][j] = game.addSprite(game.startingX + i*game.squareSize, game.startingY + j*game.squareSize, 'redsquare')
                game.cursorSquares[i][j].alpha = 0
            }
        }

        //create an internal representation of the board as a 2D array
        game.board = game.makeBoardAsArray(game.n)
        //create the board on screen and makes each square clickable
        game.makeBoardOnScreen()
        //add messages that display turn status, connection statuses
        this.addTexts()
        
        game.previousPiece = ""
        //folloowing logic is for multiplayer games
        if(game.singleplayer || game.vsAi)
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
        console.log(board);
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
        console.log(sprite); 
        console.log("x: ", sprite.x);
        console.log("y: ", sprite.y);
       //console.log(pointer);
        //if we are waiting for the opponent, do nothing on click
        if(game.waiting)
            return
        if(game.multiplayer && game.checkForDoubleClick())
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
            var piece = game.addSprite(sprite.x, sprite.y, 'X');
            game.placedPieces.push(piece);
            game.board[indexY][indexX] = "x"
            game.previousPiece = "x"
        }
        else{
            var piece = game.addSprite(sprite.x, sprite.y, 'O');
            game.placedPieces.push(piece);
            game.board[indexY][indexX] = "o";
            game.previousPiece = "o"
        }
        
        // game.cursorSquares[i][j] = game.addSprite(game.startingX + i*game.squareSize, game.startingY + j*game.squareSize, 'redsquare')
        // game.cursorSquares[i][j].alpha = 0.5

        game.updateTurnStatus(indexX, indexY)
    },
    
    /*
        switch current turn, and display whose turn it is
     */
    switchTurn(x,y){
        console.log("switching current turn")
        console.log("x: ", x)
        console.log("y: ", y)
        
        game.isXTurn = !game.isXTurn
        game.turns++

        for (var i = 0; i < 3; i++)
        {
            for (var j = 0; j < 3; j++)
            {
                //Normal functionality, just assign one open spot
                if(i == x && j == y)
                {
                    console.log("i: ", i)
                    console.log("j: ", j)
                    console.log("x: ", x)
                    console.log("y: ", y)
                    game.cursorSquares[i][j].alpha = .7
                    // game.cursorSquares[i][j].tint = 0xffffff
                }
                else
                {
                    game.cursorSquares[i][j].alpha = 0
                }
            }
        }

        pieceChallenge(game.turns);
        console.log("turn count: " + game.turns)
        var turn = game.isXTurn ? "x" : "o"
        if(game.singleplayer || game.vsAi)
            game.turnStatusText.setText("Current Turn: " + turn.toUpperCase())
        // Below is for multiplayer
        else if(game.player === turn)
            game.turnStatusText.setText("Your Turn")
        else
            game.turnStatusText.setText(game.opponent + "'s turn")
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
        game.switchTurn(coordInfo.x, coordInfo.y)
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
        if(game.singleplayer || game.vsAi)
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
            game.addSprite(coords[0], coords[1], 'X');
        }
        else
        {
            var coords = game.convertIndexesToCoords(row, col)
            game.addSprite(coords[0], coords[1], 'O');
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
                    game.addSprite(x, y, 'X');
                }
                if(game.board[j][i] === "o"){
                    game.addSprite(x, y, 'O');
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
        var startingMessage = (game.singleplayer || game.vsAi) ? "Current Turn: X" : "Searching for Opponent"
        
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
        if (game.vsAi) {
           console.log("updateTurnStatus: single player AI");
           if(game.isOver(indexX, indexY)) {
              game.displayWinner()         
           }
           else {
              game.switchTurn(indexX, indexY); 
              game.waiting = true;
              console.log("indexX: "+indexX+" indexY: "+indexY);
              console.log(board);
              console.log(boardToArray());
              
              aiMakesMove();
              game.switchTurn(indexX, indexY);
              console.log(boardToArray());
              game.waiting = false;
              
           }
        }
        else if(game.singleplayer)
        {
            console.log("updateTurnStatus: single player");
            //if single player, check if game ended right after placing a piece
            if(game.isOver(indexX, indexY))
                game.displayWinner()
            else
                game.switchTurn(indexX, indexY)
        }
        //if multiplayer, set waiting to true so that you can't place two pieces in one turn
        else
        {
            //send updated board to the server so the opponent's board is updated too
            var data = {board:game.board, x:indexX, y:indexY,id:game.id};
            console.log(data)
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
    var stringCash = sessionStorage.getItem("cash");

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
                console.log('Challenge Complete!!!!!');
                //need notification
                cashMoney = parseInt(stringCash);
                cashMoney = cashMoney + 50;
                sessionStorage.setItem("cash", cashMoney);//updates cash to session storage
                console.log("cashMoney: ", cashMoney);
                console.log("session money: ", sessionStorage.getItem("cash"));
                userRef.update({ cash: cashMoney }); //updates cash to firebase;
            }
        });
    }
}

/****************************************** Tic Tac Toe AI ************************/
var human = "x";
var ai    = "o";

       
/* This is called when for the ai to make a move.
 * Converts the board to a single array for minimax to calculate where to play a move.
 * Then we place the move there for the AI.
 * We convert the board back to a single array and check for the winning condition.
 */
function aiMakesMove() {
   var boardArr = boardToArray();
   var move = minimax(boardArr, ai);

   var newBoardArr = spliceBoard(boardArr);

   // Set game difficutly probability
   if (game.difficulty == 'easy') {
    var actualMove = (Math.random() < 0.3) ? move : newBoardArr[Math.floor(Math.random()*newBoardArr.length)]
    console.log("EASY MODE")
   }
   else if (game.difficulty == 'medium') {
    var actualMove = (Math.random() < 0.6) ? move : newBoardArr[Math.floor(Math.random()*newBoardArr.length)]
    console.log("MEDIUM MODE")
   }
   else if (game.difficulty == 'hard') {
    var actualMove = (Math.random() < 0.9) ? move : newBoardArr[Math.floor(Math.random()*newBoardArr.length)]
    console.log("HARD MODE")   
   }
   console.log("MOVE: ", move)
   console.log("ACTUAL MOVE: ", actualMove)
   
   //    var convertedMove = convertMove(move);
   if (actualMove == move)
   {
    console.log("a")
    var convertedMove = convertMove(actualMove);
   } 
   else
   {
    console.log("b")
    var convertedMove = convertRandMove(actualMove);   
   } 
//    console.log("AI's move: ", move);
   console.log("AI's move: ", move);
   console.log("convertedMove: ", convertedMove);
   
   placePieceAt(convertedMove.row, convertedMove.column);
   
   boardArr = boardToArray();

   if ( gameIsWon(boardArr, human) || gameIsWon(boardArr, ai) ) {
      game.displayWinner();
   }
}

function spliceBoard(boardArr) {
    var array = [];

   for (var i=0; i < boardArr.length; i++) {
         if (boardArr[i] != "x" && boardArr[i] != "o") {
            array.push(boardArr[i]);
         }
   }

   return array;
}

 
/* Draws a piece at the given index 
 */
function placePieceAt(row , col) {
   console.log(game.screenWidth);
//    var x = 485 + (col * 115);
//    var y = 115   * (row + 1);
   var piece = game.addSprite(game.startingX + col*game.squareSize, game.startingY + row * game.squareSize, 'O');
//    var piece = game.addSprite(x, y, 'moon');
   game.placedPieces.push(piece);
   game.board[row][col] = "o";
}

       
/* Converts the board to a single array 
 */
function boardToArray() {
   
   var array = [];
   
   for (var i=0; i<board.length; i++) {
      for (var j=0; j<board[i].length; j++) {
         if (board[i][j] != "") {
            array.push(board[i][j]);
         }else {
            array.push(i*3 + j);
         }
      }
   }
   return array;
}


/* Converts a move{index, score} to location{row, column}
 */
function convertMove(move) {
   var loc = {};
   
   loc.row    = Math.floor(move.index / 3);
   loc.column = move.index % 3;
   return loc;
}

/* Converts a "arrIndex" to location{row, column}
 */
function convertRandMove(move) {
    var loc = {};
    
    loc.row    = Math.floor(move / 3);
    loc.column = move % 3;
    return loc;
 }

       
/* Returns the list of indexes of empty spaces on the board
 */
function emptyIndexies(board){
  return  board.filter(tile => tile != "o" && tile != "x");
}


/* Tests if the given player has won the board by checking all combinations
 * 0 1 2
 * 3 4 5
 * 6 7 8 
 */
function gameIsWon(board, player) {
   if ( (board[0] == player && board[1] == player && board[2] == player) ||
        (board[3] == player && board[4] == player && board[5] == player) ||
        (board[6] == player && board[7] == player && board[8] == player) ||
        
        (board[0] == player && board[3] == player && board[6] == player) ||
        (board[1] == player && board[4] == player && board[7] == player) ||
        (board[2] == player && board[5] == player && board[8] == player) ||
       
        (board[0] == player && board[4] == player && board[8] == player) ||
        (board[2] == player && board[4] == player && board[6] == player) ) 
   {
      return true;
   }
   return false;
}


/* This is the minimax algorithm that recursively chooses the best move to play for the 
 * ai by playing ahead. 
 * https://medium.freecodecamp.org/how-to-make-your-tic-tac-toe-game-unbeatable-by-using-the-minimax-algorithm-9d690bad4b37
 */
function minimax(newBoard, player) {
   
   var availSpots = emptyIndexies(newBoard);
   
   if (gameIsWon(newBoard, human)) {
      return {score: -10};
   }
   else if (gameIsWon(newBoard, ai)) {
      return {score:  10};
   }
   else if (availSpots.length == 0) {
      return {score:   0};
   }
   
   var moves = []; //Collects all the objects
   
   for (var i=0; i<availSpots.length; i++) {
      
      //Create an object for each and store the index of that spot 
      var move = {};
      move.index = newBoard[availSpots[i]];
      
      newBoard[availSpots[i]] = player; //Set the empty spot to the current player
      
      if (player == ai) {
         var result = minimax(newBoard, human);
         move.score = result.score;
      }
      else {
         var result = minimax(newBoard, ai);
         move.score = result.score;
      }
      
      newBoard[availSpots[i]] = move.index; //Reset the spot to empty
      
      moves.push(move); //Push the spot to empty
   }
      
   //If it's the ai's turn, loop over the moves and choose the one with the highest score
   var bestMove;
   
   if (player == ai) {
      var bestScore = -10000;
      
      for (var i=0; i<moves.length; i++) {
         if (moves[i].score > bestScore) {
            bestScore = moves[i].score;
            bestMove  = i;
         }
      }
   }
   //Else it's the player's turn, so we loop over the moves and chosoe the one with the lowest score
   else { 
      var bestScore = 10000;
      
      for (var i=0; i<moves.length; i++) {
         if (moves[i].score < bestScore) {
            bestScore = moves[i].score;
            bestMove  = i;
         }
      }
   }
   
   //Return the chosen move(object) from the moves array
   return moves[bestMove];
}