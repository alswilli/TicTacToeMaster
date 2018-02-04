
var table;                  //the ID of the table element
var activeBoard = "board1"; //the default game to show rankings for when loading leaderboard.html                 
var snapshotArr;            //the snapshot as an array, of the leaderboard names

$(document).ready(function() {
   console.log("START: $document.ready()");

   table = document.getElementById("table"); //set table to be the table element
   
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
   createTable();
   
   firebase.database().ref().child('leaderboard/TTT').orderByChild('Wins').on('value', function(snapshot) {
      //console.log(snapshotToArray(snapshot));
      snapshotArr = snapshotToArray(snapshot);
      console.log(snapshotArr);
      console.log("elem 0", snapshotArr[0]);
      for (var i=0; i<snapshotArr.length; i++) {
         console.log(snapshotArr[i].key + ' ' + snapshotArr[i].Wins + ' '+ snapshotArr[i].Losses);  
      }
      
   });
   
   
});

function snapshotToArray(snapshot) {
   var returnArr = [];
   snapshot.forEach(function(childSnapshot) {
      var item = childSnapshot.val();
      item.key = childSnapshot.key;
      
      returnArr.push(item);
   });
   return returnArr; 
};

function switchToLeaderBoard(clickedBoard) {
  //alert("lel");
  if (clickedBoard !== activeBoard) {
    document.getElementById(clickedBoard).classList.add('w3-blue');
    document.getElementById(activeBoard).classList.toggle('w3-blue');
    activeBoard = clickedBoard;
  }
}

function addNewRow(name, win, lose) {   
   var row = document.createElement("TR");
   
   var td1 = document.createElement("TD");
   var td2 = document.createElement("TD");
   var td3 = document.createElement("TD");
   var td4 = document.createElement("TD");
   
   var name_    = document.createTextNode(name);
   var win_     = document.createTextNode(win);
   var lose_    = document.createTextNode(lose);
   var winRate_ = document.createTextNode(win/lose * 100 + '%');
   
   td1.appendChild(name_);
   td2.appendChild(win_);
   td3.appendChild(lose_);
   td4.appendChild(winRate_);
   
   row.appendChild(td1);
   row.appendChild(td2);
   row.appendChild(td3);
   row.appendChild(td4);
   
   table.appendChild(row);
}

function createTable() {
    console.log("START: table()");
    //var database = firebase.database();
	/*
    var table = document.createElement("TABLE");
    table.setAttribute("id", "table1");
    document.body.appendChild(table);
    */

    var row1 = document.createElement("TR");
    var row2 = document.createElement("TR");
    var row3 = document.createElement("TR");
    var row4 = document.createElement("TR");
      
    var name1 = document.createTextNode("Jill Stein");
    var win1  = document.createTextNode("1");
    var lose1 = document.createTextNode("2");
    var winrate1 = document.createTextNode("33.33%");
    var td1a = document.createElement("TD");
    var td1b = document.createElement("TD");
    var td1c = document.createElement("TD");
    var td1d = document.createElement("TD");
  
    var name2 = document.createTextNode("Dingus");
    var win2  = document.createTextNode("2");
    var lose2 = document.createTextNode("4");
    var winrate2 = document.createTextNode("50.00%");
    var td2a = document.createElement("TD");
    var td2b = document.createElement("TD");
    var td2c = document.createElement("TD");
    var td2d = document.createElement("TD");
  
    var name3 = document.createTextNode("OpenGLuva");
    var win3  = document.createTextNode("1");
    var lose3 = document.createTextNode("7");
    var winrate3 = document.createTextNode("0.14%");
    var td3a = document.createElement("TD");
    var td3b = document.createElement("TD");
    var td3c = document.createElement("TD");
    var td3d = document.createElement("TD");
  
    var name4 = document.createTextNode("Ugandan Warrior");
    var win4  = document.createTextNode("10");
    var lose4 = document.createTextNode("0");
    var winrate4 = document.createTextNode("100.00%");
    var td4a = document.createElement("TD");
    var td4b = document.createElement("TD");
    var td4c = document.createElement("TD");
    var td4d = document.createElement("TD");
    
    document.getElementById("table").appendChild(row1);
    document.getElementById("table").appendChild(row2);
    document.getElementById("table").appendChild(row3);
    document.getElementById("table").appendChild(row4);
   
    row1.appendChild(td1a);
    row1.appendChild(td1b);
    row1.appendChild(td1c);
    row1.appendChild(td1d);
  
    row2.appendChild(td2a);
    row2.appendChild(td2b);
    row2.appendChild(td2c);
    row2.appendChild(td2d); 
  
    row3.appendChild(td3a);
    row3.appendChild(td3b);
    row3.appendChild(td3c);
    row3.appendChild(td3d);
  
    row4.appendChild(td4a);
    row4.appendChild(td4b); 
    row4.appendChild(td4c); 
    row4.appendChild(td4d); 
  
    td1a.appendChild(name1);
    td1b.appendChild(win1);
    td1c.appendChild(lose1);
    td1d.appendChild(winrate1);
  
    td2a.appendChild(name2);
    td2b.appendChild(win2);
    td2c.appendChild(lose2);
    td2d.appendChild(winrate2);
    
    td3a.appendChild(name3);
    td3b.appendChild(win3);
    td3c.appendChild(lose3);
    td3d.appendChild(winrate3);
  
    td4a.appendChild(name4); 
    td4b.appendChild(win4);
    td4c.appendChild(lose4);
    td4d.appendChild(winrate4);
   
   addNewRow("fuck", 1, 3);
}