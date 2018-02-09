/*
 The actual meat of the game, game state contains all the logic for the tictactoe
 game.
 */


var threeDticTacState = {
    /*
     called every frame, we don't actually need game since the screen only changes
     when a player clicks, but we can keep it for when/if we add animations
     */
    update() {
    },
    
    preload() {
        game.load.image('X', 'imgs/3D/X.png');
        game.load.image('O', 'imgs/3D/O.png');
    },
    
    /*
     called when the game starts
     */
    create () {
        /****game.var adds a new "class variable" to game state, like in other languages****/
        
        game.boardHeight = 102
        game.boardOffset = 15
        game.pieceWidth = 38
        game.pieceHeight = 25
        //the size of the board, i.e nxn board, 3x3 for tictactoe
        game.n = 4
        game.isXTurn = true
        game.isDraw = false
        game.turns = 0
        
        //the top left coordinate to place the whole board at, we will make game
        //not hardcoded in the furture to center the board, but I believe we need jQuery
        //to get window size and I didn't feel like learning that right now
        game.startingX = 400 - game.cache.getImage('board').width / 2
        game.startingY = 80
        //intialize waiting status to false, update accordingly later if multiplayer
        game.waiting = false
        
        //record of the pieces that have been placed
        game.placedPieces = []
        
        //asign functions ot the game object, so they can be called by the client
        this.assignFunctions()
        
        //create an internal representation of the board as a 2D array
        game.board = game.makeBoardAsArray(game.n)
        
        console.log(game.board)
        //create the board on screen and makes each square clickable
        game.makeBoardOnScreen()
        //add messages that display turn status, connection statuses
        this.addTexts()
        
        
        //folloowing logic is for multiplayer games
        if(game.singleplayer)
            return
            //if this is the first play against an opponent, create a new player on the server
            if(typeof game.firstPlay === 'undefined')
            {
                Client.makeNewPlayer();
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
        for (var i=0; i < n; i++)
        {
            board[i] = new Array(n)
            for (var j=0; j < n; j++)
            {
                board[i][j]=new Array(n)
            }
            
        }
        
        for (var i=0; i < n; i++)
        {
            for (var j=0; j < n; j++)
            {
                for (var k=0; k < n; k++)
                    board[i][j][k]= ""
            }
        }
        
        return board;
    },
    
    /*
     creates the board on screen with clickable squares, game.n, game.board, and
     game.startingCX and Y must be defined before calling game function
     */
    makeBoardOnScreen(){
        //  Here we'll create a new Group
        var width = game.cache.getImage('board').width
        var height = game.cache.getImage('board').height
        for (var i=0; i < game.n; i++)
        {
            var y = game.startingY + i * (game.boardHeight + game.boardOffset)
            //create square
            var board = game.addSprite(game.startingX, y, 'board');
            //allow square to respond to input
            board.inputEnabled = true
            //indices used for the 2D array
            board.boardNum = i
            //make have placePiece be called when a square is clicked
            board.events.onInputDown.add(game.placePiece, game)
            
            //initialize 2D array boad to be empty strings
            //game.board[i] = "";
            
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
        //the board that was clicked on, 0 is on top, 3 is on bottom
        var boardNum = sprite.boardNum

        //used to adjust y value for space between boards
        var adjustmentY = game.startingY + (boardNum * (game.boardHeight + game.boardOffset))
        //used to adjust x value for centering the boards
        var adjustmentX = 400 - game.cache.getImage('board').width / 2
        var y = pointer.worldY - adjustmentY
        var x = pointer.worldX - adjustmentX
        var point = [x, y]
        //get the indexes that were clicked on
        var placement = game.convertToIndexes(point)
            
        var indexX =placement[1]
        var indexY =placement[0]
        //check to make sure index is in bounds, since board is sheared, its possible to click out of bounds
        if(indexX < 0 || indexX >= game.n )
            return
        //check if there is already something placed at this position
        if(game.board[boardNum][indexY][indexX] != "")
            return
        
        //convert the indexes to actual coordinates on the screen
        var sheared = game.convertToShearCoords(indexX * game.pieceWidth, indexY * game.pieceHeight)
        //get width of images to adjust placements
        var width = game.cache.getImage('X').width
        //adjust the x and y values to where they should appear on the screen
        var worldX = game.startingX + sheared[1] - width/2
        var worldY = sheared[0] + adjustmentY
        //place appropriate piece, depending whose turn it is
        if(game.isXTurn)
        {
            var piece = game.addSprite(worldX, worldY, 'X');
            game.board[boardNum][indexY][indexX] = "x"
        }
        else
        {
            var piece = game.addSprite(worldX, worldY, 'O');
            game.board[boardNum][indexY][indexX] = "o"
        }
        game.updateTurnStatus(boardNum, indexX, indexY)
    },
    
    
    /*
     switch current turn, and display whose turn it is
     */
    switchTurn(){
        console.log("switching current turn")
        game.isXTurn = !game.isXTurn
        game.turns++
        var turn = game.isXTurn ? "x" : "o"
        if(game.singleplayer)
            game.turnStatusText.setText("Current Turn: " + turn.toUpperCase())
        else if(game.player === turn)
            game.turnStatusText.setText("Your Turn")
        else
            game.turnStatusText.setText("Opponent's turn")
    },
    
    /*
     Make sure only one player is waiting at a time for the opponent
     */
    synchronizeTurn(id, x, y)
    {
        //if the id received is this player, that means this player just moved, so they should be waiting now
        if(game.id === id)
            game.waiting = true
        else
            game.waiting = false
        if(game.isOver(x, y))
            game.displayWinner()
        game.switchTurn()
    },
    
    /*
     adds a sprite to the screen and returns a reference to it, scales image down
     to half its size, we can change game later
     */
    addSprite(x, y, name) {
        var sprite = game.add.sprite(x, y, name);
        //sprite.scale.setTo(0.5, 0.5);
        var width = game.cache.getImage(name).width
        var height = game.cache.getImage(name).height
        sprite.width = width
        sprite.height = height
        return sprite
    },
    
    /*
     adds a sprite to the screen and returns a reference to it, scales image down
     to half its size, we can change game later
     */
    addSpriteWithWidth(x, y, name, width, height) {
        var sprite = game.add.sprite(x, y, name);
        //sprite.scale.setTo(0.5, 0.5);
        sprite.width = width
        sprite.height = height
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
    isOver(num, col, row)
    {
        //first, check if the game is completed on a single board
        
        //create Sets for each direction. Since a Set has unique entries, if there
        //is only one entry and it is not an empty string, that entry is the winner
        var horizontal = new Set()
        var vertical = new Set()
        
        var posDiagonal = new Set()
        var negDiagonal = new Set()
        
        for (var y=0; y < game.n; y++){
            //check the possible horizontal and vertical wins for the given placement
            horizontal.add(game.board[num][row][y])
            vertical.add(game.board[num][y][col])
            //check the possible diagonal wins by checking the main diagonals
            posDiagonal.add(game.board[num][y][y])
            negDiagonal.add(game.board[num][game.n-1-y][y])
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
        //check 3D game ending conditions
        else if(game.checkIfOver3D(num, col, row))
        {
            gameOver = true
            game.isDraw = false
        }
        //Not sure if it is possible to draw in 3D, we can check after 63 just in case
        /*else if(game.turns >= 8)
        {
            gameOver = true;
            game.isDraw = true
        }*/
        
        return gameOver
        
    },
    
    /*
        Check if there is a 3D vertical win, a local diagonal, or a main diagonal 
        victory
     */
    checkIfOver3D(board, col, row)
    {
        if(game.checkIfVertical3D(col, row))
            return true
        if(game.checkLocalDiagonals3D(board, col, row))
            return true
        if(game.checkMainDiagonals3D(board, col, row))
            return true
        return false
    },
    
    /*
        Check all the pieces along the vertical of where the piece was placed
     */
    checkIfVertical3D(col, row)
    {
        var vertical = new Set()
        for(var i = 0; i < game.board.length; i++)
        {
            vertical.add(game.board[i][row][col])
        }
        
        gameOver = false
        if(vertical.size === 1)
            gameOver = true
        return gameOver
    },
    
    /*
        Check diagonals local to the placed piece
     */
    checkLocalDiagonals3D(board, fixedCol, fixedRow)
    {
        var positiveHorizontal = new Set()
        var negativeHorizontal = new Set()
        var positiveVertical= new Set()
        var negativeVertical= new Set()
        
        for(var col = 0, row=0, k=0; k < game.board.length; col++, row++, k++)
        {
            //if the coords are out of bounds or contain an empty square, mark it as invalid
            if(!game.inBounds(col, row) || game.board[k][fixedRow][col] === "")
            {
                game.markSetInvalid(negativeHorizontal)
            }
            else
            {

                negativeHorizontal.add(game.board[k][fixedRow][col])
            }
            
        }
        for(var col = 0, row=0, k=game.n-1; k >= 0; col++, row++, k--)
        {
            //if the coords are out of bounds or contain an empty square, mark it as invalid
            if(!game.inBounds(col, row) || game.board[k][fixedRow][col] === "")
            {
                game.markSetInvalid(positiveHorizontal)
            }
            else
            {
                
                positiveHorizontal.add(game.board[k][fixedRow][col])
            }
        }
        for(var col = 0, row=0, k=0; k < game.board.length; col++, row++, k++)
        {
            //if the coords are out of bounds or contain an empty square, mark it as invalid
            if(!game.inBounds(col, row) || game.board[k][row][fixedCol] === "")
            {
                game.markSetInvalid(positiveVertical)
            }
            else
            {
                
                positiveVertical.add(game.board[k][row][fixedCol] )
            }
        }
        for(var col = 0, row=0, k=game.n-1; k >= 0; col++, row++, k--)
        {
            //if the coords are out of bounds or contain an empty square, mark it as invalid
            if(!game.inBounds(col, row) || game.board[k][row][fixedCol]=== "")
            {
                game.markSetInvalid(negativeVertical)
            }
            else
            {
                
                negativeVertical.add(game.board[k][row][fixedCol])
            }
        }
    
        gameOver = false
        if(negativeHorizontal.size === 1)
        {
            gameOver = true
            console.log("neg horizontal, game ovah!")
        }
        else if(positiveHorizontal.size === 1)
        {
            gameOver = true
            console.log("pos horizontal, game ovah!")
        }
        else if(positiveVertical.size === 1)
        {
            gameOver = true
            console.log("pos vertical, game ovah!")
        }
        else if(negativeVertical.size === 1)
        {
            gameOver = true
            console.log("neg vertical, game ovah!")
        }
        
        return gameOver
    },
    
    /*
        Check the main diagonals
     */
    checkMainDiagonals3D()
    {
        var mainTopLeft= new Set()
        var mainTopRight= new Set()
        var mainBottomLeft= new Set()
        var mainBottomRight= new Set()
        for(var col = 0, row=0, k=0; k < game.board.length; col++, row++, k++)
        {
            //if the coords are out of bounds or contain an empty square, mark it as invalid
            if(game.board[k][row][col]=== "")
            {
                game.markSetInvalid(mainTopLeft)
            }
            else
            {
                mainTopLeft.add(game.board[k][row][col])
            }
        }
        for(var col = game.n-1, row=0, k=0; k < game.board.length; col--, row++, k++)
        {
            //if the coords are out of bounds or contain an empty square, mark it as invalid
            if(game.board[k][row][col]=== "")
            {
                game.markSetInvalid(mainTopRight)
            }
            else
            {
                
                mainTopRight.add(game.board[k][row][col])
            }
        }
        //
        for(var col = 0, row=game.n-1, k=0; k < game.board.length; col++, row--, k++)
        {
            //if the coords are out of bounds or contain an empty square, mark it as invalid
            if(game.board[k][row][col]=== "")
            {
                game.markSetInvalid(mainBottomLeft)
            }
            else
            {
                mainBottomLeft.add(game.board[k][row][col])
            }
        }
        for(var col = game.n-1, row=game.n-1, k=0; k < game.board.length; col--, row--, k++)
        {
            //if the coords are out of bounds or contain an empty square, mark it as invalid
            if(game.board[k][row][col]=== "")
            {
                game.markSetInvalid(mainBottomRight)
            }
            else
            {
                mainBottomRight.add(game.board[k][row][col])
            }
        }
        var gameOver = false
        if(mainTopLeft.size === 1)
        {
            gameOver = true
            console.log("mainTopLeft, game ovah!")
        }
        else if(mainTopRight.size === 1)
        {
            gameOver = true
            console.log("mainTopRight, game ovah!")
        }
        else if(mainBottomLeft.size === 1)
        {
            gameOver = true
            console.log("mainBottomLeft, game ovah!")
        }
        else if(mainBottomRight.size === 1)
        {
            gameOver = true
            console.log("mainBottomRight, game ovah!")
        }
        
        
        return gameOver


    },
    
    /*
        Returns true if indexes are in bounds, false otherwise
     */
    inBounds(col, row)
    {
        return (col >= 0 && col < game.n) && (row >= 0 && row < game.n)
    },
    
    /*
        Adds two entries to the given set, so when we check if the set has only one 
        element, the result will be false
     */
    markSetInvalid(set)
    {
        set.add("not")
        set.add("valid")
    },
    
    /*
     switch the the winState, indicating who the winner is
     */
    displayWinner() {
        game.winner = game.isXTurn ? 'x' : 'o'
        
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
                           console.log(item.key)
                           });
    },
    
    /*
     Update the board, given a 2D array of the board. Used to update boards between two players
     */
    updateBoard(id, board)
    {
        if(game.state.current==="win")
            return
            //updated the game board
            game.board = board
            console.log(board)
            
            //rub out pieces, so we don't draw multiple on top of each other
            for(var i in game.placedPieces) {
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
    startMatch(id){
        //assign a player to be O, this will be the second player to join a match
        if(game.id === id)
        {
            game.waiting = true
            game.player = "o"
            game.playerPieceText.setText("You are O")
            game.turnStatusText.setText("Opponent's turn")
        }
        else
        {
            game.waiting = false
            console.log("no longer waiting!")
            game.player = "x"
            game.playerPieceText.setText("You are X")
            game.turnStatusText.setText("Your Turn")
        }
        
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
            game.turnStatusText.setText("Opponent's turn")
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
    updateTurnStatus(boardNum, indexX, indexY)
    {
        if(game.singleplayer)
        {
            //if single player, check if game ended right after placing a piece
            if(game.isOver(boardNum, indexX, indexY))
                game.displayWinner()
            else
                game.switchTurn()
        }
        //if multiplayer, set waiting to true so that you can't place two pieces in one turn
        else
        {
            game.waiting = true;
            //send updated board to the server so the opponent's board is updated too
            Client.sendClick(game.board, indexX, indexY);
        }
        
        //for debugging
        game.printBoard();
    },
    
    
    handleOpponentLeaving()
    {
        game.state.start("waitingRoom");
    },
    
    convertToIndexes(point)
    {
        var height = game.cache.getImage('board').height
        var zpoint = [[point[0], height -  point[1]]]
        var shear = [[1, 0],
                     [-1.15, 1]
                     ]
        
        var result = game.multiplyMatrices(zpoint, shear)
        console.log("-----result of matrix mu,tiplication-----")
        console.log(result[0])
        var row = Math.floor(point[1] / game.pieceHeight)
        var col = Math.floor(result[0][0] / game.pieceWidth)
        
        return [row, col]
    },
    
    /*
        Applies the shear matrix to the given coordinates and returns the result in 
        an array
     */
    convertToShearCoords(x, y)
    {
        console.log("SHEAR CALCULATION given " + x + ", " + y)
        
        var height = game.cache.getImage('board').height
        var zpoint = [[x, height -  y]]
        var shear = [[1, 0],
                     [1.15, 1]
                     ]
        console.log("Convert to grid coords: " + zpoint[0][0] + ", " + zpoint[0][1])
        var result = game.multiplyMatrices(zpoint, shear)
        console.log("-----result of matrix mu,tiplication-----")
        console.log(result[0])
        var row = Math.floor(y)
        var col = Math.floor(result[0][0])
        
        return [row, col]

    },
    
    /*
        returns the matrix result of multiplying two matrices
     */
    multiplyMatrices(m1, m2) {
        var result = [];
        for (var i = 0; i < m1.length; i++)
        {
            result[i] = [];
            for (var j = 0; j < m2[0].length; j++) {
                var sum = 0;
                for (var k = 0; k < m1[0].length; k++) {
                    sum += m1[i][k] * m2[k][j];
                }
            result[i][j] = sum;
          }
      }
      return result;
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
        game.handleOpponentLeaving = this.handleOpponentLeaving
        game.convertToIndexes = this.convertToIndexes
        game.insidePolygon = this.insidePolygon
        game.multiplyMatrices = this.multiplyMatrices
        game.convertToShearCoords = this.convertToShearCoords
        game.checkIfVertical3D = this.checkIfVertical3D
        game.checkLocalDiagonals3D = this.checkLocalDiagonals3D
        game.inBounds = this.inBounds
        game.markSetInvalid = this.markSetInvalid
        game.checkIfOver3D = this.checkIfOver3D
        game.checkMainDiagonals3D = this.checkMainDiagonals3D
    }
};
