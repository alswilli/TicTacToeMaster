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
                game.addSprite(element.x, element.y, element.key);
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

            game.optionCount = 0;
        game.addMenuOption('Play Again', 400, function () {
                           game.singleplayer = true
                           game.state.start("ticTac");
                           });
        game.addMenuOption('Main Menu', 400, function () {
                           game.singleplayer = false
                           game.state.start("menu");
                           });
    },
  
    /*
        restart the tictactoe game
    */
    startGame () {
        game.state.start('ticTac')
    }
}
