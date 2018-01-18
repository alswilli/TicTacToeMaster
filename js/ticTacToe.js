/*
    The actual meat of the game, this state contains all the logic for the tictactoe
    game.
*/
var ticTacState = {
    /*
        called every frame, we don't actually need this since the screen only changes
        when a player clicks, but we can keep it for when/if we add animations 
    */
    update() {
    },

    /*
        called when the game starts
    */
    create () {
        /****this.var adds a new "class variable" to this state, like in other languages****/
        
        this.squareSize = 115
        //the size of the board, i.e nxn board, 3x3 for tictactoe
        this.n = 3
        this.isXTurn = true
        this.isDraw = false
        this.turns = 0
        
        //the top left coordinate to place the whole board at, we will make this
        //not hardcoded in the furture to center the board, but I believe we need jQuery 
        //to get window size and I didn't feel like learning that right now
        this.startingX = 115
        this.startingY = 115
        
     
        //create an internal representation of the board as a 2D array
        game.board = this.makeBoardAsArray(this.n)
        //create the board on screen and makes each square clickable
        this.makeBoardOnScreen()
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
        creates the board on screen with clickable squares, this.n, game.board, and 
        this.startingCX and Y must be defined before calling this function
    */
    makeBoardOnScreen(){
        for (var i=0; i < this.n; i++) {
            for (var j=0; j < this.n; j ++) {
                //create square
                var square = this.addSprite(this.startingX + i*this.squareSize, this.startingY + j * this.squareSize, 'square');
                //allow square to respond to input
                square.inputEnabled = true
                //indices used for the 2D array
                square.xIndex = i
                square.yIndex = j
                //make have placePiece be called when a square is clicked 
                square.events.onInputDown.add(this.placePiece, this)
                
                //initialize 2D array boad to be empty strings
                game.board[i][j] = "";
            }
        }
    },

    /*
        places a piece on an empty square, either x or o depending whose turn it is
    */
    placePiece(sprite, pointer) {
        //the indexes in the 2D array corresponding to the clicked square
        var indexX = sprite.xIndex
        var indexY = sprite.yIndex
        
        //if the clicked square is not empty, i.e it has a value other than a blank
        //string, don't do anything
        if(game.board[indexY][indexX] != "")
            return
        //place either an x or o, depending whose turn it is
        if(this.isXTurn){
            this.addSprite(sprite.x, sprite.y, 'star');
            game.board[indexY][indexX] = "x"
        }
        else{
            this.addSprite(sprite.x, sprite.y, 'moon');
            game.board[indexY][indexX] = "o"
        }
        
        //if the game is over, siaply the winner
        if(this.checkIfOver(indexX, indexY))
             this.displayWinner()
        else {
            //switch to the next player's turn
            this.isXTurn = !this.isXTurn
        
            //check if the game ended in a draw
            this.turns++
            if(this.turns >= 9)
                this.displayDraw()
        }
        //for debugging
        this.printBoard();
        
    },
    
    /*
        adds a sprite to the screen and returns a reference to it, scales image down
        to half its size, we can change this later
    */
    addSprite(x, y, name) {
        var sprite = game.add.sprite(x, y, name);
        sprite.scale.setTo(0.5, 0.5);
        sprite.width = this.squareSize
        sprite.height = this.squareSize
        return sprite
    },

    /*
        prints 2D array board to console, used for debugging
    */
    printBoard(){
        for (var i=0; i < this.n; i++) {
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
        
        for (var y=0; y < this.n; y++){
            //check the possible horizontal and vertical wins for the given placement
            horizontal.add(game.board[row][y])
            vertical.add(game.board[y][col])
            //check the possible diagonal wins by checking the main diagonals
            posDiagonal.add(game.board[y][y])
            negDiagonal.add(game.board[this.n-1-y][y])
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
        game.winner = this.isXTurn ? 'x' : 'o'
        
        this.saveBoard()
        game.isDraw = false
        game.state.start('win')
    },
    
    /*
        switch the the winState, indicating that the game ended in a draw
    */
    displayDraw() {
        this.saveBoard()
        game.isDraw = true
        game.state.start('win')
    },
    
    /*
        save the ending board for this state, so that is can be displayed in the winState
    */
    saveBoard(){
        game.endingBoard = []
        game.world.forEach(function(item) {
            game.endingBoard.push(item)
        });
    }
};
