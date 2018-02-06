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
        
        this.makeBoardCoords()
        
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
        //the indexes in the 2D array corresponding to the clicked square
        var boardNum = sprite.boardNum

        //console.log("board " + boardNum + ", x: " + pointer.worldX + " y: " + pointer.worldY)
        var adjustment = game.startingY + (boardNum * (game.boardHeight + game.boardOffset))
        var y = pointer.worldY - adjustment
        var x = pointer.worldX -(400 - game.cache.getImage('board').width / 2)
        var point = [x, y]
        
        var placement = game.checkClick(point)
            
        var indexX =placement[1]
        var indexY =placement[0]
        if(placement[1] < 0 || placement[1] >= game.n )
            return
        console.log("board" + boardNum +", row " + placement[0] +", column "+ placement[1])
        
        
        var sheared = game.convertToShearCoords(placement[1] * game.pieceWidth, placement[0] * game.pieceHeight)
        var width = game.cache.getImage('X').width
        var spotx = game.startingX + sheared[1] - width/2//* game.pieceWidth
        var spoty = sheared[0] /* game.pieceHeight */+ adjustment
        console.log("put sprite at " + sheared[0] + " " + sheared[1])
        if(game.isXTurn)
        {
            var piece = game.addSprite(spotx, spoty, 'X');
            game.board[boardNum][indexY][indexX] = "x"
        }
        else
        {
            var piece = game.addSprite(spotx, spoty, 'O');
            game.board[boardNum][indexY][indexX] = "o"
        }
        game.updateTurnStatus(boardNum, indexX, indexY)
        //game.updateTurnStatus(indexX, indexY)
        //game.checkClick(0, point)
        /*sprite.isEnabled = false
        
        //if the clicked square is not empty, i.e it has a value other than a blank
        //string, don't do anything
        if(game.board[indexY][indexX] != "")
            return
            
        //place either an x or o, depending whose turn it is
        if(game.isXTurn){
            var piece = game.addSprite(sprite.x, sprite.y, 'star');
            game.placedPieces.push(piece);
            game.board[indexY][indexX] = "x"
        }
        else{
            var piece = game.addSprite(sprite.x, sprite.y, 'moon');
            game.placedPieces.push(piece);
            game.board[indexY][indexX] = "o";
        }
        
        
        game.updateTurnStatus(indexX, indexY)*/
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
        else if(game.checkIfOver3D(col, row))
        {
            gameOver = true
            game.isDraw = false
        }
        /*else if(game.turns >= 8)
        {
            gameOver = true;
            game.isDraw = true
        }*/
        
        return gameOver
        
    },
    
    checkIfOver3D(col, row)
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
    
    checkClick(point)
    {
        
        /*var matrix = [ [0.74855, -0.18590, 46.74222],
                      [0.00023, 0.31327, 34.07524],
                      [0.00000, -0.00125, 1.06237]
                      ]*/

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
        /*var zpoint = [[point[0], point[1], 1]]
        var inverse = [[1.32267,	0.30744,	-34.0],
                       
                       [-0.001874,	2.57322,	0.125],
                       [-0.00001,	0.00314,	1.0]
                       ]
        var inverse = [[1.32267,	0.30744,	-34.0],
                       
                       [-0.001874,	2.57322,	0.125],
                       [-0.00001,	0.00314,	1.0]
                       ]
        
        result = game.multiplyMatrices(zpoint, inverse)
        
        console.log("-----result of matrix mu,tiplication-----")
        console.log(result[0])*/
        
        
        /*var vertices = game.squares[row]
        console.log(row)
        console.log(vertices)
        console.log(point)
        for (var i = 0; i < vertices.length; i++)
        {
             if(game.insidePolygon(point,vertices[i]))
                 return i;
                    
        }
        
        return -1;*/
    },
    
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
                      
    multiplyMatrices(m1, m2) {
        var result = [];
        /*console.log("martixes being mutiplied")
        console.log(m1)
        console.log(m2)*/
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
    
    insidePolygon(point, vertices)
    {
        // ray-casting algorithm based on
        // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
        
        var x = point[0], y = point[1];
        
        var inside = false;
        for (var i = 0, j = vertices.length - 1; i < vertices.length; j = i++) {
            var xi = vertices[i][0], yi = vertices[i][1];
            var xj = vertices[j][0], yj = vertices[j][1];
            
            var intersect = ((yi > y) != (yj > y))
            && (x <= (xj - xi) * (y - yi) / (yj - yi) + xi);
            if (intersect) inside = !inside;
        }
        
        return inside;
    },
    
    makeBoardCoords()
    {
       /* game.squares =
        [
         [
          [[19, 20], [ 59,20],[61,1], [24,1] ],
          [[61, 20], [99, 20], [99,1], [62, 1]],
          [[101, 20], [139, 20], [136, 1], [100, 1]],
          [[140, 20],[178, 20],[174, 1],[138,1]]
          ],
         [
          [[14, 43], [ 56, 43],[59,21], [20,21] ],
          [[58,43], [99,43], [99, 21], [61, 21]],
          [[101, 43], [142, 43], [139, 21], [100, 21]],
          [[143, 43], [185, 43], [180, 21], [140, 21]]
          ],
         [
          [[9, 70], [ 53, 70],[56,45], [15,45] ],
          [[55,70], [99,70], [99, 45], [60, 45]],
          [[101, 70], [145, 70], [142, 45], [100, 45]],
          [[147, 70], [192, 70], [185, 45], [143, 45]]
          ],
         [
          [[2, 101], [ 50, 101],[53,71], [8,71] ],
          [[51,101], [100,101], [100, 71], [54, 71]],
          [[102, 101], [ 150, 101],[146,71], [102,71]],
          [[151, 101], [ 200, 101],[193,71], [147,71]]
          ]
         ]*/
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
        game.checkClick = this.checkClick
        game.insidePolygon = this.insidePolygon
        game.multiplyMatrices = this.multiplyMatrices
        game.convertToShearCoords = this.convertToShearCoords
        game.checkIfOver3D = this.checkIfOver3D
    }
};
