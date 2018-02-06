// Initialize Firebase
var config = {
    apiKey: "AIzaSyARQqkwmw-yDfR4Fl7eyDSs464kPyDTWpo",
    authDomain: "tictactoemaster-b46ab.firebaseapp.com",
    databaseURL: "https://tictactoemaster-b46ab.firebaseio.com",
    projectId: "tictactoemaster-b46ab",
    storageBucket: "tictactoemaster-b46ab.appspot.com",
    messagingSenderId: "1050901435462"
};
firebase.initializeApp(config);

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
        // If neither option, do the database logic with leaderboards, achievements, currency, etc. (we will add more to here later, thoughwill need to be in home page because href loads first)
        game.addMenuOption('Exit to Home Page', 200, function () {

            // var dbRefObject = firebase.database().ref('/users/' + game.userkey + '/cash/');
            // console.log("Cash:", game.cash);
            // dbRefObject.set(
            //     game.cash
            // );
            window.location.href = "mainMenu.html" + '#&&' + game.userkey + '&&' + game.username + '&&' + game.battleText + '&&' + game.cash + '&&' + game.url + '&&null';
        });
    //});        

    },
    
};
