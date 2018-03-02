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
        game.firstPlay = true
        game.optionCount = 0;
        
        game.addMenuOption('Search For Another', 200, function () {
                    game.firstPlay = true
                    game.state.start("ticTac");
        });
        
        game.addMenuOption('Main Menu', 200, function () {
                    document.getElementById("chat-box").style.visibility = "hidden";
                    Client.notifyQuit()
                    game.state.start("menu");
        });
        
    },



};
