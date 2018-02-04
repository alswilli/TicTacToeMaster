
var maxRowsOnScreen;        //the max # of players that will be shown in the table at once
var table;                  //the ID of the table element
var activeBoard;            //the default game to show rankings for when loading leaderboard.html                 
var snapshotArr;            //the snapshot as an array, of the leaderboard names


//When the page is ready, intialize firebase and load the leaderboard for tictactoe
$(document).ready(function() {
   console.log("START: $document.ready()");

   maxRowsOnScreen = 10;
   table = document.getElementById("table"); //set table to be the table element
   activeBoard = "TTT";
   
   // Initialize Firebase
   var config = {
   apiKey: "AIzaSyARQqkwmw-yDfR4Fl7eyDSs464kPyDTWpo",
   authDomain: "tictactoemaster-b46ab.firebaseapp.com",
   databaseURL: "https://tictactoemaster-b46ab.firebaseio.com",
   projectId: "tictactoemaster-b46ab",
   storageBucket: "tictactoemaster-b46ab.appspot.com",
   messagingSenderId: "1050901435462"
   };
   firebase.initializeApp(config);
   console.log("AFTER: firebase intialization");
   
   getTopPlayersForGame(activeBoard);
});

/* This function is called when the button to show the board for a game is clicked
 * Clears the current table and loads the players from the clicked game
 */
function switchToLeaderBoard(clickedBoard) {
   $("#table tbody tr").remove(); 
   getTopPlayersForGame(clickedBoard);
   if (clickedBoard !== activeBoard) {
      document.getElementById(clickedBoard).classList.add('w3-blue');
      document.getElementById(activeBoard).classList.toggle('w3-blue');
      activeBoard = clickedBoard;
   }
   
}

//Queries the DB for all the players from the given game and then creates the leaderboard table
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
   var rank = 1;
   console.log("START: createTable()");
   for (var i=0; i<snapshotArr.length; i++) {
      //console.log(snapshotArr[i].key + ' ' + snapshotArr[i].Wins + ' '+ snapshotArr[i].Losses);
      addNewRow(rank, snapshotArr[i].key, snapshotArr[i].Wins, snapshotArr[i].Losses);
      shownPlayers++;
      rank++;
   }
   //Creates rows to fill in empty values 
   for (var i=shownPlayers; i<maxRowsOnScreen; i++) {
      addNewRow(rank, '','','');
      rank++
   }
   console.log(snapshotArr[10]);
   console.log(snapshotArr[10].key);   
}

//Adds a new row to the table
function addNewRow(rank, name, win, lose) {   
   var row = document.createElement("TR");
   
   var td1 = document.createElement("TD");
   var td2 = document.createElement("TD");
   var td3 = document.createElement("TD");
   var td4 = document.createElement("TD");
   var td5 = document.createElement("TD");
   
   var winRate = ((win/lose * 100).toFixed(2)) + '%';
   if ((win != 0) && (lose == 0)) { winRate = "100%"; }
   if (name == '') { winRate = ''; }
   
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