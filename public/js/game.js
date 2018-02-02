/*
create the actual game object, 1st and 2nd args are dimensions 
third arg is rendering context, can be Phaser.CANVAS, Phaser.WEBGL, or Phaser.AUTO
AUTO will automatically try to use webgl, but falls back in canvas if webgl is not supported on a browser
fourth arg is the DOM element to place the game canvas in, body by default if left blank
*/
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'gameDiv') 
//add all the different states to the game, these states are defined in all the 
//corresponding .js files, i.e loadState is in load.js
game.state.add('load', loadState)
game.state.add('menu', menuState)
game.state.add('ticTac', ticTacState)
game.state.add('win', winState)
game.state.add('waitingRoom', waitingRoomState)

game.optionCount = 0;
game.addMenuOption = function(text, callback) {
    var optionStyle = { font: '30pt TheMinion', fill: 'white', align: 'left', stroke: 'rgba(0,0,0,0)', srokeThickness: 4};
    var txt = game.add.text(game.world.centerX, (game.optionCount * 80) + 200, text, optionStyle);
    txt.anchor.setTo(0.5);
    txt.stroke = "rgba(0,0,0,0";
    txt.strokeThickness = 4;
    var onOver = function (target) {
        target.fill = "#FEFFD5";
        target.stroke = "rgba(200,200,200,0.5)";
        txt.useHandCursor = true;
    };
    var onOut = function (target) {
        target.fill = "white";
        target.stroke = "rgba(0,0,0,0)";
        txt.useHandCursor = false;
    };
    //txt.useHandCursor = true;
    txt.inputEnabled = true;
    txt.events.onInputUp.add(callback, game);
    txt.events.onInputOver.add(onOver, game);
    txt.events.onInputOut.add(onOut, game);
    
    game.optionCount ++;
    
    
},

//start the game
game.state.start('load')
