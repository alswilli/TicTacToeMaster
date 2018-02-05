var waitingRoomState = {

    /*
     called to initialize this state
     */
    create() {
        
        // display game name
        const gameName = game.add.text(
           game.world.centerX, 100, 'Opponent Disconnected!',
           { font: '50px Arial', fill: '#ffffff' }
        )
        //setting anchor centers the text on its x, y coordinates
        gameName.anchor.setTo(0.5, 0.5)
        
        game.optionCount = 0;
        game.addMenuOption('Search For Another', function () {
           game.singleplayer = false
           game.state.start("ticTac");
        });
        
        game.addMenuOption('Main Menu', function () {
           game.state.start("menu");
        });
        
    },



};
