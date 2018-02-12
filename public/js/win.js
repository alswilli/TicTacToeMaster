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
        if(game.isDraw && game.gametype == "orderChaos")
        {
            console.log("Hiya")
            message = 'o' + ' wins! ' + 'o' + ' receives 50 gold coins!' //add sound and or animation here later for getting the money
            game.winner = 'o';
            //game.cash = game.cash + 50;
            console.log("Current cash amount: ", game.cash);
        }
        else
        {
            message = 'x' + ' wins! ' + 'x' + ' receives 50 gold coins!' //add sound and or animation here later for getting the money
            game.winner = 'x';
            if (game.singleplayer == true)
            {
                game.cash = game.cash + 50;
                console.log("Current cash amount: ", game.cash);
            }
            else 
            {
                console.log("Yeah");
                console.log(game.player);
                console.log(game.winner);
                if (game.player == game.winner)
                {
                    game.cash = game.cash + 50;
                    console.log("Current cash amount: ", game.cash);
                }   
            }
        }
                    
        
        // display win message
        const winMessage = game.add.text(
            game.world.centerX, 200, message,
            { font: '50px Arial', fill: '#ffffff' }
        )
        winMessage.anchor.setTo(0.5, 0.5)

        // explain how to reStart the game, we will add more options when we have more games
        game.optionCount = 0;
        game.addMenuOption('Play Again',  400, function () {
                           game.singleplayer = true
                           game.state.start("ticTac");
                           });
        game.addMenuOption('Return to TicTacToe Menu', 400, function () {
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
