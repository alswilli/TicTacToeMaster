/*
    State that is displayed when the game is over
*/
var challengesRef;
var leaderboardRef;
//var userRef;
console.log("define winstate")
var winState = {
    create () {
        
        /*
         draw the ending board, creating a new state wipes every image from the previous
         state, so we have to save what the board looked like when the game ended so 
         it can be displayed in this winState
         */
        //setup background
        var background = game.add.sprite(game.world.centerX, game.world.centerY, 'background');
        background.anchor.set(0.5);
        background.width = game.screenWidth;
        background.height = 700;
        if(app.gameType == "3d" || app.gameType === "ultimate")
            game.rescaleSprites()
        else if(app.gameType == "original" || app.gameType == "orderChaos")
            game.showSprites()
        else
        {
            game.endingBoard.forEach(function(element) {
                                     if(element.key != 'text' && element.key != 'redsquare')
                                     game.addSprite(element.x, element.y, element.key);
                                     });
            }
		
			
        var message
        var submessage = ""
        //display that the game ended in a draw or display the winner
        if(game.isDraw && game.gametype != "orderChaos")
        {
            console.log("Hiya")
            message = 'Draw, both players' + ' receive 25 gold coins!' //add sound and or animation here later for getting the money
            //game.winner = 'o';
            game.cash = game.cash + 25;
            console.log("Current cash amount: ", game.cash);
            if (game.userkey != null) {
                if (game.singleplayer == true) {
                    updateChallenges(game.userkey, "Draw", "Offline");
                } else {
                    updateChallenges(game.userkey, "Draw", "Online");
                    updateLeaderboard(game.userkey, "draw");
                }
            } else {
                console("USER IS NULL");
            }
            
        }
        else
        {
            if (game.forfeit) {
                message = game.winner + ' wins via opponent forfeiting! '// + game.winner //+ ' receives 50 gold coins!' //add sound and or animation here later for getting the money
                submessage = game.winner + ' receives 50 gold coins!'
            }
            else {
                message = game.winner + ' wins! '// + game.winner //+ ' receives 50 gold coins!' //add sound and or animation here later for getting the money
                submessage = game.winner + ' receives 50 gold coins!'
            }
            
            
            if (game.singleplayer == true)
            {
                game.cash = game.cash + 50;
                console.log("Current cash amount: ", game.cash);
                console.log("game.player:", game.player);
                console.log("game.userkey", game.userkey);
                console.log("game.username", game.username);
                updateChallenges(game.userkey, "idk", "Offline");
            }
            else 
            {
                console.log("Yeah");
                console.log(game.player);
                console.log(game.winner);
                
                //*****Here is where we check if someboday won in multiplayer*****//
                if (game.username === game.winner) {
                    //game.userkey can be used to update firebase shtuff
                    
                    game.cash = game.cash + 50;
                    console.log("Current cash amount: ", game.cash);
                    console.log("winner");
                    console.log("game.player:", game.player);
                    console.log("game.userkey:", game.userkey);
                    if (game.userkey != null) {
                        updateChallenges(game.userkey, "Wins", "Online");
                        updateLeaderboard(game.userkey, "win");
                    }else {
                        console("USER IS NULL: Not updating score");  
                    }
                    
                }else {
                    console.log("loser");
                    console.log("game.player:", game.player);
                    console.log("game.userkey:", game.userkey);
                    if (game.userkey != null) {
                        updateChallenges(game.userkey, "Losses", "Online");
                        updateLeaderboard(game.userkey, "lose");
                    }else {
                        console.log("USER IS NULL: Not updating score");
                    }
                    
                }
            }
        }

        
        app.money = game.cash;
        root.$broadcast('update', "homePageLink");

        //sessionStorage.setItem("cash", game.cash)
        
        // display win message
        const winMessage = game.add.text(
                                         game.world.centerX, 200, message,
                                         { font: '35px Arial', fill: '#ffffff' }
                                         )
        winMessage.anchor.setTo(0.5, 0.5)
        //make sure everythiong fits on screen by displaying seoncd line of message at lower y coordinate
        if(submessage != "")
        {
            const subWinMessage = game.add.text(
                                                game.world.centerX, 250, submessage,
                                                { font: '35px Arial', fill: '#ffffff' }
                                                )
            subWinMessage.anchor.setTo(0.5, 0.5)
        }
        
        // explain how to reStart the game, we will add more options when we have more games
        game.optionCount = 0;
        game.addMenuOption('Play Again',  400, function () {
                           //game.singleplayer = true
                           game.state.start("ticTac");
                           });
        game.addMenuOption('Return to TicTacToe Menu', 400, function () {
                            document.getElementById("chat-box").style.visibility = "hidden";
                           game.firstPlay = true
                           Client.notifyQuit()
                           if(!game.opponentLeft)
                                game.animateOpponentLeaving()
                           game.state.start("menu");
                           });

    },
    
    /*
     restart the tictactoe game
     */
    startGame () {
        game.state.start('ticTac')
    }
}
console.log("winstate defined")

/* Takes a userkey and a result- "lose" or "win"
 * Uses the userkey to fetch the current loss count of that user for the game,
 * then increments either the win or loss of that user and updates it
 */
function updateLeaderboard(userkey, result) {     
    
   var gametype;
   switch(game.gametype) {
      case "original":   gametype = "TTT"; break;
      case "3d":         gametype = "3DT"; break;
      case "orderChaos": gametype = "OAC"; break;
   }   
    
   //Uses the userkey to retrieve the user reference to update the [win|loss] and the rating
   firebase.database().ref('leaderboard/'+gametype+'/'+userkey).once('value').then(function(snapshot) {
                                                                                    
      updateScore( snapshot.val(), userkey, gametype, result);
      updateRating(snapshot.val(), userkey, gametype, result);
   });
}


/* Updates the [win|loss] count of the user 
 */
function updateScore(userRef, userkey, gametype, result) {
   console.log("userStats:", userRef);
    
   var resultCount = userRef.win + 1;
   if (result == "lose")
      resultCount = userRef.lose + 1;
   else if (result == "draw")
      resultCount = userRef.draw + 1;
    
   firebase.database().ref().child('leaderboard/'+gametype+'/'+userkey).update({ [result]: resultCount});
}


/* Calculates and updates the elo rating of the user given the result = [win|draw|loss]
 * Rating calculation is based on https://en.wikipedia.org/wiki/Elo_rating_system
 * 
 * Calculates the new rating updates firebase using the formula
 * E.A = A's expected score,
 * S.A = A's actual score (0:loss, 0.5:draw, 1:win)
 * R.A = player A's rating, R.B = player B's rating
 * K-factor = 32 (determines the maximum that a player's rating can change)
 * 
 * E.A = 1/(1 + 10^[(R.B - R.A)/400])
 * R.A' = R.A + K(S.A - E.A)
 */
function updateRating(userRef, userkey, gametype, result) {
    
   var myRating  = userRef.rating; //Our rating
   var oppRating;                  //Opponent's rating 
    
   //Fetches the opponent rating, and then calls doUpdateRating() update firebase
   function fetchOppRating(userkey, gametype) {
      firebase.database().ref('leaderboard/'+gametype+'/'+userkey+'/rating').once('value')
      .then(function(snapshot) {
              
         oppRating = snapshot.val();
         doUpdateRating();
      });
   }
    
   //Calculates the new rating and updates the leaderboard
   function doUpdateRating() {
      var power = (oppRating - myRating)/400;
      var expectedScore = 1/(1 + Math.pow(10, power));
      var actualScore = 1;                      //win
      if (result === 'draw') actualScore = 0.5; //draw
      if (result === 'lose') actualScore = 0;   //lose
      var k = 32;                               //k-factor
        
      var adjustedRating = myRating + k*(actualScore - expectedScore);
      console.log("oppRating:", oppRating);
      console.log("myRating:", myRating);
      console.log("my new rating:", adjustedRating);
      console.log("net gain:", adjustedRating - myRating);
        
      firebase.database().ref('leaderboard/'+gametype+'/'+userkey).update({ rating: adjustedRating});  
   }   
    
   fetchOppRating(game.opponentKey, gametype);
}

//takes in the userkey, the result of the game as 'Wins' 'Losses' or 'Draw',
//and takes in the line to see if it is online or offline
function updateChallenges(userkey, result, line) {

    var check;
    var cashMoney;
    var stringCash = app.money; //sessionStorage.getItem("cash");
    //var keyValue = sessionStorage.getItem("userkey");
    challengesRef = firebase.database().ref('/users/' + app.keyValue + '/challenges');
    leaderboardRef = firebase.database().ref('leaderboard/' + app.gametype + '/' + keyValue);
    //userRef = firebase.database().ref('/users/' + app.keyValue);


    //check for getting a draw match challenge

    //check loss a match challenge
    challengesRef.once('value').then(function(snapshot){
        check = snapshot.val().lose;
    
        if (line == 'Online') {
            if (check == '100%') {
                //do nothing if challenge is complete
            } else {
                if (result == 'Losses') {
                    challengesRef.update({ lose: '100%' });
                    notification("Challenge: Noooooooo! Unlocked! +5 Cash Money");
                    cashMoney = parseInt(stringCash);
                    cashMoney = cashMoney + 5;
                    app.money = cashMoney;
                    root.$broadcast('update', "homePageLink");
                    userRef.update({ cash: cashMoney }); //updates cash to firebase;
                }
            }
        }
        cashMoney = app.money; //update money

        //check for playing all game modes challenge
        check = snapshot.val().mode;
        if (line == "Online") {
            if (check == '100%') {
                //do nothing
            } else {
                leaderboardRef.once('value', function (snapshot) {
                    if (snapshot.win == '0' || snapshot.lose == '0') {
                        //do nothing if they have a win or loss
                    } else {
                        if (check == '0%') {
                            challengesRef.update({ mode: '25%' });
                        } else if (check == '25%') {
                            challengesRef.update({ mode: '50%' });
                        } else if (check == '50%') {
                            challengesRef.update({ mode: '75%' });
                        } else {
                            challengesRef.update({ mode: '100%' });
                            notification("Challenge: The Whole Shabang Unlocked! +50 Cash Money");
                            cashMoney = parseInt(stringCash);
                            cashMoney = cashMoney + 50;
                            app.money = cashMoney;
                            root.$broadcast('update', "homePageLink");
                            userRef.update({ cash: cashMoney }); //updates cash to firebase;

                        }
                    }
                });
            }
        }
        cashMoney = app.money; //update money

        //check for winning as a O challenge
        check = snapshot.val().o;
        if (line == 'Online') {
            if (check == '100%') {
                //do nothing if challenge is complete
            }else if(game.player == 'o' && result == 'Wins') {
                challengesRef.update({ o: '100%' });
                notification("Challenge: Ohhhhh yeah Unlocked! +50 Cash Money");
                cashMoney = parseInt(stringCash);
                cashMoney = cashMoney + 50;
                app.money = cashMoney;
                root.$broadcast('update', "homePageLink");
                userRef.update({ cash: cashMoney }); //updates cash to firebase;
            }
        }
        cashMoney = app.money //update money value

        //check for playing an offline match challenge
        check = snapshot.val().offline;
        //if the player is undefined it is offline
        if(line == 'Offline'){
            if (check == '100%') {
                //do nothing if challenge is complete
            } else {
                challengesRef.update({ offline: '100%' });
                notification("Challenge: Not the InterWebs Unlocked! +25 Cash Money");
                cashMoney = parseInt(stringCash);
                cashMoney = cashMoney + 25;
                app.money = cashMoney;
                root.$broadcast('update', "homePageLink");
                userRef.update({ cash: cashMoney }); //updates cash to firebase;
            }
        }
        cashMoney = app.money;//update money value

        //check for playing an online match challenge
        check = snapshot.val().online;
        if (line == 'Online') {
            if (check == '100%') {
                //do nothing if challenge is complete
            }else{
                challengesRef.update({ online: '100%' });
                notification("Challenge: The Interwebs Unlocked! +50 Cash Money");
                cashMoney = parseInt(stringCash);
                cashMoney = cashMoney + 50;
                app.money = cashMoney;
                root.$broadcast('update', "homePageLink");
                userRef.update({ cash: cashMoney }); //updates cash to firebase;
            }
        }
        cashMoney = app.money;//update money value

        //check for winning as a X challenge
        check = snapshot.val().x;
        if (line == 'Online') {
            if (check == '100%') {
                //do nothing if challenge is complete
            } else if (game.player == 'x' && result == 'Wins') {
                challengesRef.update({ x: '100%' });
                notification("Challenge: X Gunna Give it to Yah Unlocked! +50 Cash Money");
                cashMoney = parseInt(stringCash);
                cashMoney = cashMoney + 50;
                app.money = cashMoney;
                root.$broadcast('update', "homePageLink");
                userRef.update({ cash: cashMoney }); //updates cash to firebase;
            }
        }
        cashMoney = app.money; //update money value
        userRef.update({ cash: cashMoney });

        check = snapshot.val().draw;
        if(result == "Draw"){
            if(check == '100%'){
                //do nothing if challenge is complete
            }else{
                challengesRef.update({draw: '100%'});
                notification("Challenge: Artist Unlocked! +25 Cash Money");
                cashMoney = parseInt(stringCash);
                cashMoney = cashMoney + 25;
                app.money = cashMoney;
                root.$broadcast('update', "homePageLink");
                userRef.update({ cash: cashMoney }); //updates cash to firebase;
            }
        }
    });
}

function notification(message) {
    var x = document.getElementById("snackbar")
    x.className = "show";
    x.innerHTML = message;
    setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
}