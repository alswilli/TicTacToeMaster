var activeBoard = "board1";
var snapshotArr;

$(document).ready(function() {
   console.log("START: $document.ready()")

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
   table();
   
   firebase.database().ref().child('leaderboard/TTT').orderByChild('Wins').on('value', function(snapshot) {
      //console.log(snapshotToArray(snapshot));
      snapshotArr = snapshotToArray(snapshot);
      console.log(snapshotArr);
      console.log("elem 0", snapshotArr[0]);
      for (var i=0; i<snapshotArr.length; i++) {
         console.log(snapshotArr[i].key + ' ' + snapshotArr[i].Wins + ' '+ snapshotArr[i].Losses);  
      }
      
   });
   
   
   
   // since database functions are asynchronous, snapshotArr contains nothing at
   // this point even though it's after the firebase code
   //console.log(snapshotArr);
   
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

function table() {
    console.log("START: table()");
    //var database = firebase.database();
	/*
    var table = document.createElement("TABLE");
    table.setAttribute("id", "table1");
    document.body.appendChild(table);
    */
    var row0 = document.createElement("TR");
    var row1 = document.createElement("TR");
    var row2 = document.createElement("TR");
    var row3 = document.createElement("TR");
    var row4 = document.createElement("TR");
    
    var th1 = document.createElement("TH");
    var th2 = document.createElement("TH");
    var th3 = document.createElement("TH");
    var th4 = document.createElement("TH");
    
    var t1 = document.createTextNode("Player Name");
    var t2 = document.createTextNode("Wins");
    var t3 = document.createTextNode("Losses");
    var t4 = document.createTextNode("Winrate");
    
  
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
    
    document.getElementById("table").appendChild(row0);
    document.getElementById("table").appendChild(row1);
    document.getElementById("table").appendChild(row2);
    document.getElementById("table").appendChild(row3);
    document.getElementById("table").appendChild(row4);
  
  	row0.appendChild(th1);
    row0.appendChild(th2);
    row0.appendChild(th3);
    row0.appendChild(th4);
    
    th1.appendChild(t1);
    th2.appendChild(t2);
    th3.appendChild(t3);
    th4.appendChild(t4);
  
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
}