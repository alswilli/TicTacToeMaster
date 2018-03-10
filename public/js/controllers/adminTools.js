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
 * First we grab the leaderboard reference, then we enter a loop for each game of the leaderboard.
 * Then we enter another loop for each player of the game, and in each of these iterations, we
 * reset the stats of the player.
 */
function resetAllLeaderboards() {
   var confirmation = confirm("Reset leaderboards for each game?");
   if (confirmation == false) {
      return;
   }

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
