/*
    State that is displayed when the game is over
*/
var challengesRef;
var leaderboardRef;
const winState = {
    create () {

        /*
            draw the ending board, creating a new state wipes every image from the previous
            state, so we have to save what the board looked like when the game ended so 
            it can be displayed in this winState
        */
        game.endingBoard.forEach(function(element) {
            if(element.key != 'text')
                game.addSprite(element.x, element.y, element.key);
        });
    
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
      //              updateChallenges(game.userkey, "Draw", "Offline");
                } else {
      //              updateChallenges(game.userkey, "Draw", "Online");
                }
            } else {
                console("USER IS NULL");
            }

        }
        else
        {
            
            message = game.winner + ' wins! '// + game.winner //+ ' receives 50 gold coins!' //add sound and or animation here later for getting the money
            submessage = game.winner + ' receives 50 gold coins!'
            
            if (game.singleplayer == true)
            {
                game.cash = game.cash + 50;
                console.log("Current cash amount: ", game.cash);
                console.log("game.player:", game.player);
                console.log("game.userkey", game.userkey);
                console.log("game.username", game.username);
  //            updateChallenges(game.userkey, "Draw", "Offline");
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
                    //console.log("I AM TILTED.");
                    console.log("Current cash amount: ", game.cash);
                    console.log("winner");
                    console.log("game.player:", game.player);
                    console.log("game.userkey:", game.userkey);
                    if (game.userkey != null) {
   //                   updateChallenges(game.userkey, "Wins", "Online");
                        updateScore(game.userkey, "Wins");
                    }else {
                       console("USER IS NULL: Not updating score");  
                    }
                   
                }else {
                    console.log("loser");
                    console.log("game.player:", game.player);
                    console.log("game.userkey:", game.userkey);
                    if (game.userkey != null) {
      //                updateChallenges(game.userkey, "Losses", "Online");
                        updateScore(game.userkey, "Losses");
                    }else {
                       console.log("USER IS NULL: Not updating score");
                    }

                }
            }
        }
        sessionStorage.setItem("cash", game.cash)
        
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
                           game.firstPlay = true
                           Client.notifyQuit()
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


/* Takes a userkey and a string- "Losses" or "Wins" as the result.
 * Uses the userkey to lookup the username, then uses the username to update
 * the count of either Losses or Wins
 */
function updateScore(userkey, result) {
   //Sets the gametype to be used in the query
   var gametype;
   console.log("gametype:", game.gametype);
   switch(game.gametype) {
      case "original":
         gametype = "TTT"; break;
      case "3d":
         gametype = "3DT"; break;
      case "orderChaos":
         gametype = "OAC"; break;
   }
   
   //Retrieves the username using the userkey
   firebase.database().ref('users/'+userkey+'/username').on('value', function(snapshot) {      
      var username = snapshot.val();
      console.log("username: ", username);
      
      //Uses the username to retrieve the [win|loss] count of that user for the game and increments it
      firebase.database().ref('leaderboard/'+gametype+'/'+username+'/'+result).once('value').then(function(snapshot2) {
         var resultCount = snapshot2.val() + 1;
         console.log(result,resultCount);        
         
         //Updates the the [win|loss] count of the user
         firebase.database().ref().child('leaderboard/'+gametype+'/'+username).update({ [result]: resultCount});
      });
   });
}

//takes in the userkey, the result of the game as 'Wins' 'Losses' or 'Draw',
//and takes in the line to see if it is online or offline
function updateChallenges(userkey, result, line) {

    var check;
    var keyValue = sessionStorage.getItem("userkey");
    challengesRef = firebase.database().ref('/users/' + keyValue + '/challenges');
    leaderboardRef = firebase.database().ref('leaderboard/' + gametype + '/' + keyValue);


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
                    console.log('Challenge Complete!!!!!');
                    //notification needed
                }
            }
        }
    
        //check for playing all game modes challenge
        check = snapshot.val().mode;
    
        if (check == '100%') {
            //do nothing
        } else {
            leaderboardRef.once('value', function (snapshot) {
                if(snapshot.wins == '0' || snapshot.lose == '0'){
                    //do nothing if they have a win or loss
                }else{
                    if (check == '0%') {
                        challengesRef.update({ mode: '25%' });
                    } else if (check == '25%') {
                        challengesRef.update({ mode: '50%' });
                    } else if (check == '50%') {
                        challengesRef.update({ mode: '75%' });
                    } else {
                        challengesRef.update({ mode: '100%' });
                        console.log('Challenge Complete!!!!!');
                        //notification needed
                    }
                }
            });
            }
    
        //check for winning as a O challenge
        check = snapshot.val().o;
        if (line == 'Online') {
            if (check == '100%') {
                //do nothing if challenge is complete
            }else if(game.player == 'o' && result == 'Wins') {
                challengesRef.update({ o: '100%' });
                console.log('Challenge Complete!!!!!');
            }
        }

        //check for playing an offline match challenge
        check = snapshot.val().offline;
        //if the player is undefined it is offline
        if(line == 'Offline'){
            if (check == '100%') {
                //do nothing if challenge is complete
            } else {
                challengesRef.update({ offline: '100%' });
                console.log('Challenge Complete!!!!!');
            }
        }


        //check for playing an online match challenge
        check = snapshot.val().online;
        if (line == 'Online') {
            if (check == '100%') {
                //do nothing if challenge is complete
            }else{
                challengesRef.update({ online: '100%' });
                console.log('Challenge Complete!!!!!');
            }
        }

        //check for winning as a X challenge
        check = snapshot.val().x;
        if (line == 'Online') {
            if (check == '100%') {
                //do nothing if challence is complete
            } else if (game.player == 'x' && result == 'Wins') {
                challengesRef.update({ x: '100%' });
                console.log('Challenge Complete!!!!!');
            }
        }
    });
};
