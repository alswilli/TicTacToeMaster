var DEBUG;                  //The debug flag for debugging
var MAX_ROWS_ON_SCREEN;     //The max # of players that will be shown in the table at once

var activeBoard;            //The default game to show rankings for when loading leaderboard.html
var snapshotArrs;           //The object containing arrays of the leaderboard for each game, e.g - snapshotArrs["TTT"]
var playerIndex;            //This is the initial index of the person to show on the leader, e.g - a value of 0 will be rank 1 player
var sorted;                 /*This flag is set to false whenever there's a firebase update to the array, and set to true
                             *the first time we createTable() */

angular.module('TicTacToeApp')
   .controller('LeaderboardCtrl',
   function LeaderboardCtrl ($scope, $rootScope ) {
   'use strict';

   initSoundPrefs();
   playTheme("main");

   unlockedRef        = userRef.child('unlocked');
   DEBUG              = false;
   MAX_ROWS_ON_SCREEN = 10;
   activeBoard        = "TTT";
   snapshotArrs       = {};
   playerIndex        = 0;
   sorted             = false;

   getTopPlayersForGame(activeBoard);

   //Update sidebar to highlight leaderboard page selection
   $rootScope.$broadcast('update', "leaderboardLink");
});

/* Toggles the color of the active shown game on the leaderboard when it is pressed.
 * Clears the current table and loads the players from the clicked game.
 * If the leaderboard array for the clicked game is null, then we need to initialize it
 * first in getTopPlayersForGame(), otherwise we use createTable()
 */
function switchToLeaderBoard(clickedBoard) {

   if (clickedBoard !== activeBoard) {
      document.getElementById(clickedBoard).classList.add('w3-green');
      document.getElementById(activeBoard).classList.toggle('w3-green');
      activeBoard = clickedBoard;
      sorted = false;
   }

   playerIndex = 0;

   if (snapshotArrs[clickedBoard] == null) {
      getTopPlayersForGame(clickedBoard);
   }else {
      createTable(clickedBoard);
   }
}

/* Shows the top 10 players on the leaderboard
 */
function toFirstPage() {
   if (playerIndex == 0) { return; }

   playerIndex = 0;
   createTable(activeBoard);
}

/* Shows the page where the user is in the leaderboard
 * Does nothing for a guest
 */
function toYourPage() {
   var username = app.username;
   if (username == null) return;


   var index = snapshotArrs[activeBoard].map(function(player) {
      return player.username;
   }).indexOf(username);

   playerIndex = Math.floor(index/10) * 10;
   createTable(activeBoard);

   //This is the fading animation on the row that represents the player
   document.getElementById("userRow").classList.toggle('w3-animate-opacity');
}

/* Shows the previous top 10 players on the leaderboard starting at the new playerIndex
 */
function getPrevPlayers() {
   playerIndex -= 10;

   if (playerIndex < 0) {
      playerIndex = 0;
   }else {
      createTable(activeBoard);
   }
}

/* Shows the next top 10 players on the leaderboard starting at the new playerIndex
 */
function getNextPlayers() {
   playerIndex += 10;
   createTable(activeBoard);
}

/* Queries the DB for all the players from the given game, converts the result to an array
 * and then creates the leaderboard table. Apparently the function inside the firebase reference
 * is a callback function for if the database changes, so $.remove() is moved to here to clear
 * the table everytime a new table needs to be created
 */
function getTopPlayersForGame(game) {

   firebase.database().ref().child('leaderboard/'+game).orderByChild('rating').on('value', function(snapshot) {
      snapshotArrs[game] = snapshotToArray(snapshot);
      if (DEBUG) { console.log(snapshotArrs); }

      //Since this function calls for whenever there's an update on anygame, this check ensures that the shown table
      //is only updated if we're viewing the list that's updated. We also set sorted to false, because if there's an
      //update on the list we're viewing, then the list will potentially be out of order.
      if (game == activeBoard) {
         sorted = false;
         createTable(game);
      }
   });
}

/* Converts a snapshot into an array
 */
function snapshotToArray(snapshot) {
   var Arr = [];
   snapshot.forEach(function(childSnapshot) {
      var item = childSnapshot.val();
      item.key = childSnapshot.key;

      Arr.push(item);
   });
   return Arr;
};

/* Clears current table, then creates the table by adding a row for each player in the snapshotArr.
 * If there are less than 10 rows, empty rows are added to pad the table to the constant size of 10 rows
 */
function createTable(game) {

   clearTable();
   addTableStatRow(game);   //Creates 1st row - Rank, Player Name, ...

   if (!sorted) {
      sortPlayers(game);    //Sorts the users of the game
      sorted = true;
   }

   var shownPlayers = 0;
   var rank = playerIndex + 1;

   for (var i=playerIndex; shownPlayers < 10; i++) {
      var player = snapshotArrs[game][i];

      if (player == undefined ) { break; }

      addNewRow(game, rank, player.username, player.rating, player.win, player.lose, player.draw);
      shownPlayers++;
      rank++;
   }

   //Creates rows to fill in empty values
   for (var i=shownPlayers; i<MAX_ROWS_ON_SCREEN; i++) {
      addNewRow(game, rank, '','','', '', '');
      rank++;
   }
}

/* This creates the 1st row of the table (Rank, Player Name, ...)
 */
function addTableStatRow(game) {
   var tableStatsRow = document.createElement("TR");

   tableStatsRow.appendChild( create("TH", "Rank" ) );
   tableStatsRow.appendChild( create("TH", "Player Name" ) );
   tableStatsRow.appendChild( create("TH", "Rating" ) );
   tableStatsRow.appendChild( create("TH", "Wins" ) );
   tableStatsRow.appendChild( create("TH", "Losses" ) );
   if (game != "OAC")
      tableStatsRow.appendChild( create("TH", "Draws" ) );
   tableStatsRow.appendChild( create("TH", "Winrate" ) );

   document.getElementById("leaderboardStats").appendChild(tableStatsRow);
}

/* Adds a new row to the table, given the person's name and stats.
 * If the player has 0 wins,losses, and draws, set the winrate to ---
 * If the name is '', set the winrate to '' for the empty row.
 */
function addNewRow(game, rank, name, rating, win, lose, draw) {
   var row = document.createElement("TR");

   //Sets the id for the row that represents you so that we can find it later
   if (name == app.username) {
      row.setAttribute("id", "userRow");
   }

   rating = Math.round(rating);

   var winRate = (calculateWinRate(win, lose, draw) * 100).toFixed(2) + '%';
   if ( (win + lose + draw) == 0 )  { winRate = "---"; rating = "---" }
   if ( name == '' )                { winRate = ''   ; rating = ""    }

   row.appendChild( create("TD", rank)    );
   row.appendChild( create("TD", name)    );
   row.appendChild( create("TD", rating)  );
   row.appendChild( create("TD", win)     );
   row.appendChild( create("TD", lose)    );
   if (game != "OAC")
      row.appendChild( create("TD", draw)    );
   row.appendChild( create("TD", winRate) );

   document.getElementById("table_body").appendChild(row);
}

/* Creates and returns a new element [TD|TH] with the given text
 */
function create(elem, text) {
   var td   = document.createElement(elem);
   var text = document.createTextNode(text);
   td.appendChild(text);

   return td;
}

/* Calculates winrate
 */
function calculateWinRate(win, lose, draw) {
   return (win + 0.5*draw) / (win+lose+draw);
}

/* Removes all the rows of the table by removing the thead and tbody
 */
function clearTable() {
   $("#table thead tr").remove();
   $("#table tbody tr").remove();
}

/* This sorts the players descending by
 * the Priority = Rating->Winrate->Wins->Draws
 *
 * Let P = Played , N = Didn't play,
 * Player A | Player B | cmp Result
 * --------------------------------
 *     P    |     P    | Priority
 *     P    |     N    |    -1
 *     N    |     P    |     1
 *     N    |     N    |     0
 */
function sortPlayers(game) {
   snapshotArrs[game].sort(function(a, b) {
      var aPlayed = (a.win + a.lose + a.draw) != 0;
      var bPlayed = (b.win + b.lose + b.draw) != 0;

      var aWinRate = calculateWinRate(a.win, a.lose, a.draw);
      var bWinRate = calculateWinRate(b.win, b.lose, b.draw);

      var ratingDiff  = b.rating - a.rating;
      var winRateDiff = bWinRate - aWinRate;
      var winDiff     = b.win    - a.win;
      var drawDiff    = b.draw   - a.draw;

      if (aPlayed && bPlayed) {

         if (ratingDiff != 0) {
            return ratingDiff;
         }
         else if (winRateDiff != 0) {
            return winRateDiff;
         }
         else if (winDiff != 0) {
            return winDiff;
         }
         else {
            return drawDiff;
         }
      }
      else if (aPlayed && !bPlayed) {
         return -1;
      }
      else if (!aPlayed && bPlayed) {
         return 1;
      }
      else {
         return 0;
      }
   });
}
