var activeBoard = "board1";

document.addEventListener('DOMContentLoaded', function() {
    //alert("3");
    table();
}, false);

function switchToLeaderBoard(clickedBoard) {
  //alert("lel");
  if (clickedBoard !== activeBoard) {
    document.getElementById(clickedBoard).classList.add('w3-blue');
    document.getElementById(activeBoard).classList.toggle('w3-blue');
    activeBoard = clickedBoard;
  }
}

function table() {
    alert("table function1");
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
    
    var td1a = document.createElement("TD");
    var td2a = document.createElement("TD");
    var td3a = document.createElement("TD");
    var td4a = document.createElement("TD");
    
    var name1 = document.createTextNode("Jill Stein");
    
  
    var name2 = document.createTextNode("Dingus");
    var name3 = document.createTextNode("OpenGLuva");
    var name4 = document.createTextNode("Ugandan Warrior");
  
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
    row2.appendChild(td2a);
    row3.appendChild(td3a);
    row4.appendChild(td4a);      
  
    td1a.appendChild(name1);
    td2a.appendChild(name2);
    td3a.appendChild(name3);
    td4a.appendChild(name4); 
  
}