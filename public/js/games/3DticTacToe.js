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
    

    /*
     called when the game starts
     */
    create () {
        /****game.var adds a new "class variable" to game state, like in other languages****/
        var background = game.add.sprite(game.world.centerX, game.world.centerY, 'background');
        background.anchor.set(0.5);
        background.width = game.screenWidth;
        background.height = 700;
        
        game.boardHeight = game.cache.getImage('square').height * 4
        game.boardOffset = 15
        game.pieceWidth = 50
        game.pieceHeight = 50
        game.squareSize = 50
        game.boardHeightScaled = game.squareSize * 4 * 0.6
        //the size of the board, i.e nxn board, 3x3 for tictactoe
        game.n = 4
        game.isXTurn = true
        game.isDraw = false
        game.turns = 0
        
        //the top left coordinate to place the whole board at, we will make game
        //not hardcoded in the furture to center the board, but I believe we need jQuery
        //to get window size and I didn't feel like learning that right now
        game.startingX = game.screenWidth/2 - game.cache.getImage('board').width / 2
        game.startingY = 80
        //intialize waiting status to false, update accordingly later if multiplayer
        game.waiting = false
        
        //record of the pieces that have been placed
        game.placedPieces = []
        
        //asign functions ot the game object, so they can be called by the client
        this.assignFunctions()
        
        game.cursorSquares = game.makeBoardAsArray(game.n)
        game.makeBoardOnScreenBetter('redsquare', 0)
        
        game.winningSquares = game.makeBoardAsArray(game.n)

        //create an internal representation of the board as a 2D array
        game.board = game.makeBoardAsArray(game.n)
        
        console.log(game.board)
        //create the board on screen and makes each square clickable
        game.makeBoardOnScreenBetter('square', 1)
        //add messages that display turn status, connection statuses
        this.addTexts()
        
                
        //folloowing logic is for multiplayer games
        if(game.singleplayer)
            return
            
        game.previousPiece = ""
        //if this is the first play against an opponent, create a new player on the server
        if(game.firstPlay === true)
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
     returns nxn 3D array
     */
    makeBoardAsArray(n)
    {
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
     game.startingX and Y must be defined before calling game function
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
        }
    },
    
    /*
     creates the board on the screen using individual squares, rather than four entire board sprites,
     so now each square will have its own callback function. Will make adding custom tiles easier
     */
    makeBoardOnScreenBetter(name, alpha)
    {
        var xScale = 0.9;
        var yScale = 0.6;
        game.spriteSquares = game.makeBoardAsArray(game.n)
        for (var i=0; i < game.n; i++)
        {
            var adjustmentY = game.startingY + (i * (game.boardHeight + game.boardOffset) * 0.6)
            for (var j=0; j < game.n; j++)
            {
                for (var k=0; k < game.n; k++)
                {
                    indexX = j
                    indexY = k
                    //convert the indexes to actual coordinates on the screen
                    var sheared = game.convertToShearCoords(indexX * game.pieceWidth, indexY * game.pieceHeight)
                    //adjust the x and y values to where they should appear on the screen, this number seems to
                    //adjust tiles well
                    var width = 32
                    var worldX = game.startingX + sheared[1] * xScale + (j * width * xScale/2)
                    var worldY = sheared[0] + adjustmentY
                    //87 X 50 is the dimension of the image, hardcoded so when we add future custom tiles
                    //they will also fit the screen
                    var square = game.addSpriteWithWidth(worldX, worldY, name, 87, 50);
                    square.alpha = alpha
                    //adjust coordinates after scaling so there are no gaps between tiles
                    game.adjustForScale(square, xScale, yScale, k, j)
                    game.addPolygonBounds(square, xScale, yScale)
                    //enable input in game, don't if this is being called in winState
                    if(game.state.current==="ticTac" && name === 'square')
                    {
                        square.inputEnabled = true
                        square.events.onInputDown.add(game.placePiece, game)
                    }
                    square.indexX = indexX
                    square.indexY = indexY
                    square.key = name
                    square.boardNum = i
                    if(name === 'square')
                        game.spriteSquares[i][j][k] = square
                    else if(name === 'redsquare')
                        game.cursorSquares[i][j][k] = square
                    else if(name === 'greensquare')
                    {
                        if(game.winningSquares[i][j][k] != "")
                            square.alpha = 0.7
                    }
                }
            }
        }
        
        

    },
    
    /*
        After scaling an image, move its x and y coordinates accordingly so tiles still are next to each 
        other without any gaps
     */
    adjustForScale(square, xScale, yScale, k, j)
    {
        //not sure why but this number seems to make squares adjust perfectly
        var height = 32
        var width = 32 
        square.scale.setTo(xScale, yScale);
        //add 0.01 to adjust for nonoverlapping tiles
        square.y -=  k * height * (yScale + 0.01)
        square.x -=  j * width * xScale/2
    },
    
    /*
        Every square is given bounds to check if a click on a sprite is actually inside of the square
     */
    addPolygonBounds(square, xScale, yScale)
    {
        var topLeft = new Phaser.Point((37 * xScale) + square.x, square.y)
        var topRight = new Phaser.Point(square.x + square.width, square.y)
        var bottomRight = new Phaser.Point((51 * xScale) + square.x, square.y + square.height)
        var bottomLeft = new Phaser.Point(square.x, square.y + square.height)
        square.poly = new Phaser.Polygon([ topLeft, topRight, bottomRight, bottomLeft ]);
        square.poly.topLeft = topLeft.x
    },
    
    /*
        Checks if the square to the left of a sprite is clicked, since images overlap now 
     */
    checkAdjacentShears(sprite, pointer)
    {
        if(pointer.worldX < sprite.poly.topLeft)
        {
            //make sure this isn't a corner square
            if(sprite.indexX > 0)
            {
                var indexX = sprite.indexX
                var indexY = sprite.indexY
                var boardNum = sprite.boardNum
                var leftSquare = game.spriteSquares[boardNum][indexX-1][indexY]
                game.placePieceNoPointer(leftSquare)
            }
        }
    },
    
    /*
        places a piece on an empty square, either x or o depending whose turn it is, given a pointer9i.e mouse click)
     */
    placePiece(sprite, pointer)
    {
        //if we are waiting for the opponent, do nothing on click
        if(game.waiting)
            return
        if(game.multiplayer && game.checkForDoubleClick())
            return
        if(sprite.poly.contains(pointer.worldX, pointer.worldY))
            game.placePieceNoPointer(sprite)
        else
            game.checkAdjacentShears(sprite, pointer)
        
    },
     /*
        called when a mouse click has been verified to actually be on a square
      */
    placePieceNoPointer(sprite)
    {
       var indexX = sprite.indexX
       var indexY = sprite.indexY
       var boardNum = sprite.boardNum
       if(game.board[boardNum][indexY][indexX] != "")
            return 
           
       var Ypadding = 3
       var Xpadding = 15
       if(game.isXTurn)
       {
           var piece = game.addSprite(sprite.x + Xpadding, sprite.y + Ypadding, 'X');
           game.board[boardNum][indexY][indexX] = "x"
           game.previousPiece = "x"
       }
       else
       {
           var piece = game.addSprite(sprite.x + Xpadding, sprite.y + Ypadding, 'O');
           game.board[boardNum][indexY][indexX] = "o"
           game.previousPiece = "o"
       }
       game.updateTurnStatus(boardNum, indexX, indexY, sprite.x, sprite.y)
    },

    
    
    /*
     switch current turn, and display whose turn it is
     */
    switchTurn(boardNum, indexX, indexY){
        console.log("switching current turn")
        game.isXTurn = !game.isXTurn
        game.turns++
        game.updateHilightedSquare(boardNum, indexX, indexY)
        var turn = game.isXTurn ? "x" : "o"
        if(game.singleplayer)
            game.turnStatusText.setText("Current Turn: " + turn.toUpperCase())
        else if(game.player === turn)
            game.turnStatusText.setText("Your Turn")
        else
            game.turnStatusText.setText(game.opponent + "'s turn")
    },
    
    updateHilightedSquare(boardNum, x, y)
    {
        for(var i = 0; i < game.n; i++)
        {
            for (var j = 0; j < game.n; j++)
            {
                for (var k = 0; k < game.n;k++)
                {
                    //Normal functionality, just assign one open spot
                    if(i == boardNum && j == x && k == y)
                    {
                        console.log("i: ", i)
                        console.log("j: ", j)
                        console.log("x: ", x)
                        console.log("y: ", y)
                        game.cursorSquares[i][j][k].alpha = .7
                        // game.cursorSquares[i][j].tint = 0xffffff
                    }
                    else
                    {
                        game.cursorSquares[i][j][k].alpha = 0
                    }
                }
            }
        }
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
        if(game.isOver(coordInfo.boardNum, coordInfo.x, coordInfo.y))
            game.displayWinner()
        game.switchTurn(coordInfo.boardNum, coordInfo.x, coordInfo.y)
    },
    
    /*
     adds a sprite to the screen and returns a reference to it, scales image down
     to half its size, we can change game later
     */
    addSprite(x, y, name) {
        var sprite = game.add.sprite(x, y, name);
        
        var width = game.cache.getImage(name).width
        var height = game.cache.getImage(name).height
        sprite.width = width 
        sprite.height = height 
        //sprite.scale.setTo(0.75, 0.75);
        //sprite.x -= width * 1.75
        //sprite.y -= height * 1.75
        return sprite
    },
    
    /*
     adds a sprite to the screen and returns a reference to it, scales image down
     to half its size, we can change game later
     */
    addSpriteWithWidth(x, y, name, width, height)
    {
        var sprite = game.add.sprite(x, y, name);
        //sprite.scale.setTo(0.75, 0.75);
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
    
    addWinningSquares(winningSquares)
    {
        
        winningSquares.forEach(function(winningSquare)
        {
               var i = winningSquare[0]
               var k = winningSquare[1]
               var j = winningSquare[2]
               game.winningSquares[i][j][k] = true
        });
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
        var horCoords = []
        var vertical = new Set()
        var vertCoords = []
        
        var posDiagonal = new Set()
        var posCoords = []
        var negDiagonal = new Set()
        var negCoords = []
        
        for (var y=0; y < game.n; y++){
            //check the possible horizontal and vertical wins for the given placement
            horizontal.add(game.board[num][row][y])
            horCoords.push([num, row, y])
            vertical.add(game.board[num][y][col])
            vertCoords.push([num, y, col])
            //check the possible diagonal wins by checking the main diagonals
            posDiagonal.add(game.board[num][y][y])
            posCoords.push([num, y, y])
            negDiagonal.add(game.board[num][game.n-1-y][y])
            negCoords.push([num, game.n-1-y, y])
        }
        var gameOver = false;
        console.log(horCoords)
        //if all entries in a row or column are the same, then the game is over
        //we don't need to check that the only entry is not a blank string, since
        //these Sets will include the piece that was just placed, which cannot possibly be blank
        if(horizontal.size === 1)
        {
            gameOver = true
            game.isDraw = false
            game.addWinningSquares(horCoords)
        }
        if(vertical.size === 1)
        {
            gameOver = true
            game.isDraw = false
            game.addWinningSquares(vertCoords)
        }
        //if all entries in a diagonal are the same AND that entry is not blank,
        //then the game is over
        if(posDiagonal.size === 1 && !posDiagonal.has(""))
        {
            gameOver = true
            game.isDraw = false
            game.addWinningSquares(posCoords)
        }
        if(negDiagonal.size === 1 && !negDiagonal.has(""))
        {
            gameOver = true
            game.isDraw = false
            game.addWinningSquares(negCoords)
        }
        //check 3D game ending conditions
        if(game.checkIfOver3D(num, col, row))
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
        var gameOver = false
        if(game.checkIfVertical3D(col, row))
            gameOver = true
        if(game.checkLocalDiagonals3D(board, col, row))
            gameOver =  true
        if(game.checkMainDiagonals3D(board, col, row))
            gameOver = true
        console.log("CHECKIFOVER3D: " + gameOver)
        return gameOver
    },
    
    /*
        Check all the pieces along the vertical of where the piece was placed
     */
    checkIfVertical3D(col, row)
    {
        var vertical = new Set()
        var vertCoords = []
        for(var i = 0; i < game.board.length; i++)
        {
            vertical.add(game.board[i][row][col])
            vertCoords.push([i, row, col])
        }
        
        var gameOver = false
        if(vertical.size === 1)
        {
            game.addWinningSquares(vertCoords)
            gameOver = true
        }
        return gameOver
    },
    
    /*
        Check diagonals local to the placed piece
     */
    checkLocalDiagonals3D(board, fixedCol, fixedRow)
    {
        var positiveHorizontal = new Set()
        var posHorCoords = []
        var negativeHorizontal = new Set()
        var negHorCoords = []
        var positiveVertical= new Set()
        var posVertCoords = []
        var negativeVertical= new Set()
        var negVertCoords = []
        
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
                negHorCoords.push([k, fixedRow, col])
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
                posHorCoords.push([k, fixedRow, col])
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
                posVertCoords.push([k, row, fixedCol])
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
                negVertCoords.push([k, row, fixedCol])
            }
        }
    
        var gameOver = false
        if(negativeHorizontal.size === 1)
        {
            gameOver = true
            game.addWinningSquares(negHorCoords)
            console.log("neg horizontal, game ovah!")
        }
        if(positiveHorizontal.size === 1)
        {
            gameOver = true
            game.addWinningSquares(posHorCoords)
            console.log("pos horizontal, game ovah!")
        }
        if(positiveVertical.size === 1)
        {
            gameOver = true
            game.addWinningSquares(posVertCoords)
            console.log("pos vertical, game ovah!")
        }
        if(negativeVertical.size === 1)
        {
            gameOver = true
            game.addWinningSquares(negVertCoords)
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
        var topLeftCoords = []
        var mainTopRight= new Set()
        var topRightCoords = []
        var mainBottomLeft= new Set()
        var bottomLeftCoords = []
        var mainBottomRight= new Set()
        var bottomRightCoords = []
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
                topLeftCoords.push([k, row, col])
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
                topRightCoords.push([k, row, col])
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
                bottomLeftCoords.push([k, row, col])
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
                bottomRightCoords.push([k, row, col])
            }
        }
        var gameOver = false
        if(mainTopLeft.size === 1)
        {
            gameOver = true
            game.addWinningSquares(topLeftCoords)
            console.log("mainTopLeft, game ovah!")
        }
        if(mainTopRight.size === 1)
        {
            gameOver = true
            game.addWinningSquares(topRightCoords)
            console.log("mainTopRight, game ovah!")
        }
        if(mainBottomLeft.size === 1)
        {
            gameOver = true
            game.addWinningSquares(bottomLeftCoords)
            console.log("mainBottomLeft, game ovah!")
        }
        if(mainBottomRight.size === 1)
        {
            gameOver = true
            game.addWinningSquares(bottomRightCoords)
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
                           console.log(item.key)
                           });
    },
    
    /*
     Update the board, given a 2D array of the board. Used to update boards between two players
     */
    updateBoard(board, id, coordInfo)
    {
        if(game.state.current==="win")
            return
        if(game.id === id)
            return
            //updated the game board
        game.board = board
        console.log(board)
        
        var boardNum = coordInfo.boardNum
        var x = coordInfo.worldX
        var y = coordInfo.worldY

        var Ypadding = 3
        var Xpadding = 15   
        if(game.isXTurn)
        {
            game.addSprite(x + Xpadding, y + Ypadding, 'X');
        }
        else
        {
            game.addSprite(x + Xpadding, y + Ypadding, 'O');
        }
    },
    
    convertIndexesToCoords(boardNum, indexX, indexY)
    {
        var adjustmentY = game.startingY + (boardNum * (game.boardHeight + game.boardOffset))
        //convert the indexes to actual coordinates on the screen
        var sheared = game.convertToShearCoords(indexX * game.pieceWidth, indexY * game.pieceHeight)
        //get width of images to adjust placements
        var width = game.cache.getImage('X').width
        //adjust the x and y values to where they should appear on the screen
        var worldX = game.startingX + sheared[1] - width/2
        var worldY = sheared[0] + adjustmentY
        console.log(worldX + ", " + worldY)
        return[worldX, worldY]
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
            game.turnStatusText.setText("Your Turn")
            game.opponentKey = data.userkey
        }
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
                                             game.world.centerX, game.screenHeight-50, '',
                                             { font: '50px Arial', fill: '#ffffff' }
                                             )
        //setting anchor centers the text on its x, y coordinates
        game.playerPieceText .anchor.setTo(0.5, 0.5)
        game.playerPieceText.key = 'text'
        
        
        
    },
    
    /*
     Update the status of the current turn player
     */
    updateTurnStatus(boardNum, indexX, indexY, worldX, worldY)
    {
        if(game.singleplayer)
        {
            //if single player, check if game ended right after placing a piece
            if(game.isOver(boardNum, indexX, indexY))
                game.displayWinner()
            else
                game.switchTurn(boardNum, indexX, indexY)
        }
        //if multiplayer, set waiting to true so that you can't place two pieces in one turn
        else
        {
            game.waiting = true;
            //send updated board to the server so the opponent's board is updated too
            var data = {board:game.board, boardNum:boardNum, worldX:worldX, worldY:worldY, x:indexX, y:indexY, id:game.id};
            Client.sendClick(data);
        }
        
        //for debugging
        game.printBoard();
    },
    

    
    convertToIndexes(point)
    {
        var height = game.cache.getImage('board').height
        var zpoint = [[point[0], height -  point[1]]]
        var shear = [[1, 0],
                     [-0.75, 1] //1.15
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
                     [0.75, 1] //1.15
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
        called in winstate to redisplay the board
     */
    rescaleSprites()
    {
        game.makeBoardOnScreenBetter('square', 1)
        game.makeBoardOnScreenBetter('greensquare', 0)
        game.endingBoard.forEach(function(element) {
            if(element.key != 'text' && element.key != 'square' && element.key != 'redsquare' && element.key != 'background')
                  game.addSprite(element.x, element.y, element.key);
        });
    },
    
    
    
    
    /*
     asign functions ot the game object, so they can be called by the client
     technically this is a state object, so the functions in this file are not
     automatically assigned to the game object.
     */
    assignFunctions()
    {
        game.makeBoardOnScreen = this.makeBoardOnScreen;
        game.makeBoardOnScreenBetter = this.makeBoardOnScreenBetter;
        game.switchTurn = this.switchTurn;
        game.placePiece = this.placePiece
        game.makeBoardAsArray = this.makeBoardAsArray
        game.addSprite = this.addSprite
        game.addSpriteWithWidth = this.addSpriteWithWidth
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
        game.convertIndexesToCoords = this.convertIndexesToCoords
        game.adjustForScale = this.adjustForScale
        game.addPolygonBounds = this.addPolygonBounds
        game.placePieceNoPointer = this.placePieceNoPointer
        game.rescaleSprites = this.rescaleSprites
        game.checkAdjacentShears = this.checkAdjacentShears
        game.updateHilightedSquare = this.updateHilightedSquare
        game.addWinningSquares = this.addWinningSquares
    }
    
};
