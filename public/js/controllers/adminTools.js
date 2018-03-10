angular.module('TicTacToeApp')
   .controller('AdminToolsCtrl',
      function AdminToolsCtrl($scope, $rootScope) {
         'use strict';

         initSoundPrefs();
         playTheme("main");

         //Update sidebar to highlight adminTools page selection
         $rootScope.$broadcast('update', "adminToolsLink");
      });


/* Resets the stats for all players for each game.
 * First we check if the current user logged in is authorized to use the button. Then we grab
 * the leaderboard reference, then we enter a loop for each game of the leaderboard. Then we
 * enter another loop for each player of the game, and in each of these iterations, we reset
 * the stats of the player.
 */
function resetAllLeaderboards() {
   if (userIsPrivileged(app.keyValue) != true) {
      alert("Unauthorized User");
      return;
   }

   var password = prompt("Reset leaderboards for each game? Enter password to confirm.");
   if (password == null)
      return;

   //Password authorization to proceed
   firebase.database().ref('users/'+app.keyValue+'/password').once('value').then(function(snapshot) {
      if (password == snapshot.val()) {
         doResetAllLeaderboards();
      }else {
         alert("Incorrect Password");
      }
   });

   //Actually reset the board if we're authorized
   function doResetAllLeaderboards() {
      alert("All leaderboards reset");

      //Fetches the leaderboard reference
      firebase.database().ref().child('leaderboard').once('value').then(function (snapshot) {

         //Loops for each game of the leaderboard
         snapshot.forEach(function (childSnapshot) {
            var gameType = childSnapshot.key;   //the game type
            var gameData = childSnapshot.val(); //contains the player objects of the gametype

            //Resets the stats for each user.
            for (var playerID in gameData) {
               resetUserScore(gameType, playerID, gameData[playerID]);
            }
         });
      });

   }
}

/* Resets a player's stats for a specific game using the gametype and userkey
 * Currently not using playerData, but will use later for incrementing/decrementing
 */
function resetUserScore(gameType, playerID, playerData) {
   //console.log(gameType, playerID, playerData);
   firebase.database().ref('leaderboard/'+gameType+'/'+playerID).update({
      win   : 0,
      lose  : 0,
      draw  : 0,
      rating: 1200
   });
}

/* Takes a userkey and checks if the user is priviledged or not
 */
function userIsPrivileged(userkey) {
   var priviledgedUsers = [
      "MLSKZ92Ea7WRjFE7HixlkPIz17N2"
   ];

   if (priviledgedUsers.indexOf(userkey) != -1) {
      return true;
   }
   return false;
}
