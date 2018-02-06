
var maxRowsOnScreen;        //the max # of players that will be shown in the table at once
var table;                  //the ID of the table element
var activeBoard;            //the default game to show rankings for when loading leaderboard.html                 
var snapshotArr;            //the snapshot as an array, of the leaderboard names
var playerIndex;        //this is the initial index of the person to show on the leader, e.g - a value of 0 will be rank 1 player 

/* Firebase is already intialized, so load the leaderboard for tictactoe
 * All these variables need to be initialized in .ready() because they need to be 
 * used immediately, and initializing outside of .ready() doesn't work because
 * jquery runs before javascript
 */
$(document).ready(function() {
   console.log("START: $document.ready()");

   maxRowsOnScreen = 10;
   table = document.getElementById("table"); //set table to be the table element
   activeBoard = "TTT";
   playerIndex = 0;

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

function getPrevPlayers() {
   playerIndex -= 10;
   
   if (playerIndex < 0) { 
      console.log("playerIndex < 0: Reverting to 0");
      playerIndex = 0;
   }else {
      console.log("playerIndex:", playerIndex);
      $("#table tbody tr").remove();
      getTopPlayersForGame(activeBoard);
   }
}

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
      //console.log(snapshotArr);
      createTable();
      
   });
}

//Converts a snapshot into an array
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
   var shownPlayers = 0;
   var rank = playerIndex + 1;
   console.log("START: createTable()");
   for (var i=playerIndex; i<snapshotArr.length; i++) {
      //console.log(snapshotArr[i].key + ' ' + snapshotArr[i].Wins + ' '+ snapshotArr[i].Losses);
      if (snapshotArr[i] == undefined ) { continue; }
      
      addNewRow(rank, snapshotArr[i].key, snapshotArr[i].Wins, snapshotArr[i].Losses);
      shownPlayers++;
      rank++;
   }
   
   //Creates rows to fill in empty values 
   for (var i=shownPlayers; i<maxRowsOnScreen; i++) {
      addNewRow(rank, '','','');
      rank++
   }
}

/* Adds a new row to the table, given the person's name and stats
 * If the name is '', then it's an empty row, 
 */
function addNewRow(rank, name, win, lose) {   
   var row = document.createElement("TR");
   
   var td1 = document.createElement("TD");
   var td2 = document.createElement("TD");
   var td3 = document.createElement("TD");
   var td4 = document.createElement("TD");
   var td5 = document.createElement("TD");
   
   var winRate = ((win/lose * 100).toFixed(2)) + '%';
   if ((win != 0) && (lose == 0)) { winRate = "100%"; }
   if (name == '')                { winRate = ''; }
   
   var rank_    = document.createTextNode(rank);
   var name_    = document.createTextNode(name);
   var win_     = document.createTextNode(win);
   var lose_    = document.createTextNode(lose);
   var winRate_ = document.createTextNode(winRate);
   
   td1.appendChild(rank_);
   td2.appendChild(name_);
   td3.appendChild(win_);
   td4.appendChild(lose_);
   td5.appendChild(winRate_);
   
   row.appendChild(td1);
   row.appendChild(td2);
   row.appendChild(td3);
   row.appendChild(td4);
   row.appendChild(td5);
   
   document.getElementById("table_body").appendChild(row);
}