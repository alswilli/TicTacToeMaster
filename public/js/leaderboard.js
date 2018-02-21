
var DEBUG;                  //The debug flag for debugging
var MAX_ROWS_ON_SCREEN;     //The max # of players that will be shown in the table at once

var activeBoard;            //The default game to show rankings for when loading leaderboard.html
var snapshotArrs;           //The object containing arrays of the leaderboard for each game, e.g - snapshotArrs["TTT"] 
var playerIndex;            //This is the initial index of the person to show on the leader, e.g - a value of 0 will be rank 1 player


/* Firebase is already intialized, so load the leaderboard for tictactoe
 * All these variables need to be initialized in .ready() because they need to be
 * used immediately, and initializing outside of .ready() doesn't work because
 * jquery runs before javascript
 */
$(document).ready(function() {
                  
   DEBUG              = false;
   MAX_ROWS_ON_SCREEN = 10;
   activeBoard        = "TTT";
   snapshotArrs       = {};            
   playerIndex        = 0;
                  
   if (DEBUG) { console.log("START: $document.ready()"); }
                  
   getTopPlayersForGame(activeBoard);
});


/* Toggles the color of the active shown game on the leaderboard when it is pressed.
 * Clears the current table and loads the players from the clicked game.
 * If the leaderboard array for the clicked game is null, then we need to initialize it 
 * first in getTopPlayersForGame(), otherwise we use createTable() 
 */
function switchToLeaderBoard(clickedBoard) {
    playerIndex = 0;
   
    if (snapshotArrs[clickedBoard] == null) {
       getTopPlayersForGame(clickedBoard);
    }else {
      createTable(clickedBoard);
    }
   
    if (clickedBoard !== activeBoard) {
        document.getElementById(clickedBoard).classList.add('w3-blue');
        document.getElementById(activeBoard).classList.toggle('w3-blue');
        activeBoard = clickedBoard;
    }
    
}


/* Shows the top 10 players on the leaderboard
 */
function toFirstPage() {
    if (playerIndex == 0) { return; }
    
    playerIndex = 0;
    createTable(activeBoard);
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
      createTable(game);
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
   addTableStatRow(game); //Creates 1st row - Rank, Player Name, ...
   
   var shownPlayers = 0;
   var rank = playerIndex + 1;
   var start = snapshotArrs[game].length - playerIndex - 1;
   
   for (var i=start; shownPlayers <= 10; i--) {
      var player = snapshotArrs[game][i];
      
      if (player == undefined ) { break; }
                
      addNewRow(game, rank, player.username, player.rating, player.win, player.lose, player.draw);
      shownPlayers++;
      rank++;
   }
    
   //Creates rows to fill in empty values
   for (var i=shownPlayers; i<MAX_ROWS_ON_SCREEN; i++) {
      addNewRow(game, rank, '','','', '', '');
      rank++
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
    
   rating = Math.round(rating); 
   
   var winRate = ( ( (win + 0.5*draw) / (win+lose+draw) ) * 100).toFixed(2) + '%';
   if ( (win + lose + draw) == 0 )  { winRate = "---"; rating = "---" }
   if ( name == '' )                { winRate = '';     }
    
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


/* Removes all the rows of the table by removing the thead and tbody
 */
function clearTable() {
   $("#table thead tr").remove();
   $("#table tbody tr").remove();  
}

/* This sorts the players for the game by Rating -> Winrate -> Wins -> Draws
 */
function sortPlayers(game) {
   snapshotArrs[game].sort(function(a, b) {
      
   });
}