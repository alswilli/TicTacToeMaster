
var DEBUG;                  //The debug flag for debugging
var MAX_ROWS_ON_SCREEN;     //The max # of players that will be shown in the table at once 

var activeBoard;            //The default game to show rankings for when loading leaderboard.html                 
var snapshotArr;            //The snapshot as an array, of the leaderboard names
var playerIndex;            //This is the initial index of the person to show on the leader, e.g - a value of 0 will be rank 1 player 

/* Firebase is already intialized, so load the leaderboard for tictactoe
 * All these variables need to be initialized in .ready() because they need to be 
 * used immediately, and initializing outside of .ready() doesn't work because
 * jquery runs before javascript
 */
$(document).ready(function() {


   DEBUG              = true;
   MAX_ROWS_ON_SCREEN = 10;
   activeBoard        = "TTT";
   playerIndex        = 0;

   if (DEBUG) { console.log("START: $document.ready()"); } 
   
   getTopPlayersForGame(activeBoard);
});

/* Toggles the color of the active shown game on the leaderboard when it is pressed.
 * Clears the current table and loads the players from the clicked game.
 */
function switchToLeaderBoard(clickedBoard) {
   initPlayerIndex = 0;
   $("#table tbody tr").remove(); 
   getTopPlayersForGame(clickedBoard);
   
   if (clickedBoard !== activeBoard) {
      document.getElementById(clickedBoard).classList.add('w3-blue');
      document.getElementById(activeBoard).classList.toggle('w3-blue');
      activeBoard = clickedBoard;
   }
   
}

/* Shows the top 10 players on the leaderboard
 */
function toFirstPage() {
   playerIndex = 0;
   $("#table tbody tr").remove();
   getTopPlayersForGame(activeBoard);
}

/* Shows the previous top 10 players on the leaderboard starting at the new playerIndex
 */
function getPrevPlayers() {
   playerIndex -= 10;
   
   if (playerIndex < 0) { 
      if (DEBUG) { console.log("playerIndex < 0: Reverting to 0"); }
      playerIndex = 0;
   }else {
      if (DEBUG) { console.log("playerIndex:", playerIndex); }
      $("#table tbody tr").remove();
      getTopPlayersForGame(activeBoard);
   }
}

/* Shows the next top 10 players on the leaderboard starting at the new playerIndex 
 */
function getNextPlayers() {
   playerIndex += 10;
   
   $("#table tbody tr").remove();
   getTopPlayersForGame(activeBoard);
}

/* Queries the DB for all the players from the given game, converts the result to an array
 * and then creates the leaderboard table
 */
function getTopPlayersForGame(game) {
      firebase.database().ref().child('leaderboard/'+game).orderByChild('Wins').on('value', function(snapshot) {
      snapshotArr = snapshotToArray(snapshot);
      if (DEBUG) { console.log(snapshotArr); }
      createTable();      
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


/* Creates the table by adding a row for each player in the snapshotArr. If there are less than
 * 10 rows, empty rows are added to pad the table to the constant size
 */
function createTable() {
   if (DEBUG) { console.log("START: createTable()"); }
   
   var shownPlayers = 0;
   var rank = playerIndex + 1;

   for (var i=snapshotArr.length - playerIndex - 1; shownPlayers <= 10; i--) {
      if (snapshotArr[i] == undefined ) { break; }
      
      if (DEBUG) { console.log(snapshotArr[i].key + ' ' + snapshotArr[i].Wins + ' '+ snapshotArr[i].Losses); }
      
      addNewRow(rank, snapshotArr[i].key, snapshotArr[i].Wins, snapshotArr[i].Losses);
      shownPlayers++;
      rank++;
   }
   
   //Creates rows to fill in empty values 
   for (var i=shownPlayers; i<MAX_ROWS_ON_SCREEN; i++) {
      addNewRow(rank, '','','');
      rank++
   }
}

/* Adds a new row to the table, given the person's name and stats.
 * If the player only has wins, then we set his winrate to 100%.
 * If the name is '', then we set the winrate to '' for the empty row.
 */
function addNewRow(rank, name, win, lose) {   
   var row = document.createElement("TR");
   
   var winRate = ((win/lose * 100).toFixed(2)) + '%';
   if ((win != 0) && (lose == 0)) { winRate = "100%"; }
   if (name == '')                { winRate = '';     }
   
   row.appendChild( createTD(rank)    );
   row.appendChild( createTD(name)    );
   row.appendChild( createTD(win)     );
   row.appendChild( createTD(lose)    );
   row.appendChild( createTD(winRate) );
   
   document.getElementById("table_body").appendChild(row);
}

/* Creates and returns a new TD element with the given text
 */
function createTD(text) {
   var td   = document.createElement("TD");
   var text = document.createTextNode(text);
   td.appendChild(text);
   
   return td;
}