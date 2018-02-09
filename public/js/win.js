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
        var submessage = ""
        //display that the game ended in a draw or display the winner
        if(game.isDraw)
        {
            message = "Draw... Both receive 25 gold coins." //add sound and or animation here later for getting the money
            game.cash = game.cash + 25;
            console.log("Current cash amount: ", game.cash);
        }
        else
        {
            message = game.winner + ' wins! '// + game.winner //+ ' receives 50 gold coins!' //add sound and or animation here later for getting the money
            submessage = game.winner + ' receives 50 gold coins!'
            if (game.singleplayer == true)
            {
                game.cash = game.cash + 50;
                console.log("Current cash amount: ", game.cash);
            }
            else //not working yet, game.player is null?
            {
                console.log("Yeah");
                console.log(game.player);
                console.log(game.winner);
                //*****Here is where we check if someboday won in multiplayer*****//
                if (game.username == game.winner)
                {
                    //game.userkey can be used to update firebase shtuff
                    game.cash = game.cash + 50;
                    console.log("Current cash amount: ", game.cash);
                }
                else
                {
                    console.log("You lose");
                }
            }
        }
                    
        
        // display win message
        const winMessage = game.add.text(
            game.world.centerX, 200, message,
            { font: '35px Arial', fill: '#ffffff' }
        )
        winMessage.anchor.setTo(0.5, 0.5)
        //make sure everythiong fits on screen by displaying seoncd line of message at lower y coordinate
        if(submessage != "")
        {
            const subWinMessage = game.add.text(
                    game.world.centerX, 250, submessage,
                    { font: '35px Arial', fill: '#ffffff' }
            )
            subWinMessage.anchor.setTo(0.5, 0.5)
        }

        // explain how to reStart the game, we will add more options when we have more games
        game.optionCount = 0;
        game.addMenuOption('Play Again',  400, function () {
                           //game.singleplayer = true
                           game.state.start("ticTac");
                           });
        game.addMenuOption('Return to TicTacToe Menu', 400, function () {
                           //game.singleplayer = false
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
