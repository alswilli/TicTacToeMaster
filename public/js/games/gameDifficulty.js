var gameDifficultyState  = {

    create() {
        var title = "Select Difficulty"

        const gameDifficultyHeader = game.add.text(
            game.world.centerX, 100, title,
            { font: '50px Arial', fill: '#ffffff' }
        )

        gameDifficultyHeader.anchor.setTo(0.5, 0.5)
        
        game.optionCount = 0;

        game.addMenuOption('Easy', 200, function () {
            game.difficulty = 'easy'
            game.state.start("ticTac");
            });
        
        game.addMenuOption('Medium', 200, function () {
            game.difficulty = 'medium'
            game.state.start("ticTac");
            });

        game.addMenuOption('Hard', 200, function () {
            game.difficulty = 'hard'
            game.state.start("ticTac");
            });

        // If neither option, do the database logic with leaderboards, achievements, currency, etc. (we will add more to here later, thoughwill need to be in home page because href loads first)
        game.addMenuOption('Back to Menu Page', 200, function () {
            game.state.start("menu");
            // var dbRefObject = firebase.database().ref('/users/' + game.userkey + '/cash/');
            // console.log("Cash:", game.cash);
            // dbRefObject.set(
            //     game.cash
            // );
            // window.location.href = "mainMenu.html" + '#&&' + game.userkey + '&&' + game.username + '&&' + game.battleText + '&&' + game.cash + '&&' + game.url + '&&null';
        });
    //});        

    },
};