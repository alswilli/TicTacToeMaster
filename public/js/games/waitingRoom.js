var waitingRoomState = {

    /*
     called to initialize this state
     */
    create() {
        //init the background image
        var background = game.add.sprite(game.world.centerX, game.world.centerY, 'background');
        background.anchor.set(0.5);
        background.width = game.screenWidth;
        background.height = 700;
        
        // display game name
        const gameName = game.add.text(
           game.world.centerX, 100, 'Opponent Disconnected!',
           { font: '50px Arial', fill: '#ffffff' }
        )
        //setting anchor centers the text on its x, y coordinates
        gameName.anchor.setTo(0.5, 0.5)
        game.firstPlay = true
        console.log("challengine: " + game.challengingFriend )
        if(game.challengingFriend)
        {
            Client.socket.emit('friendDenied', game.friend.username)
        }
        game.challengingFriend = false
        game.optionCount = 0;
        
        // Various waiting room menu options initialized below

        game.addMenuOption('Search For Another', 200, function () {
                    game.firstPlay = true
                    game.state.start("ticTac");
        });
        
        game.addMenuOption('Main Menu', 200, function () {
                    document.getElementById("chat-box").style.visibility = "hidden";
                    document.getElementById("open-box").style.visibility = "hidden";
                    Client.notifyQuit()
                    game.state.start("menu");
        });
        
    },



};
