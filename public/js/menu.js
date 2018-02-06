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
            game.world.centerX, 100, 'Tic Tac Toe',
            { font: '50px Arial', fill: '#ffffff' }
        )
        //setting anchor centers the text on its x, y coordinates 
        gameName.anchor.setTo(0.5, 0.5)
        
        game.optionCount = 0;
        game.addMenuOption('SinglePlayer', 200, function () {
                           game.singleplayer = true
                           game.state.start("ticTac");
                           });
        game.addMenuOption('Multiplayer', 200,function () {
                           game.singleplayer = false
                           game.state.start("ticTac");
                           });

    },
    
};
