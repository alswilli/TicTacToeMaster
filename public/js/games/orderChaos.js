/*
 The actual meat of the game, game state contains all the logic for the tictactoe
 game.
 */
var orderChaosState = {
    /*
     called every frame, we don't actually need game since the screen only changes
     when a player clicks, but we can keep it for when/if we add animations
     */
    update() {
    },
    preload() {
        game.load.image('comet', 'imgs/comet.png');
        game.load.image('cometTail', 'imgs/cometTail.png');
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

        game.linesToAnimate = 0
        game.squareSize = 80
        //the size of the board, i.e nxn board, 3x3 for tictactoe
        game.n = 6
        game.isXTurn = true
        game.isDraw = false
        game.turns = 0
        game.XPicked = true;
        game.forfeit = false

        //for ai
        game.playerMove = true

        game.PPOffset = 60;
        game.FOffset = 20;
        console.log("we PP");
        game.startingX = game.screenWidth/2 + game.PPOffset - ((game.cache.getImage('square').width* game.n) / 2)
        game.startingY = 100

        //new size definitions for pick piece baord
        game.PPstartingX = game.screenWidth/2 - game.PPOffset - ((game.cache.getImage('square').width* game.n) / 2)
        game.PPstartingY = 200

        console.log("we F");
        game.FstartingX = game.screenWidth/2 - game.FOffset + ((game.cache.getImage('square').width* game.n) / 2)
        game.FstartingY = 200

        //intialize waiting status to false, update accordingly later if multiplayer
        game.waiting = false

        //record of the pieces that have been placed
        game.placedPieces = []

        //record of picked pieces
        game.pickedPieces = []

        //record of forfeit piece
        // game.forfeitPiece = []

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
                game.cursorSquares[i][j] = game.addSprite(game.startingX + i*game.squareSize, game.startingY + j*game.squareSize, 'redsquare')
                game.cursorSquares[i][j].alpha = 0
            }
        }

        //create an internal representation of the board as a 2D array
        game.board = game.makeBoardAsArray(game.n)
        //create the board on screen and makes each square clickable
        game.makeBoardOnScreen()
        //create board for picking which piece to place
        game.pickPieceBoard = game.makePPBoardAsArray()
        //create the pick piece board on screen and makes each square clickable
        game.makePPBoardOnScreen()

        //create board for forfeiting
        game.forfeitBoard = game.makeFBoardAsArray()
        //create the forfeit board on screen with clickability
        game.makeFBoardOnScreen()

        //add messages that display turn status, connection statuses
        this.addTexts()
        //folloowing logic is for multiplayer games
        if(game.singleplayer)
            return

        game.previousPiece = ""
        //if this is the first play against an opponent, create a new player on the server
        game.startMultiplayer()

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
    returns 2x1 2D array
    */
    makePPBoardAsArray() {
        pickPieceBoard = [];
        pickPieceBoard[0]=new Array(2)
        return pickPieceBoard;
    },

    /*
    returns 1x1 2D array
    */
    makeFBoardAsArray() {
        forfeitBoard = [];
        forfeitBoard[0]=new Array(1)
        return forfeitBoard;
    },

    /*
     creates the board on screen with clickable squares, game.n, game.board, and
     game.startingCX and Y must be defined before calling game function
     */
    makeBoardOnScreen(){
        game.spriteSquares = game.makeBoardAsArray(game.n)
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

                game.spriteSquares[i][j] = square

                //initialize 2D array board to be empty strings
                game.board[i][j] = "";
            }
        }
    },

    /*
     creates the pick piece board on screen with clickable squares, game.n, game.board, and
     game.startingCX and Y must be defined before calling game function
     */
    makePPBoardOnScreen(){
        //  Here we'll create a new Group
        for (var i=0; i < 1; i++) {
            for (var j=0; j < 2; j ++) {
                //create square
                var square = game.addSprite(game.PPstartingX + i*game.squareSize, game.PPstartingY + j * game.squareSize, 'square');
                //allow square to respond to input
                square.inputEnabled = true
                //indices used for the 2D array
                square.xIndex = i
                square.yIndex = j
                //make have placePiece be called when a square is clicked
                square.events.onInputDown.add(game.pickPiece, game)

                //initialize 2D array board to be empty strings
                if (j == 0) {
                    game.pickPieceBoard[i][j] = square;
                    var pieceImg = game.addSprite(square.x, square.y, 'X');
                }
                if (j == 1) {
                    game.pickPieceBoard[i][j] = square;
                    var pieceImg = game.addSprite(square.x, square.y, 'O');
                    square.alpha = 0.4;
                }
            }
        }
    },

    /*
     creates the forfeit board on screen with a clickable square, game.n, game.board, and
     game.startingCX and Y must be defined before calling game function
     */
    makeFBoardOnScreen(){
        //  Here we'll create a new Group
        for (var i=0; i < 1; i++) {
            for (var j=0; j < 1; j ++) {
                //create square
                var square = game.addSprite(game.FstartingX + i*game.squareSize, game.FstartingY + j * game.squareSize, 'square');
                //allow square to respond to input
                square.inputEnabled = true
                //indices used for the 2D array
                square.xIndex = i
                square.yIndex = j
                var pieceImg = game.addSprite(square.x, square.y, 'forfeit');
                //make have placePiece be called when a square is clicked
                square.events.onInputDown.add(game.forfeitPiece, game)

                //initialize 2D array board to be empty strings
                game.forfeitBoard[i][j] = "";
            }
        }
    },

    forfeitPiece(sprite, pointer){
        var indexX = sprite.xIndex
        var indexY = sprite.yIndex

        if(game.waiting)
            return

        console.log("forfeit");
        var forfeitStatus = confirm("Are you sure you want to forfeit?")
        if (forfeitStatus) {
            console.log("Forfeiting!")
            if (game.singleplayer) {
                game.forfeit = true
                game.updateTurnStatus(indexX, indexY)
            }
            else {
                var data = {id:game.id}
                Client.forfeit(data);
            }
        }
        else {
            console.log("Cancelling forfeit")
        }
    },

    pickPiece(sprite, pointer){
        var indexX = sprite.xIndex
        var indexY = sprite.yIndex

        if(indexY == 0){
            console.log("X");
            game.XPicked = true
            sprite.alpha = 1
            game.pickPieceBoard[indexX][1].alpha = 0.4
        }
        if(indexY == 1){
            console.log("O");
            game.XPicked = false
            sprite.alpha = 1
            game.pickPieceBoard[indexX][0].alpha = 0.4
        }

        var piece = game.XPicked ? "x" : "o"
        game.pieceStatusText.setText("Piece: " + piece.toUpperCase())
    },

    /*
        places a piece on an empty square, either x or o depending whose turn it is
     */
    placePiece(sprite, pointer)
    {
        playSound("placeMyPiece");
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
            game.waiting = true
         //place either an x or o, depending on which piece is picked
        if(game.XPicked && game.playerMove){
            var piece = game.addSprite(sprite.x, sprite.y, 'X');
            game.pickedPieces.push(piece);
            game.board[indexY][indexX] = "x"
        }
        else if(game.playerMove){
            var piece = game.addSprite(sprite.x, sprite.y, 'O');
            game.pickedPieces.push(piece);
            game.board[indexY][indexX] = "o";
        }

        if(!game.playerMove)
        {
           //if the ai is acting randomly, place the opposite piece of what the player just placed
            if(game.random)
            {
                var pieceType = game.XPicked ? 'o' : 'x'
                var piece = game.addSprite(sprite.x, sprite.y, pieceType.toUpperCase());
                game.board[indexY][indexX] = pieceType
                return
            }
            //game.possible lines has the form below
            //[ [priority, blockingFunction] , ... ]
            //for example,
            // [ [-2, bockHorizontal], [1, blockVertical]
            //if the maxPriority is negative, there are more Os in the line to block,
            //so the ai blocks with an x and vice versa
            console.log("placePieceAt, game.bestBlockingIndex = " + game.bestBlockingIndex)
            var maxPriority = game.possibleLines[game.bestBlockingIndex][0]
            console.log("we did it")
            if(maxPriority > 0)
            {
                var piece = game.addSprite(sprite.x, sprite.y, 'O');
                game.board[indexY][indexX] = "o"
            }
            else
            {
                var piece = game.addSprite(sprite.x, sprite.y, 'X');
                game.board[indexY][indexX] = "x"
            }
        }

        game.previousPiece = game.isXTurn ?  "order" : "chaos"
        //pointer will be undefined when placePiece is called by the ai
        if(game.vsAi)
            game.updateHilightedSquare(indexX,indexY)

        game.updateTurnStatus(indexX, indexY)
    },

    /*
        switch current turn, and display whose turn it is
     */
    switchTurn(x,y){
        console.log("switching current turn")
        game.isXTurn = !game.isXTurn
        game.turns++

        if(!game.vsAi)
            game.updateHilightedSquare(x,y)

        var turn = game.isXTurn ?  "order" : "chaos"
        if(game.singleplayer)
            game.turnStatusText.setText("Current Turn: " + turn)
        // Below is for multiplayer
        else if(game.player === turn)
            game.turnStatusText.setText("Your Turn")
        else
            game.turnStatusText.setText(game.opponent + "'s turn")
    },

    updateHilightedSquare(x,y)
    {
        for (var i = 0; i < game.n; i++)
        {
            for (var j = 0; j < game.n; j++)
            {
                //Normal functionality, just assign one open spot
                if(i == x && j == y)
                {
                    console.log("i: ", i)
                    console.log("j: ", j)
                    console.log("x: ", x)
                    console.log("y: ", y)
                    game.cursorSquares[i][j].alpha = .7
                }
                else
                {
                    game.cursorSquares[i][j].alpha = 0
                }
            }
        }
    },

    /*
        Make sure only one player is waiting at a time for the opponent
     */
    forfeitGame(id)
    {
        //if the id received is this player, that means this player just moved, so they should be waiting now
        if(game.id === id)
            game.waiting = true
        else
            game.waiting = false

        if (game.forfeit) {
            console.log("forfeit synchronize")
            game.displayWinner()
        }
    },

    /*
        Make sure only one player is waiting at a time for the opponent
     */
    synchronizeTurn(id, coordInfo)
    {
        //if the id received is this player, that means this player just moved, so they should be waiting now
        if(game.id === id) {
            game.waiting = true
        }else {
            playSound("placeOppPiece");
            game.waiting = false;
        }
        if(game.isOver(coordInfo.x, coordInfo.y))
        {
            game.waiting = true
            if(game.isDraw) { // drawing lines
                game.displayWinner()
            }
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

    updateLineCount(row, col, count)
    {
        if(!game.inBounds(col, row))
            return count

        if(game.board[row][col] === 'x')
            count++
        else if(game.board[row][col] === 'o')
            count--
        return count
    },

    /*
     check if the game is over, given the index of the piece that was just placed
     */
    isOver(col, row)
    {
        if (game.forfeit == true){
            return true
        }
        //create Sets for each direction. Since a Set has unique entries, if there
        //is only one entry and it is not an empty string, that entry is the winner
        var horizontal = new Set()
        var hor = 0
        var horizontalExt = new Set()
        var vertical = new Set()
        var vert = 0
        var verticalExt = new Set()

        var posDiagonal = new Set()
        var pos = 0
        var posDiagonalLow = new Set()
        var posLow = 0
        var posDiagonalHigh = new Set()
        var posHigh = 0
        var posDiagonalExt = new Set()
        var negDiagonal = new Set()
        var neg = 0
        var negDiagonalLow = new Set()
        var negLow = 0
        var negDiagonalHigh = new Set()
        var negHigh = 0
        var negDiagonalExt = new Set()

        for (var y=0; y < game.n-1; y++){
            //check the possible horizontal and vertical wins for the given placement
            horizontal.add(game.board[row][y])
            horizontalExt.add(game.board[row][y+1])
            vertical.add(game.board[y][col])
            verticalExt.add(game.board[y+1][col])
        }

        for (var y=0; y < game.n; y++){
            //update the priortiy of possible lines to block
            hor = game.updateLineCount(row, y, hor)
            vert = game.updateLineCount(y, col, vert)
        }


        for (var z=0; z < game.n-1; z++){
            //check the possible diagonal wins by checking the main diagonals
            posDiagonal.add(game.board[z][z])
            posDiagonalLow.add(game.board[z+1][z])
            posDiagonalHigh.add(game.board[z][z+1])
            posDiagonalExt.add(game.board[z+1][z+1])
            negDiagonal.add(game.board[game.n-1-z][z])
            negDiagonalLow.add(game.board[game.n-2-z][z])
            negDiagonalHigh.add(game.board[game.n-1-z][z+1])
            negDiagonalExt.add(game.board[game.n-2-z][z+1])
        }
        //update the priortiy of possible lines to block
        for (var z=0; z < game.n; z++)
        {
            pos = game.updateLineCount(z, z, pos)
            posLow = game.updateLineCount(z+1, z, posLow)
            posHigh = game.updateLineCount(z, z+1, posHigh)

            neg = game.updateLineCount(game.n-1-z, z, neg)
            negLow = game.updateLineCount(game.n-2-z, z, negLow)
            negHigh = game.updateLineCount(game.n-1-z, z+1, negHigh)

        }

        console.log(negDiagonal)
        var gameOver = false;
        //if all entries in a row or column are the same, then the game is over
        //we don't need to check that the only entry is not a blank string, since
        //these Sets will include the piece that was just placed, which cannot possibly be blank
        if((horizontal.size === 1 && !horizontal.has("")) || (horizontalExt.size === 1 && !horizontalExt.has(""))) // size === 2 or 3 eans that the set contains characters and spaces and other bad characters
        {
            console.log("horz")
            gameOver = true
            game.isDraw = false
            var lineAngle = -90

            var extraSpace
            if(horizontal.size === 1)
                extraSpace = 0
            else
                extraSpace = game.squareSize

            var startingX = game.startingX - 15  + extraSpace
            var startingY = game.startingX + (game.squareSize * (row)) - game.squareSize/4
            var endingX = game.screenWidth + 100
            game.drawWinningLine(startingX, startingY, endingX, startingY, lineAngle, 180)
        }
        else if((vertical.size === 1 && !vertical.has("")) || (verticalExt.size === 1 && !verticalExt.has("")))
        {
            console.log("vert")
            gameOver = true
            game.isDraw = false
            var extraSpace
            if(vertical.size === 1)
                extraSpace = 0
            else
                extraSpace = game.squareSize

            var lineAngle = 0
            var startingX = game.startingX + (game.squareSize * (col+1)) - game.squareSize/2
            var startingY = game.startingY - 15 + extraSpace

            game.drawWinningLine(startingX, startingY, startingX, 800, lineAngle, 180)

        }
        //if all entries in a diagonal are the same AND that entry is not blank,
        //then the game is over
        else if((posDiagonal.size === 1 && !posDiagonal.has("")) || (posDiagonalLow.size === 1 && !posDiagonalLow.has("")) || (posDiagonalHigh.size === 1 && !posDiagonalHigh.has("")) || (posDiagonalExt.size === 1 && !posDiagonalExt.has("")))
        {
            console.log("posD")
            gameOver = true
            game.isDraw = false
            var extraXSpace =  0
            var extraYSpace = 0
            if(posDiagonal.size === 1 && !posDiagonal.has(""))
                extraXSpace = extraYSpace = 0
            else if(posDiagonalExt.size === 1 && !posDiagonalExt.has(""))
                    extraXSpace = extraYSpace = game.squareSize
            else if(posDiagonalLow.size === 1 && !posDiagonalLow.has(""))
                extraYSpace = game.squareSize
            else if(posDiagonalHigh.size === 1 && !posDiagonalHigh.has(""))
                extraXSpace = game.squareSize

            var lineAngle = -45
            var startingX = game.startingX + extraXSpace
            var startingY = game.startingY + 15 + extraYSpace
            var endingX = game.screenWidth + 100  + extraYSpace
            var endingY = 800  + extraYSpace
            game.drawWinningLine(startingX, startingY, endingX, endingY, lineAngle, 300)

        }
        else if(negDiagonal.size === 1 && !negDiagonal.has("") || negDiagonalLow.size === 1 && !negDiagonalLow.has("") || negDiagonalHigh.size === 1 && !negDiagonalHigh.has("") || negDiagonalExt.size === 1 && !negDiagonalExt.has(""))
        {
            console.log("negD")
            gameOver = true
            game.isDraw = false


            var extraXSpace =  0
            var extraYSpace = 0
            if(negDiagonal.size === 1 && !negDiagonal.has(""))
                extraXSpace = extraYSpace = 0
            else if(negDiagonalExt.size === 1 && !negDiagonalExt.has(""))
            {
                extraYSpace = -game.squareSize
                extraXSpace = game.squareSize
            }
            else if(negDiagonalLow.size === 1 && !negDiagonalLow.has(""))
                extraYSpace = -game.squareSize
            else if(negDiagonalHigh.size === 1 && !negDiagonalHigh.has(""))
                extraXSpace = game.squareSize
            var lineAngle = -135
            var startingX = game.startingX  + extraXSpace
            var startingY = game.startingY + (game.squareSize * game.n) + extraYSpace
            var endingX = game.screenWidth + 100  + extraXSpace
            var endingY = -100  + extraYSpace
            game.drawWinningLine(startingX, startingY, endingX, endingY, lineAngle, 300)
        }
        else if(game.turns >= 35)
        {
            console.log("draw")
            gameOver = true;
            game.isDraw = true
        }


        //update priorities for blocking function for ai
        if(game.vsAi)
        {
            game.possibleLines = [[hor,blockHorizontalOrder],[vert,blockVerticalOrder], [pos, blockPositiveDiagonalOrder],  [posLow, blockPositiveLowDiagonalOrder], [posHigh, blockPositiveHighDiagonalOrder], [neg, blockNegativeDiagonalOrder],  [negLow, blockNegativeLowDiagonalOrder], [negHigh, blockNegativeHighDiagonalOrder]]
        }
        return gameOver

    },

    /*
     switch the the winState, indicating who the winner is
     */
    displayWinner() {
        var winningPiece = game.isDraw ? 'chaos' : 'order'
        if (game.forfeit) {
            if (game.isXTurn) {
                winningPiece = 'chaos'
            }
            else {
                winningPiece = 'order'
            }
        }
        if(game.singleplayer)
            game.winner = winningPiece
        else
        {
            if(game.player === winningPiece) {
                game.winner = game.username
            }
            else {
                game.winner = game.opponent
            }
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
            game.player = "chaos"
            game.playerPieceText.setText("You are Chaos")
            game.opponent = data.challenger
            game.turnStatusText.setText(game.opponent + "'s turn")
            game.opponentKey = data.challengerkey
            Client.connectedToChat({"opponent": game.opponent});
        }
        else
        {
            game.waiting = false
            console.log("no longer waiting!")
            game.player = "order"
            game.playerPieceText.setText("You are Order")
            game.opponent = data.username
            game.opponentKey = data.userkey
            game.turnStatusText.setText("Your Turn")
            Client.connectedToChat({"opponent": game.opponent});
        }
        console.log("you are challenged by " + game.opponent)
        console.log("you are challenged by key " + game.opponentKey)

    },

    /*
        Restart a match between two players, switches the last x player to be o this time and vice versa
     */
    restartMatch(){
       console.log("REMATCH BITCH")
        if(game.player === "chaos")
        {
            game.waiting = true
            game.player = "Order"
            game.playerPieceText.setText("You are Order")
            game.turnStatusText.setText(game.opponent + "'s turn")
        }
        else if(game.player === "order")
        {
            game.waiting = false
            console.log("no longer waiting!")
            game.player = "chaos"
            game.playerPieceText.setText("You are Chaos")
            game.turnStatusText.setText("Your Turn")
            game.opponentKey = data.userkey
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
        var startingMessage = game.singleplayer ? "Current Turn: Order" : "Searching for Opponent"
        var pieceMessage = game.XPicked ? "Piece: X" : "Piece: O";
        var forfeitMessage = "Forfeit?"

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

        game.pieceStatusText = game.add.text(
            game.world.centerX - 320, 170, pieceMessage,
                { font: '30px Arial', fill: '#ffffff' }
        )
        //setting anchor centers the text on its x, y coordinates
        game.pieceStatusText.anchor.setTo(0.5, 0.5)
        game.pieceStatusText.key = 'text'

        game.forfeitStatusText = game.add.text(
            game.world.centerX + 320, 170, forfeitMessage,
                { font: '30px Arial', fill: '#ffffff' }
        )
        //setting anchor centers the text on its x, y coordinates
        game.forfeitStatusText.anchor.setTo(0.5, 0.5)
        game.forfeitStatusText.key = 'text'

    },

    /*
        Update the status of the current turn player
     */
    updateTurnStatus(indexX, indexY)
    {
        if (game.vsAi) {
            console.log("updateTurnStatus: single player AI");
            if(game.isOver(indexX, indexY)) {
                if(game.isDraw) {
                    game.displayWinner()
                }
                game.waiting = true
            }
            else if(game.playerMove){
                game.switchTurn(indexX, indexY);
                game.waiting = true;
                console.log("indexX: "+indexX+" indexY: "+indexY);
                console.log(game.board);

                game.aiMakesMove(indexY, indexX);
                game.switchTurn();
                game.waiting = false;

            }
        }
        else if(game.singleplayer)
        {
            //if single player, check if game ended right after placing a piece
            if(game.isOver(indexX, indexY))
            {
                console.log("FORFEIT")
                if(game.isDraw || game.forfeit) {
                    game.displayWinner()
                }
                game.waiting = true
            }
            else
                game.switchTurn(indexX, indexY)
        }
        //if multiplayer, set waiting to true so that you can't place two pieces in one turn
        else
        {
            game.waiting = true;
            //send updated board to the server so the opponent's board is updated too
            var data = {board:game.board, x:indexX, y:indexY,id:game.id};
            Client.sendClick(data);
        }

        //for debugging
        game.printBoard();
    },

    drawWinningLine(startX, startY, endX, endY, angle, lineExtra)
    {
        game.linesToAnimate++
        var piece = game.addSpriteNoScale(startX, startY, 'comet');
        piece.key = 'comet'
        piece.angle = angle
        var tween = game.add.tween(piece).to( { x: endX, y: endY }, 1000,Phaser.Easing.Linear.None, true)
        game.tstartX = startX
        game.tstartY = startY
        tween.onComplete.add(function() { game.showLine(startX, startY, angle, lineExtra); });
    },

    showLine(startX, startY, angle, lineExtra)
    {
        var piece2 = game.addSpriteNoScale(startX , startY, 'cometTail');
        piece2.key = 'cometTail'
        piece2.height = game.squareSize*3 + lineExtra
        piece2.angle = angle
        console.log(startX + "," + startY)

        piece2.alpha = 0;
        piece2.angle = angle
        piece2.lineExtra = lineExtra
        var tween = game.add.tween(piece2).to( { alpha: 1 }, 1000, Phaser.Easing.Linear.None, true);
        tween.onComplete.add(game.completeDraw)
    },


    completeDraw()
    {
        game.linesToAnimate--
        console.log("lines left: " + game.linesToAnimate)
        if(game.linesToAnimate === 0)
            game.displayWinner()
        },

    addSpriteNoScale(x, y, name) {
        var sprite = game.add.sprite(x, y, name);

        return sprite
    },

    showSprites()
    {
        game.endingBoard.forEach(function(element)
         {

         console.log(element)
         if(element.key != 'text' && element.key != 'cometTail'  && element.key != 'redsquare' && element.key != 'background')
         game.addSprite(element.x, element.y, element.key);
         else if(element.key === 'cometTail')
         {
             var cometTail = game.addSpriteNoScale(element.x, element.y, element.key)
             cometTail.height = game.squareSize*3 + element.lineExtra
             cometTail.angle = element.angle

         }
         });
    },

    /*  This is called when for the ai to make a move. Depending on difficulty setting, has a probablity
     of either blocking the player's longest potential line of 4 x's or places a piece on an open
     square adjacent to where the pley just placed a piece
     */
    aiMakesMove(col, row) {
        game.playerMove = false
        var makeRandomMove = false
        if (game.difficulty == 'easy') {
            makeRandomMove = (Math.random() < 0.5) ? false : true
        }
        else if (game.difficulty == 'medium') {
            makeRandomMove  = (Math.random() < 0.7) ? false : true
        }
        else if (game.difficulty == 'hard') {
            makeRandomMove  =  false
        }
        game.waiting = false
        game.random = makeRandomMove
        if(makeRandomMove)
            game.makeRandomMove(col , row)
        else
            game.blockPieceAt(col , row)
        game.playerMove = true
        return

        },

    /*
     Block the player from winning given the indexes of where they just placed a piece
     */
    blockPieceAt(col , row) {
        //sort the blocking functions by priority
        game.sortBlockingFunctions(game.possibleLines)
        //get the blocking function with highest priority
        game.bestBlockingIndex = 0
        game.aiBlockingFunction = game.possibleLines[game.bestBlockingIndex][1]
        //if there is nowhere to block, move to next blocking function until there is a place to block
        while(!game.aiBlockingFunction(col, row) && game.bestBlockingIndex < game.possibleLines.length-1)
        {
            game.bestBlockingIndex++
            //if there are no more blocking functions, place piece at any open place
            if(game.bestBlockingIndex >= game.possibleLines.length)
            {
                findOpenSquareOrder(col, row)
                break
            }
            game.aiBlockingFunction = game.possibleLines[game.bestBlockingIndex][1]
        }
    },

    /*
     Sorts the blocking functions for ai in order of priority. Priority is determined by
     how many x's are placed in a certain line, i.e three x's on a horizontal have
     higher priority than 1 x on a vertical. game.possibleLines has the form
     [ [numOfXs, blockingFunction], ... ]
     [ [verticals, blockVerticalFunction], [horizontals, blockHorizontalFunction], ... ]
     */
    sortBlockingFunctions(lines)
    {
        var max = 0
        var maxIndex = 0
        for(var i = 0; i < lines.length; i++)
        {
            //consider absolute values, since there can be negative numbers if there are more os than xs
            //in a given line
            if(Math.abs(lines[i][0]) > max)
            {
                max = Math.abs(lines[i][0])
                maxIndex = i
            }
        }
        //sort the possible lines by priority, i.e the first value in each pair
        //consider absolute values, since there can be negative numbers if there are mor os than xs
        game.possibleLines.sort(function(a, b){return Math.abs(b[0]) - Math.abs(a[0])})
    },

    /*
        searches for an open sqaure on the board
     */
    makeRandomMove(col, row)
    {
        findOpenSquareOrder(col, row)
    },

    /*
     Returns true if indexes are in bounds, false otherwise
     */
    inBounds(col, row)
    {
        return (col >= 0 && col < game.n) && (row >= 0 && row < game.n)
    },
    /*
        asign functions ot the game object, so they can be called by the client
        technically this is a state object, so the functions in this file are not
        automatically assigned to the game object.
     */
    assignFunctions()
    {
        game.inBounds = this.inBounds
        game.aiMakesMove = this.aiMakesMove
        game.blockPieceAt = this.blockPieceAt
        game.sortBlockingFunctions = this.sortBlockingFunctions
        game.makeRandomMove = this.makeRandomMove
        game.updateLineCount = this.updateLineCount

        game.showSprites = this.showSprites
        game.addSpriteNoScale = this.addSpriteNoScale
        game.drawWinningLine = this.drawWinningLine
        game.completeDraw = this.completeDraw
        game.showSprites = this.showSprites
        game.showLine = this.showLine
        game.makeBoardOnScreen = this.makeBoardOnScreen;
        game.makePPBoardOnScreen = this.makePPBoardOnScreen;
        game.makeFBoardOnScreen = this.makeFBoardOnScreen;
        game.switchTurn = this.switchTurn;
        game.placePiece = this.placePiece
        game.pickPiece = this.pickPiece
        game.forfeitPiece = this.forfeitPiece
        game.makeBoardAsArray = this.makeBoardAsArray
        game.makePPBoardAsArray = this.makePPBoardAsArray
        game.makeFBoardAsArray = this.makeFBoardAsArray
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
        game.forfeitGame = this.forfeitGame
        game.updateHilightedSquare = this.updateHilightedSquare
    }
};
