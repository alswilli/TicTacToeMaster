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
        game.singleplayer = false
        
        game.squareSize = 115
        //the size of the board, i.e nxn board, 3x3 for tictactoe
        game.n = 3
        game.isXTurn = true
        game.isDraw = false
        game.turns = 0
        
        //the top left coordinate to place the whole board at, we will make game
        //not hardcoded in the furture to center the board, but I believe we need jQuery
        //to get window size and I didn't feel like learning that right now
        game.startingX = 115
        game.startingY = 115
        
        game.waiting = true
        
        
        //record of the pieces that have been placed
        game.placedPieces = []
        
        
        game.makeBoardOnScreen = this.makeBoardOnScreen;
        game.addNewPlayer = this.addNewPlayer;
        game.switchTurn = this.switchTurn;
        game.placePiece = this.placePiece
        game.makeBoardAsArray = this.makeBoardAsArray
        game.addSprite = this.addSprite
        game.displayDraw = this.displayDraw
        game.displayWinner = this.displayWinner
        game.saveBoard = this.saveBoard
        game.checkIfOver = this.checkIfOver
        game.printBoard = this.printBoard
        game.updateBoard = this.updateBoard
        game.assignID = this.assignID
        game.assignRoom = this.assignRoom
        game.startMatch = this.startMatch
        game.synchronizeTurn = this.synchronizeTurn
        //create an internal representation of the board as a 2D array
        game.board = game.makeBoardAsArray(game.n)
        //create the board on screen and makes each square clickable
        game.makeBoardOnScreen()
        
        

        game.playerMap = []

        if(typeof game.firstPlay === 'undefined'){
            Client.makeNewPlayer();
            console.log("firstPlay!")
            game.firstPlay = false
        }
        
        else if(game.player === "x")
            game.waiting = false
        else if(game.player === "o")
            game.waiting = true
            
        console.log(game.player)
        
    },
    
    addNewPlayer(id, x, y){
        console.log("calling addNewPlayer from TicTac!")
        game.playerMap[id] = "yo" //game.add.sprite(x,y,'sprite');
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
    placePiece(sprite, pointer) {
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
            //place either an x or o, depending whose turn it is

        if(game.isXTurn){
            var piece = game.addSprite(sprite.x, sprite.y, 'star');
            game.placedPieces.push(piece);
            game.board[indexY][indexX] = "x"
        }
        else{
            var piece = game.addSprite(sprite.x, sprite.y, 'moon');
            game.placedPieces.push(piece);
            game.board[indexY][indexX] = "o"
            
        }
        

 
        
        //if the game is over, siaply the winner
        if(game.singleplayer && game.checkIfOver(indexX, indexY))
        {
            game.displayWinner()
        }
        else {
            //switch to the next player's turn
            if(game.singleplayer)
                game.switchTurn()
            else
                game.waiting = true;
            
        }
        
        //for debugging
        game.printBoard();
        if(game.turns >= 9)
            game.displayDraw()
        else{
            console.log(game.board)
            Client.sendClick(game.board, indexX, indexY);
        }
        
        
    },
    
    
    switchTurn(){
        console.log("switching current turn")
        game.isXTurn = !game.isXTurn
        game.turns++
    },
    
    synchronizeTurn(id, x, y){
        if( game.id === id)
            game.waiting = true
        else
            game.waiting = false
        if(game.checkIfOver(x, y))
            game.displayWinner()
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
    checkIfOver(col, row){
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
        if(horizontal.size === 1){
            console.log("GameOver! h")
            gameOver = true
        }
        
        if(vertical.size === 1){
            console.log("GameOver! v")
            gameOver = true
        }
        //if all entries in a diagonal are the same AND that entry is not blank,
        //then the game is over
        if(posDiagonal.size === 1 && !posDiagonal.has("")){
            console.log("GameOver! pD")
            gameOver = true
        }
        if(negDiagonal.size === 1 && !negDiagonal.has("")) {
            console.log("GameOver! nD")
            gameOver = true
        }
        
        return gameOver
        
    },
    
    /*
     switch the the winState, indicating who the winner is
     */
    displayWinner() {
        game.winner = game.isXTurn ? 'x' : 'o'
        
        game.saveBoard()
        game.isDraw = false
        game.state.start('win')
    },
    
    /*
     switch to the winState, indicating that the game ended in a draw
     */
    displayDraw() {
        game.saveBoard()
        game.isDraw = true
        game.state.start('win')
    },
    
    /*
     save the ending board for game state, so that is can be displayed in the winState
     */
    saveBoard(){
        game.endingBoard = []
        game.world.forEach(function(item) {
                           game.endingBoard.push(item)
        });
    },
    
    updateBoard(id, board){
        if(game.state.current==="win")
            return
        game.board = board
        console.log(board)
        
        //rub out pieces, so we don;t draw multiple on top of each other
        /*for(var i in game.placedPieces) {
            game.placedPieces[i].kill();
            game.placedPieces.splice(i, 1);
        }*/
        console.log(game.placedPieces)
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
    
    startMatch(id){
        console.log("does my id, " + game.id + " match the id " + id)
        if( game.id === id){
            game.waiting = true
            game.player = "o"
        }
        else{
            game.waiting = false
            console.log("no longer waiting!")
            game.player = "x"
        }
        
        console.log(game.player)
        
    }
};
