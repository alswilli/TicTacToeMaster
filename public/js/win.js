/*
    State that is displayed when the game is over
*/
const winState = {
    create () {

        /*
            draw the ending board, creating a new state wipes every image from the previous
            state, so we have to save what the board looked like when the game ended so 
            it can be displayed in this winState
        */
        game.endingBoard.forEach(function(element) {
            if(element.key != 'text')
                ticTacState.addSprite(element.x, element.y, element.key);
        });
    
        var message
        //display that the game ended in a draw or display the winner
        if(game.isDraw)
            message = "Draw ..."
        else
            message = game.winner + ' wins!'
        
        // display win message
        const winMessage = game.add.text(
            game.world.centerX, 200, message,
            { font: '50px Arial', fill: '#ffffff' }
        )
        winMessage.anchor.setTo(0.5, 0.5)

        // explain how to reStart the game, we will add more options when we have more games
        const startGameText = game.add.text(
            game.world.centerX, 250, 'click to play again',
            { font: '20px Arial', fill: '#ffffff' }
        )
        startGameText.anchor.setTo(0.5, 0.5)

        //restart game on click
        game.input.onDown.add(this.startGame, this)
    },
  
    /*
        restart the tictactoe game
    */
    startGame () {
        game.state.start('ticTac')
    }
}
