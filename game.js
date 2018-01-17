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

//start the game
game.state.start('load')