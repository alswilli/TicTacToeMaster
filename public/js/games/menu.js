// Initialize Firebase
/*var config = {
    apiKey: "AIzaSyARQqkwmw-yDfR4Fl7eyDSs464kPyDTWpo",
    authDomain: "tictactoemaster-b46ab.firebaseapp.com",
    databaseURL: "https://tictactoemaster-b46ab.firebaseio.com",
    projectId: "tictactoemaster-b46ab",
    storageBucket: "tictactoemaster-b46ab.appspot.com",
    messagingSenderId: "1050901435462"
};
firebase.initializeApp(config);*/

/*
    The menu displayed before starting the game. Very simple right now, just displays
    the name of the game and prompts the player to click the screen to start
*/
var menuState = {
    /*
        called to initialize this state
    */
    create() {

        document.getElementById("chat-box").style.visibility = "hidden";
        document.getElementById("open-box").style.visibility = "hidden";
        console.log("IN MENU")
        //setup background
        var background = game.add.sprite(game.world.centerX, game.world.centerY, 'menubackground');
        background.anchor.set(0.5);
        background.width = game.screenWidth;
        background.height = 700;

        var title
        if(game.gametype === "original")
            title = 'Tic Tac Toe'
        else if(game.gametype === "3d")
            title = '3D Tic Tac Toe'
        else if(game.gametype === "orderChaos")
            title = 'Order and Chaos'
        else if(game.gametype === "ultimate")
            title = 'Ultimate Tic Tac Toe'
        // display game name
        const gameName = game.add.text(
            game.world.centerX, 100, title,
            { font: '50px Arial', fill: '#ffffff' }
        )
        //setting anchor centers the text on its x, y coordinates 
        gameName.anchor.setTo(0.5, 0.5)
        
        game.optionCount = 0;
       
        if (game.gametype == "original") {
           game.addMenuOption('SinglePlayer', 200, function () {
                           game.singleplayer = true;
                           game.vsAi = true;
                        //    game.state.start("ticTac");
                           game.state.start("gameDif"); 
                           });
        }

        game.vs3DAi = false

        // if (game.gametype == "3d") {
        //     game.addMenuOption('SinglePlayer', 200, function () {
        //                     game.singleplayer = true;
        //                     game.vs3DAi = true;
        //                  //    game.state.start("ticTac");
        //                     game.state.start("gameDif"); 
        //                     });
        //  }
        game.addMenuOption('Local Multiplayer', 200, function () {
                           game.singleplayer = true
                           game.vsAi = false;
                           game.state.start("ticTac");
                           });
        game.addMenuOption('Online Multiplayer', 200,function () {
                            document.getElementById("chat-box").style.visibility = "visible";
                            document.getElementById("open-box").style.visibility = "visible";
                           game.singleplayer = false
                           game.vsAi = false;
                           game.state.start("ticTac");
                           });
        game.addMenuOption('Challenge Friend', 200,function () {
                           document.getElementById("chat-box").style.visibility = "visible";
                           document.getElementById("open-box").style.visibility = "visible";
                           game.singleplayer = false
                           game.vsAi = false;
                           game.state.start("challengeFriend");
                           });
        // If neither option, do the database logic with leaderboards, achievements, currency, etc. (we will add more to here later, thoughwill need to be in home page because href loads first)
        game.addMenuOption('Exit to Home Page', 250, function () {

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
