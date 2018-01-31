/*
    The menu displayed before starting the game. Very simple right now, just displays
    the name of the game and prompts the player to click the screen to start
*/
var menuState = {
    /*
        called to initialize this state
    */
    create() {
        
        // display game name
        const gameName = game.add.text(
            game.world.centerX, 200, 'Tic Tac Toe',
            { font: '50px Arial', fill: '#ffffff' }
        )
        //setting anchor centers the text on its x, y coordinates 
        gameName.anchor.setTo(0.5, 0.5)

        // explain how to start the game
        const startGame = game.add.text(
            game.world.centerX, 250, 'click to start',
            { font: '20px Arial', fill: '#ffffff' }
        )
        startGame.anchor.setTo(0.5, 0.5)

        //add a callback/listener that responds to when the user clicks the screen.
        game.input.onDown.add(this.startGame, this)
    },
    
    /*
        callback that switches the state to the tictactoe game
    */
    startGame() {
        game.state.start('ticTac')
    }
};