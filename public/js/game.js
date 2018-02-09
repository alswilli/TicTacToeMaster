// // Initialize Firebase
// var config = {
//     apiKey: "AIzaSyARQqkwmw-yDfR4Fl7eyDSs464kPyDTWpo",
//     authDomain: "tictactoemaster-b46ab.firebaseapp.com",
//     databaseURL: "https://tictactoemaster-b46ab.firebaseio.com",
//     projectId: "tictactoemaster-b46ab",
//     storageBucket: "tictactoemaster-b46ab.appspot.com",
//     messagingSenderId: "1050901435462"
// };
// firebase.initializeApp(config);

console.log("In Game Page");

var keyValue;
var nameOfUser;
var battleText;
var cashMoney;
var url;
var gametype;

var argumentVals = window.location.hash.split('&&');
console.log(argumentVals);

keyValue = argumentVals[1]; 
console.log(keyValue);
nameOfUser = argumentVals[2];
console.log(nameOfUser);
battleText = argumentVals[3];
console.log(battleText);
cashMoney = argumentVals[4];
console.log(cashMoney);
url = argumentVals[5];
console.log(url);
gametype = argumentVals[6]


/*
create the actual game object, 1st and 2nd args are dimensions 
third arg is rendering context, can be Phaser.CANVAS, Phaser.WEBGL, or Phaser.AUTO
AUTO will automatically try to use webgl, but falls back in canvas if webgl is not supported on a browser
fourth arg is the DOM element to place the game canvas in, body by default if left blank
*/
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'gameDiv') 

game.userkey = keyValue;
game.username = nameOfUser;
game.battleText = battleText;
game.cash = parseInt(cashMoney);
game.url = url;
game.gametype = gametype;

console.log("In Game Page "+ game.username);

//add all the different states to the game, these states are defined in all the 
//corresponding .js files, i.e loadState is in load.js
game.state.add('load', loadState)
game.state.add('menu', menuState)

game.state.add('win', winState)
game.state.add('waitingRoom', waitingRoomState)
if(gametype == "original")
    game.state.add('ticTac', ticTacState)
else if(gametype == "3d")
    game.state.add('ticTac', threeDticTacState)
else
    console.log("unkown gametype")

game.optionCount = 0;
game.addMenuOption = function(text, startY, callback) {
    var optionStyle = { font: '30pt TheMinion', fill: 'white', align: 'left', stroke: 'rgba(0,0,0,0)', srokeThickness: 4};
    var txt = game.add.text(game.world.centerX, (game.optionCount * 80) + startY, text, optionStyle);
    txt.anchor.setTo(0.5);
    txt.stroke = "rgba(0,0,0,0)";
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
