var keyValue = sessionStorage.getItem("userkey");
var challengesRef = firebase.database().ref('/users/' + keyValue + '/challenges');
var userRef = firebase.database().ref('/users/' + keyValue);
/*
 The actual meat of the game, game state contains all the logic for the tictactoe
 game.
 */
var ultimateTTTState = {

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
        
		//create background
		var background = game.add.sprite(game.world.centerX, game.world.centerY, 'background');
        background.anchor.set(0.5);
        background.width = game.screenWidth;
        background.height = 700;
        
        game.boardHeight = 102
        game.boardOffset = 15
        game.pieceWidth = 38
        game.pieceHeight = 25

        game.squareSize = 50
        //the size of the board, i.e nxn board, 3x3 for tictactoe
        game.n = 3
        game.isXTurn = true
        game.isDraw = false
        game.magicSquare = false
        game.firstTime = true
        
        
        // game.boardIsDraw = {}

        // game.boardIsDraw = [];
        // for (var i=0; i < game.n; i++) {
        //     game.boardIsDraw[i]=new Array(game.n)
        // }

         
        game.turns = 0
        game.linesToAnimate = 0

        game.boardTurns = [];
        for (var i=0; i < game.n; i++) {
            game.boardTurns[i]=new Array(game.n)
        }  

        for (var i=0; i < game.n; i++)
        {
            for (var j=0; j < game.n; j++)
            {
                game.boardTurns[i][j] = 0
            }
        }

        console.log("First Time")
        
        //the top left coordinate to place the whole board at, we will make game
        //not hardcoded in the furture to center the board, but I believe we need jQuery
        //to get window size and I didn't feel like learning that right now
        game.startingX = game.screenWidth/2 - game.cache.getImage('board').width / 1.2
        game.startingY = 80

        // game.secStartingX = 400 - ((game.cache.getImage('square').width* game.n) / 2)
        // game.secStartingY = 115

        // game.trdStartingX = 400 - ((game.cache.getImage('square').width* game.n) / 2)
        // game.trdStartingY = 15
        //intialize waiting status to false, update accordingly later if multiplayer
        game.waiting = false

        //record of the pieces that have been placed
        game.placedPieces = []

        //record of the big pieces that have been placed
        game.bigPlacedPieces = []

        game.bigBoardLogic = []
        for (var i=0; i < game.n; i++) {
            game.bigBoardLogic[i]=new Array(game.n)
        }  

        for (var i=0; i < game.n; i++)
        {
            for (var j=0; j < game.n; j++)
            {
                game.bigBoardLogic[i][j] = "open"
            }
        }

        game.magicBoardLogic = []
        for (var i=0; i < game.n; i++) {
            game.magicBoardLogic[i]=new Array(game.n)
        }  

        for (var i=0; i < game.n; i++)
        {
            for (var j=0; j < game.n; j++)
            {
                game.magicBoardLogic[i][j] = "null"
            }
        }
        
        //asign functions ot the game object, so they can be called by the client
        this.assignFunctions()

        game.cursorSquares = []
        for (var i=0; i < game.n; i++) {
            game.cursorSquares[i]=new Array(game.n)
        } 
        
        game.redSquares = []
        for (var i=0; i < game.n; i++) {
            game.redSquares[i]=new Array(game.n)
            for (var j=0; j < game.n; j++)
            {
                game.redSquares[i][j]=new Array(game.n)
                for (var k=0; k < game.n; k++)
                {
                    game.redSquares[i][j][k]=new Array(game.n)
                }
            }
        } 

        for (var i=0; i < game.n; i++)
        {
            for (var j=0; j < game.n; j++)
            {
                game.cursorSquares[i][j] = game.addSpriteWithWidth(game.startingX + i*game.squareSize*3, game.startingY + j*game.squareSize*3, 'greensquare', game.squareSize*3, game.squareSize*3)
                game.cursorSquares[i][j].alpha = 0
                for (var k=0; k < game.n; k++)
                {
                    for (var l=0; l < game.n; l++)
                    {
                        game.redSquares[i][j][k][l] = game.addSprite(game.startingX + i*game.squareSize*3 + k*game.squareSize, game.startingY + j * game.squareSize*3 + l*game.squareSize, 'redsquare')
                        game.redSquares[i][j][k][l].alpha = 0
                    }
                }
            }
        }
        game.firstTime = false
        
        //create an internal representation of the board as a 2D array
        game.board = game.makeBoardAsArray(game.n)
        //create the board on screen and makes each square clickable
        game.makeBoardOnScreen()
        //add messages that display turn status, connection statuses
        this.addTexts()
        //folloowing logic is for multiplayer games
        if(game.singleplayer)
            return
        
        game.previousPiece = ""
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
     returns nxn 4D array
     board[i][j] = big board coordinates
     board[][][k][l] = small board coordinates
     */
    makeBoardAsArray(n) {
        board = [];
        for (var i=0; i < n; i++)
        {
            board[i] = new Array(n)
            for (var j=0; j < n; j++)
            {
                board[i][j]=new Array(n)
                for (var k=0; k < n; k++)
                {
                    board[i][j][k]=new Array(n)
                }
            }
            
        }
        
        for (var i=0; i < n; i++)
        {
            for (var j=0; j < n; j++)
            {
                // board[i][j]= ""
                for (var k=0; k < n; k++)
                {
                    for (var l=0; l < n; l++)
                        board[i][j][k][l]= ""
                }
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
        for (var i=0; i < game.n; i++) {
            for (var j=0; j < game.n; j ++) {
                // var bigXindex = i
                // var bigYindex = j
                //initialize 2D array board to be empty strings
                //game.board[i][j] = "";
                for (var k=0; k < game.n; k++) {
                    for (var l=0; l < game.n; l++) {
                    //create square
                    var square = game.addSprite(game.startingX + i*game.squareSize*3 + k*game.squareSize, game.startingY + j * game.squareSize*3 + l*game.squareSize, 'square');
                    // console.log(square)
                    //console.log(i,j,k,l)
                    //console.log(game.startingX + i*game.squareSize*3 + k*game.squareSize, game.startingY + j * game.squareSize*3 + l*game.squareSize)
                    //allow square to respond to input
                    square.inputEnabled = true
                    //indices used for the 4D array
                    square.bigXindex = i
                    square.bigYindex = j
                    square.littleXindex = k
                    square.littleYindex = l
                    // game.board[i][j][k][l] = "";
                    //make have placePiece be called when a square is clicked
                    square.events.onInputDown.add(game.placePiece, game)
                    }
                }
            }
        }
        game.drawLines()
    },
    
    
    
    /*
        places a piece on an empty square, either x or o depending whose turn it is
     */
    placePiece(sprite, pointer)
    {
        //if we are waiting for the opponent, do nothing on click
        if(game.waiting)
            return
        if(game.multiplayer && game.checkForDoubleClick())
            return
        //the indexes in the 2D big array corresponding to the clicked square    
        var bigIndexX = sprite.bigXindex
        console.log("bX: ", bigIndexX)
        var bigIndexY = sprite.bigYindex
        console.log("bY: ", bigIndexY)
        
        //the indexes in the 2D little array corresponding to the clicked square
        var littleIndexX = sprite.littleXindex
        console.log("lX: ", littleIndexX)
        var littleIndexY = sprite.littleYindex
        console.log("lY: ", littleIndexY)
        
        sprite.isEnabled = false  

        if(game.magicBoardLogic[bigIndexX][bigIndexY] === "magic")
        {
            console.log('MAGIC')
        }
        // if(game.bigBoardLogic[bigIndexX][bigIndexY] === "open" && typeof game.board[bigIndexY][bigIndexX] === 'string')
        // {
        //     console.log("MAGIC SQUARE")
        //     game.magicSquare = true
        // }
        else if(game.bigBoardLogic[bigIndexX][bigIndexY] === "open")
            console.log('OPEN')
        else if(game.bigBoardLogic[bigIndexX][bigIndexY] === "closed") 
        {
            console.log('CLOSED')
            return
        }
        
        //if the clicked square OR BIGSQUARE is not empty, i.e it has a value other than a blank
        //string, don't do anything
        if(typeof game.board[bigIndexY][bigIndexX] === 'string')
        {
            //if magic overwrites closed, then if you click on a "supposed" closed board and it is magic itll loop)
            return
        }

        console.log(game.board[bigIndexY][bigIndexX][littleIndexY][littleIndexX])
        if(game.board[bigIndexY][bigIndexX][littleIndexY][littleIndexX] != "")
            return
        // if(game.board[bigIndexY][bigIndexX] == "x" || game.board[bigIndexY][bigIndexX] == "o")
        //     console.log("OLGAAAA")
        //     console.log(game.board[bigIndexY][bigIndexX])
        //     return
        if(game.multiplayer)
            game.waiting = true;
           
         //place either an x or o, depending whose turn it is
        if(game.isXTurn)
        {
            var piece = game.addSprite(sprite.x, sprite.y, 'X');
            game.placedPieces.push(piece);
            game.board[bigIndexY][bigIndexX][littleIndexY][littleIndexX] = "x"
            game.previousPiece = "x";
        }
        else{
            var piece = game.addSprite(sprite.x, sprite.y, 'O');
            game.placedPieces.push(piece);
            game.board[bigIndexY][bigIndexX][littleIndexY][littleIndexX] = "o";
            game.previousPiece = "o";
        }
        

        game.updateTurnStatus(bigIndexX, bigIndexY, littleIndexX, littleIndexY)
    },
    
    /*
        switch current turn, and display whose turn it is
     */
    switchTurn(x,y,lx,ly){
        console.log("switching current turn")
        game.isXTurn = !game.isXTurn
        game.turns++
        game.boardTurns[x][y] = game.boardTurns[x][y] + 1 // Now the turns for each mini board are updated
        console.log("Board turns:", game.boardTurns[x][y])
        pieceChallenge(game.turns);
        console.log("turn count: " + game.turns)

        // Set Logic for piece placement next time around (needs alpha changes)
        // console.log("BOARD LOGIC B4: ", game.bigBoardLogic)
        for (var i = 0; i < 3; i++)
        {
            for (var j = 0; j < 3; j++)
            {
                for (var k = 0; k < 3; k++)
                {
                    for (var l = 0; l < 3; l++)
                    {
                        if(i == x && j == y && k == lx && l == ly)
                            game.redSquares[i][j][k][l].alpha = .7
                        else
                            game.redSquares[i][j][k][l].alpha = 0
                    }
                }
            }
        }

        var connectedSquare = false

        for (var i = 0; i < 3; i++)
        {
            for (var j = 0; j < 3; j++)
            {
                //Normal functionality, just assign one open spot
                if(i == lx && j == ly && game.magicBoardLogic[i][j] != "magic")
                {
                    console.log("i: ", i)
                    console.log("j: ", j)
                    console.log("lx: ", lx)
                    console.log("ly: ", ly)
                    game.bigBoardLogic[i][j] = "open"
                    game.cursorSquares[i][j].alpha = .7 
                    // game.cursorSquares[i][j].tint = 0xffffff
                }
                // If the click on a open spot sends you to magic board
                else if (i == lx && j == ly && game.magicBoardLogic[i][j] === "magic")
                {
                    for (var i = 0; i < 3; i++)
                    {
                        for (var j = 0; j < 3; j++)
                        {
                                // Set all squares to closed 
                                game.bigBoardLogic[i][j] = "closed"
                                game.cursorSquares[i][j].alpha = 0
                        }
                    }

                    // game.bigBoardLogic[x][y] = "closed"
                    // game.cursorSquares[x][y].alpha = 0

                    if (lx+1 < 3) {
                        game.bigBoardLogic[lx+1][ly] = "open" // Right
                        game.cursorSquares[lx+1][ly].alpha = .7
                        if (lx+1 == x && ly == y)
                            connectedSquare = true
                    }

                    if (lx-1 > -1) {
                        game.bigBoardLogic[lx-1][ly] = "open" // Left
                        game.cursorSquares[lx-1][ly].alpha = .7
                        if (lx-1 == x && ly == y)
                            connectedSquare = true
                    }

                    if (ly+1 < 3) {
                        game.bigBoardLogic[lx][ly+1] = "open" // Bottom 
                        game.cursorSquares[lx][ly+1].alpha = .7
                        if (lx == x && ly+1 == y)
                            connectedSquare = true
                    }

                    if (ly-1 > -1) {
                        game.bigBoardLogic[lx][ly-1] = "open" // Top
                        game.cursorSquares[lx][ly-1].alpha = .7
                        if (lx == x && ly-1 == y)
                            connectedSquare = true
                    }

                    if (lx+1 < 3 && ly-1 > -1) {
                        game.bigBoardLogic[lx+1][ly-1] = "open" // Top right
                        game.cursorSquares[lx+1][ly-1].alpha = .7
                        if (lx+1 == x && ly-1 == y)
                            connectedSquare = true
                    }

                    if (lx-1 > -1 && ly-1 > -1) {
                        game.bigBoardLogic[lx-1][ly-1] = "open" // Top left
                        game.cursorSquares[lx-1][ly-1].alpha = .7
                        if (lx-1 == x && ly-1 == y)
                            connectedSquare = true
                    }

                    if (lx+1 < 3 && ly+1 < 3) {
                        game.bigBoardLogic[lx+1][ly+1] = "open" // Bottom right
                        game.cursorSquares[lx+1][ly+1].alpha = .7
                        if (lx+1 == x && ly+1 == y)
                            connectedSquare = true
                    }

                    if (lx-1 > -1 && ly+1 < 3) {
                        game.bigBoardLogic[lx-1][ly+1] = "open" // Bottom left
                        game.cursorSquares[lx-1][ly+1].alpha = .7
                        if (lx-1 == x && ly+1 == y)
                            connectedSquare = true 
                    }

                    for (var i = 0; i < 3; i++)
                    {
                        for (var j = 0; j < 3; j++)
                        {
                                // Set everything but the magic square(s) to open
                                // game.bigBoardLogic[i][j] = "open"
                                // game.cursorSquares[i][j].alpha = .7
        
                                if (game.magicBoardLogic[i][j] === "magic")
                                    // game.bigBoardLogic[i][j] = "closed"
                                    game.cursorSquares[i][j].alpha = 0
                        }
                    }

                    // If you get stuck, open up outer layer
                    var stuck = true
                    for (var i = 0; i < 3; i++)
                    {
                        for (var j = 0; j < 3; j++)
                        {
                            if (game.bigBoardLogic[i][j] === "open" && game.magicBoardLogic[i][j] != "magic")
                                stuck = false
                        }
                    }

                    if (stuck == true) {
                        console.log("STUCK");
                        if (lx+2 < 3) {
                            console.log("A");
                            game.bigBoardLogic[lx+2][ly] = "open" // Right
                            game.cursorSquares[lx+2][ly].alpha = .7
                            if (lx+2 == x && ly == y)
                                connectedSquare = true
                        }

                        if (lx+2 < 3 && ly-1 > -1) {
                            console.log("A1");
                            game.bigBoardLogic[lx+2][ly-1] = "open" // Right 2 up 1
                            game.cursorSquares[lx+2][ly-1].alpha = .7
                            if (lx+2 == x && ly-1 == y)
                                connectedSquare = true
                        }

                        if (lx+1 < 3 && ly-2 > -1) {
                            console.log("A2");
                            game.bigBoardLogic[lx+1][ly-2] = "open" // Right 1 up 2
                            game.cursorSquares[lx+1][ly-2].alpha = .7
                            if (lx+1 == x && ly-2 == y)
                                connectedSquare = true
                        }

                        if (lx+1 < 3 && ly+2 < 3) {
                            console.log("A3");
                            game.bigBoardLogic[lx+1][ly+2] = "open" // Right 1 down 2
                            game.cursorSquares[lx+1][ly+2].alpha = .7
                            if (lx+1 == x && ly+2 == y)
                                connectedSquare = true
                        }

                        if (lx+2 < 3 && ly+1 < 3) {
                            console.log("A4");
                            game.bigBoardLogic[lx+2][ly+1] = "open" // Right 2 down 1
                            game.cursorSquares[lx+2][ly+1].alpha = .7
                            if (lx+2 == x && ly+1 == y)
                                connectedSquare = true
                        }
    
                        if (lx-2 > -1) {
                            console.log("B");
                            game.bigBoardLogic[lx-2][ly] = "open" // Left
                            game.cursorSquares[lx-2][ly].alpha = .7
                            if (lx-2 == x && ly == y)
                                connectedSquare = true
                        }

                        if (lx-2 > -1 && ly-1 > -1) {
                            console.log("B1");
                            game.bigBoardLogic[lx-2][ly-1] = "open" // Left 2 up 1
                            game.cursorSquares[lx-2][ly-1].alpha = .7
                            if (lx-2 == x && ly-1 == y)
                                connectedSquare = true
                        }

                        if (lx-1 > -1 && ly-2 > -1) {
                            console.log("B2");
                            game.bigBoardLogic[lx-1][ly-2] = "open" // Left 1 up 2
                            game.cursorSquares[lx-1][ly-2].alpha = .7
                            if (lx-1 == x && ly-2 == y)
                                connectedSquare = true
                        }

                        if (lx-1 > -1 && ly+2 < 3) {
                            console.log("B3");
                            game.bigBoardLogic[lx-1][ly+2] = "open" // Left 1 down 2
                            game.cursorSquares[lx-1][ly+2].alpha = .7
                            if (lx-1 == x && ly+2 == y)
                                connectedSquare = true
                        }

                        if (lx-2 > -1 && ly+1 < 3) {
                            console.log("B4");
                            game.bigBoardLogic[lx-2][ly+1] = "open" // Left 2 down 1
                            game.cursorSquares[lx-2][ly+1].alpha = .7
                            if (lx-2 == x && ly+1 == y)
                                connectedSquare = true
                        }
    
                        if (ly+2 < 3) {
                            console.log("C");
                            game.bigBoardLogic[lx][ly+2] = "open" // Bottom 
                            game.cursorSquares[lx][ly+2].alpha = .7
                            if (lx == x && ly+2 == y)
                                connectedSquare = true
                        }
    
                        if (ly-2 > -1) {
                            console.log("D");
                            game.bigBoardLogic[lx][ly-2] = "open" // Top
                            game.cursorSquares[lx][ly-2].alpha = .7
                            if (lx == x && ly-2 == y)
                                connectedSquare = true
                        }
    
                        if (lx+2 < 3 && ly-2 > -1) {
                            console.log("E");
                            game.bigBoardLogic[lx+2][ly-2] = "open" // Top right
                            game.cursorSquares[lx+2][ly-2].alpha = .7
                            if (lx+2 == x && ly-2 == y)
                                connectedSquare = true
                        }
    
                        if (lx-2 > -1 && ly-2 > -1) {
                            console.log("F");
                            game.bigBoardLogic[lx-2][ly-2] = "open" // Top left
                            game.cursorSquares[lx-2][ly-2].alpha = .7
                            if (lx-2 == x && ly-2 == y)
                                connectedSquare = true
                        }
    
                        if (lx+2 < 3 && ly+2 < 3) {
                            console.log("g");
                            game.bigBoardLogic[lx+2][ly+2] = "open" // Bottom right
                            game.cursorSquares[lx+2][ly+2].alpha = .7
                            if (lx+2 == x && ly+2 == y)
                                connectedSquare = true
                        }
    
                        if (lx-2 > -1 && ly+2 < 3) {
                            console.log("H");
                            game.bigBoardLogic[lx-2][ly+2] = "open" // Bottom left
                            game.cursorSquares[lx-2][ly+2].alpha = .7
                            if (lx-2 == x && ly+2 == y)
                                connectedSquare = true 
                        }
                    }

                    for (var i = 0; i < 3; i++)
                    {
                        for (var j = 0; j < 3; j++)
                        {
                                // Set everything but the magic square(s) to open
                                // game.bigBoardLogic[i][j] = "open"
                                // game.cursorSquares[i][j].alpha = .7
        
                                if (game.magicBoardLogic[i][j] === "magic")
                                    // game.bigBoardLogic[i][j] = "closed"
                                    game.cursorSquares[i][j].alpha = 0
                        }
                    }

                }
                else
                {
                    game.bigBoardLogic[i][j] = "closed"
                    game.cursorSquares[i][j].alpha = 0
                }
            }
        }

        // console.log("BOARD LOGIC: ", game.bigBoardLogic)
        game.printBoardLogic() //this is printing weird but logic is fine

        var turn = game.isXTurn ? "x" : "o"
        if(game.singleplayer)
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
        if(game.isOver(coordInfo.bx, coordInfo.by, coordInfo.lx, coordInfo.ly))
        {
            if(game.isDraw) {
                game.displayWinner()
            }
            //game.displayWinner()
            game.waiting = true
            console.log(board)
        }
        var bx = coordInfo.bx
        var by = coordInfo.by
        var lx = coordInfo.lx
        var ly = coordInfo.ly
        console.log("synchronizre it")
        game.switchTurn(bx,by,lx,ly) // May need to change so that it is passing bigX and bigY for updating small board turn count
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

    printBoardLogic(){
        for (var i=0; i < game.n; i++) {
            console.log(game.bigBoardLogic[i])
        }
        console.log("");

        for (var j=0; j < game.n; j++) {
            console.log(game.magicBoardLogic[i])
        }
        console.log("");
    },
    
    /*
     check if the game is over, given the index of the piece that was just placed
     */
    isOver(bCol, bRow, lCol, lRow)
    {
        //create Sets for each direction. Since a Set has unique entries, if there
        //is only one entry and it is not an empty string, that entry is the winner
        var lHorizontal = new Set()
        var lVertical = new Set()

        var lPosDiagonal = new Set()
        var lNegDiagonal = new Set()
        
        var bHorizontal = new Set()
        var bVertical = new Set()

        var bPosDiagonal = new Set()
        var bNegDiagonal = new Set()
        
        // First, check the little boards
        for (var y=0; y < game.n; y++){
            //check the possible horizontal and vertical wins for the given placement
            lHorizontal.add(game.board[bRow][bCol][lRow][y])
            lVertical.add(game.board[bRow][bCol][y][lCol])
            //check the possible diagonal wins by checking the main diagonals
            lPosDiagonal.add(game.board[bRow][bCol][y][y])
            lNegDiagonal.add(game.board[bRow][bCol][game.n-1-y][y])
        }

        // console.log(game.board[bCol][bRow])

        // console.log(lHorizontal)
        // console.log(lVertical)

        var boardOver = false
        //if all entries in a row or column are the same, then the board is over
        //we don't need to check that the only entry is not a blank string, since
        //these Sets will include the piece that was just placed, which cannot possibly be blank
        // if(lHorizontal.size === 1 && !lHorizontal.has(""))
        if(lHorizontal.size === 1)
        {
            // console.log("HORZ: ", lHorizontal)
            boardOver = true
            // game.boardIsDraw[bCol, bRow] = false
            console.log("lH won")
        }
        // else if(lVertical.size === 1 && !lVertical.has(""))
        else if(lVertical.size === 1)
        {
            // console.log("VERT: ", lVertical)
            boardOver = true
            // game.boardIsDraw[bCol, bRow] = false
            console.log("lV won")
        }
        //if all entries in a diagonal are the same AND that entry is not blank,
        //then the board is over
        else if(lPosDiagonal.size === 1 && !lPosDiagonal.has(""))
        {
            boardOver = true
            // game.boardIsDraw[bCol, bRow] = false
            console.log("lPosD won")
        }
        else if(lNegDiagonal.size === 1 && !lNegDiagonal.has(""))
        {
            boardOver = true
            // game.boardIsDraw[bCol, bRow] = false
            console.log("lNegD won")
        }
        else if(game.boardTurns[bCol][bRow] >= 8) //NEEDS TO BE ARRAY
        {
            boardOver = true
            // game.boardIsDraw[bCol, bRow] = true
            game.board[bRow][bCol] = 'Draw'
            console.log("lDraw")
        }
        
        // return gameOver
        // TODO: make function called "update big board", pass (boardOver)
        if(boardOver == true)
            game.updateBigBoard(bCol, bRow, lCol, lRow)

        // Next, check the large board
        for (var y=0; y < game.n; y++){
            //check the possible horizontal and vertical wins for the given placement
            bHorizontal.add(game.board[bRow][y])
            bVertical.add(game.board[y][bCol])
            //check the possible diagonal wins by checking the main diagonals
            bPosDiagonal.add(game.board[y][y])
            bNegDiagonal.add(game.board[game.n-1-y][y])
        }

        var gameOver = false;
        //if all entries in a row or column are the same, then the game is over
        //we don't need to check that the only entry is not a blank string, since
        //these Sets will include the piece that was just placed, which cannot possibly be blank
        if(bHorizontal.size === 1 && !bHorizontal.has("Draw"))
        {
            gameOver = true
            game.isDraw = false
            var lineAngle = -90
            var startingY = game.startingX + (game.squareSize * 3* (bRow)) - game.squareSize/4
            var endingX = game.screenWidth + 100
            game.drawWinningLine(game.startingX - 15, startingY, endingX, startingY, lineAngle, 350)
        }
        else if(bVertical.size === 1 && !bVertical.has("Draw"))
        {
            gameOver = true
            game.isDraw = false
            
            var lineAngle = 0
            var startingX = game.startingX + (game.squareSize * 3 * (bCol+1)) - (game.squareSize*3/2)
            game.drawWinningLine(startingX, game.startingY - 15, startingX, 800, lineAngle, 330)
        }
        //if all entries in a diagonal are the same AND that entry is not blank,
        //then the game is over
        else if(bPosDiagonal.size === 1 && !bPosDiagonal.has("")  && !bPosDiagonal.has("Draw"))
        {
            gameOver = true
            game.isDraw = false
            var lineAngle = -45
            var startingX = game.startingX
            var startingY = game.startingY + 15
            var endingX = game.screenWidth + 100
            var endingY = 800
            game.drawWinningLine(startingX, startingY, endingX, endingY, lineAngle, 480)
        }
        else if(bNegDiagonal.size === 1 && !bNegDiagonal.has("")  && !bNegDiagonal.has("Draw"))
        {
            gameOver = true
            game.isDraw = false
            var lineAngle = -135
            var startingX = game.startingX
            var startingY = game.startingY + (game.squareSize * 3 * game.n)
            var endingX = game.screenWidth + 100
            var endingY = -100
            game.drawWinningLine(startingX, startingY, endingX, endingY, lineAngle, 480)
        }
        else if(game.turns >= 80 || game.bigPlacedPieces.length == 9)
        {
            gameOver = true;
            game.isDraw = true
            console.log("bDraw")
        }
        
        return gameOver
        
    },

    /*
     adds a sprite to the screen and returns a reference to it, scales image down
     to half its size, we can change game later
     */
    addSpriteWithWidth(x, y, name, width, height)
    {
        var sprite = game.add.sprite(x, y, name);
        //sprite.scale.setTo(0.5, 0.5);
        sprite.width = width
        sprite.height = height

        return sprite
    },

    // addDrawSpriteWithWidth(x, y, name1, name2, width, height)
    // {
    //     console.log('poop')
    //     var sprite = game.add.sprite(x, y, name2);
    //     sprite = game.add.sprite(x, y, name1);
    //     //sprite.scale.setTo(0.5, 0.5);
    //     sprite.width = width
    //     sprite.height = height

    //     // var mask = new PIXI.Graphics();   
    //     // mask.position.x = x;   
    //     // mask.position.y = y;   
    //     // mask.beginFill(0, 1);   
    //     // mask.moveTo(0, 0);   
    //     // mask.lineTo(100, 0);   
    //     // mask.lineTo(100, 100);   
    //     // mask.lineTo(0, 100);   
    //     // mask.lineTo(0, 0);   
    //     // mask.endFill();   
    //     // sprite.mask = mask;

    //     return sprite
    // },

    /*
     Make the big board have big X and O's,
        while also making it so that you can't click on that board anymore
     */
    updateBigBoard(bCol, bRow, lCol, lRow) {
        //place either an x or o, depending whose turn it is
        // game.startingX + i*game.squareSize*3 + k*game.squareSize, game.startingY + j * game.squareSize*3 + l*game.squareSize

        if (game.board[bRow][bCol] === 'Draw')
        {
            // I think a poop emoji image would be best here
            // var bigPiece = game.addDrawSpriteWithWidth(game.startingX + bCol*game.squareSize*3, game.startingY + bRow*game.squareSize*3, 'star', 'moon', game.squareSize*3, game.squareSize*3)
            // var bigPiece2 = game.addSpriteWithWidth(game.startingX + bCol*game.squareSize*3 + game.squareSize*3/2 - game.squareSize*1/3, game.startingY + bRow*game.squareSize*3 + game.squareSize*1/2, 'moon', game.squareSize*1.8, game.squareSize*1.8)
            // var bigPiece1 = game.addSpriteWithWidth(game.startingX + bCol*game.squareSize*3 - game.squareSize*1/5, game.startingY + bRow*game.squareSize*3 + game.squareSize*1/2, 'star', game.squareSize*1.8, game.squareSize*1.8)
            var bigPiece1 = game.addSpriteWithWidth(game.startingX + bCol*game.squareSize*3, game.startingY + bRow*game.squareSize*3, 'poopemoji', game.squareSize*3, game.squareSize*3)
            bigPiece1.big = true
            game.bigPlacedPieces.push(bigPiece1); // might have broken the draw logic
            // game.board[bRow][bCol] = 'Draw'
        }
        else if(game.isXTurn)
        {
            // var bigPiece = game.addSprite(bCol, bRow, 'O'); //put in middle of display? also needs resizing
            var bigPiece = game.addSpriteWithWidth(game.startingX + bCol*game.squareSize*3, game.startingY + bRow*game.squareSize*3, 'X', game.squareSize*3, game.squareSize*3)
            game.bigPlacedPieces.push(bigPiece);
            bigPiece.big = true
            game.board[bRow][bCol] = "x";
        }
        else{
            // var bigPiece = game.addSprite(bCol, bRow, 'O'); //put in middle of display? also needs resizing
            var bigPiece = game.addSpriteWithWidth(game.startingX + bCol*game.squareSize*3, game.startingY + bRow*game.squareSize*3, 'O', game.squareSize*3, game.squareSize*3)
            game.bigPlacedPieces.push(bigPiece);
            bigPiece.big = true
            game.board[bRow][bCol] = "o";
        }
        
        game.magicBoardLogic[bCol][bRow] = "magic"
        game.bigBoardLogic[bCol][bRow] = "closed"

        // game.updateTurnStatus(bigIndexX, bigIndexY, littleIndexX, littleIndexY)
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
            game.addSprite(coords[0], coords[1], 'X');
        }
        else
        {
            var coords = game.convertIndexesToCoords(row, col)
            game.addSprite(coords[0], coords[1], 'O');
        }
        return*/

        // THIS WILL NEED TO HAVE LOGIC FOR BIG PIECES UPDATES TOO

        game.board = board
        console.log('BOARD: ', game.board)
        //rub out pieces, so we don't draw multiple on top of each other
        for(var i in game.placedPieces)
        {
            game.placedPieces[i].kill();
            game.placedPieces.splice(i, 1);
        }
        //draw the pieces on the screen
        for(var i=0; i < game.n; i++) {
            for (var j=0; j < game.n; j ++) {
                
                var bx = game.startingX + i*game.squareSize*3;
                var by = game.startingY + j * game.squareSize*3;
                if(game.board[j][i] === "x"){
                    // game.addSprite(x, y, 'star'); // needs to change to big logic
                    var bigPiece = game.addSpriteWithWidth(bx, by, 'X', game.squareSize*3, game.squareSize*3)
                    bigPiece.big = true
                    game.bigPlacedPieces.push(bigPiece)
                }
                if(game.board[j][i] === "o"){
                    // game.addSprite(x, y, 'moon');
                    var bigPiece = game.addSpriteWithWidth(bx, by, 'O', game.squareSize*3, game.squareSize*3)
                    bigPiece.big = true
                    game.bigPlacedPieces.push(bigPiece1)

                }
                // Needs draw logic
                if (game.board[j][i] === 'Draw')
                {
                    // I think a poop emoji image would be best here

                    // var bigPiece = game.addDrawSpriteWithWidth(game.startingX + bCol*game.squareSize*3, game.startingY + bRow*game.squareSize*3, 'star', 'moon', game.squareSize*3, game.squareSize*3)
                    
                    var bigPiece1 = game.addSpriteWithWidth(bx, by, 'poopemoji', game.squareSize*3, game.squareSize*3)
                    bigPiece1.big = true
                    game.bigPlacedPieces.push(bigPiece1);


                }

                for (var k=0; k < game.n; k++) {
                    for (var l=0; l < game.n; l++) {
                        var lx = game.startingX + i*game.squareSize*3 + k*game.squareSize;
                        var ly = game.startingY + j*game.squareSize*3 + l*game.squareSize;
                        if(typeof game.board[j][i] === 'string')
                        {
                            //if magic overwrites closed, then if you click on a "supposed" closed board and it is magic itll loop)
                            //Do nothing (continue)
                        }
                        else if(game.board[j][i][l][k] === "x"){
                            game.addSprite(lx, ly, 'X');
                            
                        }
                        else if(game.board[j][i][l][k] === "o"){
                            game.addSprite(lx, ly, 'O');
                        }
                    }
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
    updateTurnStatus(bigIndexX, bigIndexY, littleIndexX, littleIndexY)
    {
        if(game.singleplayer)
        {
            //if single player, check if game ended right after placing a piece
            if(game.isOver(bigIndexX, bigIndexY, littleIndexX, littleIndexY))
            {
                if(game.isDraw) {
                    game.displayWinner()
                }
                game.waiting = true//game.displayWinner()
            }
            else
                game.switchTurn(bigIndexX, bigIndexY, littleIndexX, littleIndexY)
        }
        //if multiplayer, set waiting to true so that you can't place two pieces in one turn
        else
        {
            //send updated board to the server so the opponent's board is updated too
            var data = {board:game.board, bx:bigIndexX, by:bigIndexY, lx: littleIndexX, ly: littleIndexY, id:game.id};
            Client.sendClick(data);
        }
        
        //for debugging
        game.printBoard();
    },
    
    rescaleSprites()
    {
        
        game.endingBoard.forEach(function(element) {
             if(element.key != 'text' && element.key != 'redsquare' && !element.big && element.key != 'cometTail' && element.key != 'greensquare')
                    game.addSprite(element.x, element.y, element.key);
             else if(element.big)
                    game.addSpriteWithWidth(element.x, element.y, element.key, game.squareSize*3, game.squareSize*3)
             else if(element.key === 'cometTail')
             {
                 var cometTail = game.addSpriteNoScale(element.x, element.y, element.key)
                 cometTail.height = game.squareSize*3 + element.lineExtra
                 cometTail.angle = element.angle

             }
         });
        game.drawLines()
    },
    
    drawLines()
    {
        for (var i = 1; i < 3; i++)
        {
            var horzLine = game.add.graphics(game.startingX, game.startingY + i*game.squareSize*3)
            horzLine.lineStyle(6, 0xffff0, 1);
            horzLine.lineTo(game.squareSize*9,0);
            horzLine.endFill();
            
            var vertLine = game.add.graphics(game.startingX + i*game.squareSize*3, game.startingY)
            vertLine.lineStyle(6, 0xffff0, 1);
            vertLine.lineTo(0,game.squareSize*9);
            vertLine.endFill();
        }
    },
    
    drawWinningLine(startX, startY, endX, endY, angle, lineExtra)
    {
        game.linesToAnimate++
        //var piece2 = game.addSpriteNoScale(startX, startY, 'cometTail');
        //game.add.tween(piece2.scale).to({  y: 2.7}, 500, Phaser.Easing.Linear.None, true);
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
        //console.log(this)
        piece2.alpha = 0;
        piece2.angle = angle
        piece2.lineExtra = lineExtra
        //console.log("complete tween")
        
        var tween = game.add.tween(piece2).to( { alpha: 1 }, 1000, Phaser.Easing.Linear.None, true);
        //var tween = game.add.tween(line).to( { alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
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
    
    
    /*
        asign functions ot the game object, so they can be called by the client
        technically this is a state object, so the functions in this file are not 
        automatically assigned to the game object.
     */
    assignFunctions()
    {
        game.showSprites = this.showSprites
        game.addSpriteNoScale = this.addSpriteNoScale
        game.drawWinningLine = this.drawWinningLine
        game.completeDraw = this.completeDraw
        game.showSprites = this.showSprites
        game.showLine = this.showLine
        game.drawLines = this.drawLines
        game.rescaleSprites = this.rescaleSprites
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
        game.printBoardLogic = this.printBoardLogic
        game.updateBoard = this.updateBoard
        game.updateBigBoard = this.updateBigBoard
        game.assignID = this.assignID
        game.assignRoom = this.assignRoom
        game.startMatch = this.startMatch
        game.synchronizeTurn = this.synchronizeTurn
        game.restartMatch = this.restartMatch
        game.askForRematch = this.askForRematch
        game.updateTurnStatus = this.updateTurnStatus
        game.convertIndexesToCoords = this.convertIndexesToCoords
        game.addSpriteWithWidth = this.addSpriteWithWidth
        game.addDrawSpriteWithWidth = this.addDrawSpriteWithWidth
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

// // console.log("AHHHHHH")
//                     // var connectedSquare = false

//                     // if (lx+1 < 3) {
//                     //     game.bigBoardLogic[lx+1][ly] = "open" // Right
//                     //     game.cursorSquares[lx+1][ly].alpha = .7
//                     //     if (lx+1 == x && ly == y)
//                     //         connectedSquare = true
//                     // }

//                     // if (lx-1 > -1) {
//                     //     game.bigBoardLogic[lx-1][ly] = "open" // Left
//                     //     game.cursorSquares[lx-1][ly].alpha = .7
//                     //     if (lx-1 == x && ly == y)
//                     //         connectedSquare = true
//                     // }

//                     // if (ly+1 < 3) {
//                     //     game.bigBoardLogic[lx][ly+1] = "open" // Bottom 
//                     //     game.cursorSquares[lx][ly+1].alpha = .7
//                     //     if (lx == x && ly+1 == y)
//                     //         connectedSquare = true
//                     // }

//                     // if (ly-1 > -1) {
//                     //     game.bigBoardLogic[lx][ly-1] = "open" // Top
//                     //     game.cursorSquares[lx][ly-1].alpha = .7
//                     //     if (lx == x && ly-1 == y)
//                     //         connectedSquare = true
//                     // }

//                     // if (lx+1 < 3 && ly-1 > -1) {
//                     //     game.bigBoardLogic[lx+1][ly-1] = "open" // Top right
//                     //     game.cursorSquares[lx+1][ly-1].alpha = .7
//                     //     if (lx+1 == x && ly-1 == y)
//                     //         connectedSquare = true
//                     // }

//                     // if (lx-1 > -1 && ly-1 > -1) {
//                     //     game.bigBoardLogic[lx-1][ly-1] = "open" // Top left
//                     //     game.cursorSquares[lx-1][ly-1].alpha = .7
//                     //     if (lx-1 == x && ly-1 == y)
//                     //         connectedSquare = true
//                     // }

//                     // if (lx+1 < 3 && ly+1 < 3) {
//                     //     game.bigBoardLogic[lx+1][ly+1] = "open" // Bottom right
//                     //     game.cursorSquares[lx+1][ly+1].alpha = .7
//                     //     if (lx+1 == x && ly+1 == y)
//                     //         connectedSquare = true
//                     // }

//                     // if (lx-1 > -1 && ly+1 < 3) {
//                     //     game.bigBoardLogic[lx-1][ly+1] = "open" // Bottom left
//                     //     game.cursorSquares[lx-1][ly+1].alpha = .7
//                     //     if (lx-1 == x && ly+1 == y)
//                     //         connectedSquare = true 
//                     // }

//                     for (var m = 0; m < 3; m++)
//                     {
//                         for (var n = 0; n < 3; n++)
//                         {
//                                 game.bigBoardLogic[i][j] = "open"
//                                 game.cursorSquares[i][j].alpha = .7 
        
//                                 if (game.magicBoardLogic[m][n] === "magic")
//                                     game.cursorSquares[m][n].alpha = 0
//                         }
//                     }

//                     // // If you get stuck, open up outer layer
//                     // var stuck = true
//                     // for (var i = 0; i < 3; i++)
//                     // {
//                     //     for (var j = 0; j < 3; j++)
//                     //     {
//                     //         if (game.bigBoardLogic[i][j] === "open")
//                     //             stuck = false
//                     //     }
//                     // }

//                     // if (stuck == true) {
//                     //     console.log("STUCK");
//                     //     if (lx+2 < 3) {
//                     //         console.log("A");
//                     //         game.bigBoardLogic[lx+2][ly] = "open" // Right
//                     //         game.cursorSquares[lx+2][ly].alpha = .7
//                     //         if (lx+2 == x && ly == y)
//                     //             connectedSquare = true
//                     //     }
    
//                     //     if (lx-2 > -1) {
//                     //         console.log("B");
//                     //         game.bigBoardLogic[lx-2][ly] = "open" // Left
//                     //         game.cursorSquares[lx-2][ly].alpha = .7
//                     //         if (lx-2 == x && ly == y)
//                     //             connectedSquare = true
//                     //     }
    
//                     //     if (ly+2 < 3) {
//                     //         console.log("C");
//                     //         game.bigBoardLogic[lx][ly+2] = "open" // Bottom 
//                     //         game.cursorSquares[lx][ly+2].alpha = .7
//                     //         if (lx == x && ly+2 == y)
//                     //             connectedSquare = true
//                     //     }
    
//                     //     if (ly-2 > -1) {
//                     //         console.log("D");
//                     //         game.bigBoardLogic[lx][ly-2] = "open" // Top
//                     //         game.cursorSquares[lx][ly-2].alpha = .7
//                     //         if (lx == x && ly-2 == y)
//                     //             connectedSquare = true
//                     //     }
    
//                     //     if (lx+2 < 3 && ly-2 > -1) {
//                     //         console.log("E");
//                     //         game.bigBoardLogic[lx+2][ly-2] = "open" // Top right
//                     //         game.cursorSquares[lx+2][ly-2].alpha = .7
//                     //         if (lx+2 == x && ly-2 == y)
//                     //             connectedSquare = true
//                     //     }
    
//                     //     if (lx-2 > -1 && ly-2 > -1) {
//                     //         console.log("F");
//                     //         game.bigBoardLogic[lx-2][ly-2] = "open" // Top left
//                     //         game.cursorSquares[lx-2][ly-2].alpha = .7
//                     //         if (lx-2 == x && ly-2 == y)
//                     //             connectedSquare = true
//                     //     }
    
//                     //     if (lx+2 < 3 && ly+2 < 3) {
//                     //         console.log("g");
//                     //         game.bigBoardLogic[lx+2][ly+2] = "open" // Bottom right
//                     //         game.cursorSquares[lx+2][ly+2].alpha = .7
//                     //         if (lx+2 == x && ly+2 == y)
//                     //             connectedSquare = true
//                     //     }
    
//                     //     if (lx-2 > -1 && ly+2 < 3) {
//                     //         console.log("H");
//                     //         game.bigBoardLogic[lx-2][ly+2] = "open" // Bottom left
//                     //         game.cursorSquares[lx-2][ly+2].alpha = .7
//                     //         if (lx-2 == x && ly+2 == y)
//                     //             connectedSquare = true 
//                     //     }
//                     // }

//                     // console.log("HOLAHOLAHOLA: ", connectedSquare);
//                     // if (connectedSquare == false) {  // The square is not inside adjacent radius (both) so delete iots open status
//                     //     console.log("NO CONNECTED SQUARE");
//                     //     game.bigBoardLogic[x][y] = "closed"
//                     //     game.cursorSquares[x][y].alpha = 0
//                     // }

//                     // for (var i = 0; i < 3; i++)
//                     // {
//                     //     for (var j = 0; j < 3; j++)
//                     //     {
//                     //             // game.bigBoardLogic[i][j] = "open"
//                     //             // game.cursorSquares[i][j].alpha = .7 
        
//                     //             if (game.magicBoardLogic[i][j] === "magic")
//                     //                 game.cursorSquares[i][j].alpha = 0
//                     //     }
//                     // }
