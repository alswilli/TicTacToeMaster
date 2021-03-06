

console.log("In Game Page");

/*
 create the actual game object, 1st and 2nd args are dimensions
 third arg is rendering context, can be Phaser.CANVAS, Phaser.WEBGL, or Phaser.AUTO
 AUTO will automatically try to use webgl, but falls back in canvas if webgl is not supported on a browser
 fourth arg is the DOM element to place the game canvas in, body by default if left blank
 */
function startGame()
{
    var width = document.getElementById('gameDiv').offsetWidth
    var height = 700
    game = new Phaser.Game(width, height, Phaser.AUTO, 'gameDiv')
    game.screenWidth = width;
    game.screenHeight = height;


    console.log("In Game Page "+ app.gametype);

    //add all the different states to the game, these states are defined in all the
    //corresponding .js files, i.e loadState is in load.js
    game.state.add('load', loadState)
    game.state.add('menu', menuState)
    game.state.add('gameDif', gameDifficultyState)
    game.state.add('challengeFriend',challengeFriendState)
    game.state.add('win', winState)
    game.state.add('waitingRoom', waitingRoomState)

    game.firstPlay = true

    // Sets up gamestate for game when it gets loaded
    if(app.gameType == "original")
        game.state.add('ticTac', ticTacState)
    else if(app.gameType == "3d")
        game.state.add('ticTac', threeDticTacState)
    else if(app.gameType == "orderChaos")
        game.state.add('ticTac', orderChaosState)
    else if(app.gameType == "ultimate")
        game.state.add('ticTac', ultimateTTTState)
    else
        console.log("unknown gametype: ", game.gametype)

    game.optionCount = 0;

    // Contructor used to create menu options on game menu screen
    game.addMenuOption = function(text, startY, callback) {
        console.log("MAKE MENU")

        var optionStyle = { font: '30pt TheMinion', fill: 'white', align: 'left', stroke: 'rgba(0,0,0,0)', srokeThickness: 4};
        var txt = game.add.text(game.world.centerX, (game.optionCount * 80) + startY, text, optionStyle);
        txt.anchor.setTo(0.5);
        txt.stroke = "rgba(0,0,0,0)";
        txt.strokeThickness = 4;
        txt.key = 'text'
        var onOver = function (target) {
            target.fill = "#FEFFD5";
            target.stroke = "rgba(200,200,200,0.5)";
            txt.useHandCursor = true;
            playSound("hover");
        };
        var onOut = function (target) {
            target.fill = "white";
            target.stroke = "rgba(0,0,0,0)";
            txt.useHandCursor = false;
        };

        txt.inputEnabled = true;
        txt.events.onInputUp.add(callback, game);
        txt.events.onInputOver.add(onOver, game);
        txt.events.onInputOut.add(onOut, game);

        game.optionCount++;

    },


    //start the game
    game.state.start('load')
}

