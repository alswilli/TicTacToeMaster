var unlockedRef; //The firebase reference to the unlocked section of each user
var userUnlocked; //The object that stores each item's unlock status
//The string that contains unlocked status consists of 0's(locked) and 1's(unlocked)
var unlockedBoard; //String repsensentation of the unlocked status of board design
var unlockedPiece; //String repsensentation of the unlocked status of piece design
var unlockedBackground; //String repsensentation of the unlocked status of background design
$(document).ready(function() {
                  
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
                  
                  console.log("In customization");
                  
                  var keyValue = localStorage.getItem("userKey");
                  var nameOfUser = localStorage.getItem("username");
                  var battleText = localStorage.getItem("battleText");
                  var cashMoney = localStorage.getItem("cash");
                  var url = localStorage.getItem("picURL");
                  
                  //gets reference for the user's unlocked items
                  unlockedRef=firebase.database().ref('/users/' + keyValue+'/unlocked');
                  initializeLocked();
                  
                  $( window ).on( "load", function() {
                                 
                                 console.log("Poooooooop!!");
                                 
                                 document.getElementById('username').innerHTML = nameOfUser;
                                 document.getElementById('battleText').innerHTML = battleText;
                                 document.getElementById('cash').innerHTML = '$' + cashMoney;
                                 $('.image').attr('src', url);
                                 
                                 //Home Page
                                 $('#homePage').on('click', function (e) {
                                                   e.preventDefault();
                                                   
                                                   console.log("going to achievements");
                                                   console.log("name: ", nameOfUser);
                                                   console.log("battleText: ", battleText);
                                                   console.log("cashMoney: ", cashMoney);
                                                   console.log("url: ", url);
                                                   
                                                   // var argumentData = [keyValue, nameOfUser, battleText, cashMoney, urlVar];
                                                   // console.log("arguments: ", argumentData);
                                                   
                                                   window.location.href = "mainMenu.html"
                                                   //window.location.href = "achievements.html?key="+keyValue+"&username="+nameOfUser+"&battleText="+battleText+"&cashMoney="+cashMoney+"&url="+url;
                                                   
                                                   });
                                 
                                 //Edit Profile
                                 $('#editProfile').on('click', function (e) {
                                                      e.preventDefault();
                                                      
                                                      console.log("going to achievements");
                                                      console.log("name: ", nameOfUser);
                                                      console.log("battleText: ", battleText);
                                                      console.log("cashMoney: ", cashMoney);
                                                      console.log("url: ", url);
                                                      
                                                      // var argumentData = [keyValue, nameOfUser, battleText, cashMoney, urlVar];
                                                      // console.log("arguments: ", argumentData);
                                                      
                                                      window.location.href = "editProfile.html"
                                                      //window.location.href = "achievements.html?key="+keyValue+"&username="+nameOfUser+"&battleText="+battleText+"&cashMoney="+cashMoney+"&url="+url;
                                                      
                                                      });
                                 
                                 
                                 //Achievements
                                 $('#achievements').on('click', function (e) {
                                                       e.preventDefault();
                                                       
                                                       console.log("going to customization");
                                                       console.log("name: ", nameOfUser);
                                                       console.log("battleText: ", battleText);
                                                       console.log("cashMoney: ", cashMoney);
                                                       console.log("url: ", url);
                                                       
                                                       window.location.href = "achievements.html"
                                                       });
                                 
                                 //Leaderboard
                                 $('#leaderboard').on('click', function (e) {
                                                      e.preventDefault();
                                                      
                                                      console.log("going to leaderboards");
                                                      console.log("name: ", nameOfUser);
                                                      console.log("battleText: ", battleText);
                                                      console.log("cashMoney: ", cashMoney);
                                                      console.log("url: ", url);
                                                      
                                                      window.location.href = "leaderboard.html"
                                                      });
                                 })
                  //create firebase references
                  var Auth = firebase.auth();
                  var dbRef = firebase.database();
                  var auth = null;
                  
                  //  console.log("name: ", nameOfUser);
                  //  console.log("battleText: ", battleText);
                  //  console.log("cashMoney: ", cashMoney);
                  //  console.log("url: ", url);
                  
                  // //Achievements
                  // $('#achievements').on('click', function (e) {
                  //     e.preventDefault();
                  
                  //     console.log("going to achievements");
                  //     console.log("name: ", nameOfUser);
                  //     console.log("battleText: ", battleText);
                  //     console.log("cashMoney: ", cashMoney);
                  //     console.log("url: ", url);
                  
                  //     window.location.href = "achievements.html" + '#' + keyValue + '#' + nameOfUser + '#' + battleText + '#' + cashMoney + '#' + url;
                  // });
                  
                  //Logout
                  $('#logout').on('click', function (e) {
                                  e.preventDefault();
                                  
                                  console.log("loggin out");
                                  
                                  firebase.auth().signOut()
                                  .then(function(authData) {
                                        console.log("Logged out successfully");
                                        window.location.href = "index.html";
                                        auth = authData;
                                        //$('#messageModalLabel').html(spanText('Success!', ['center', 'success']))
                                        
                                        })
                                  .catch(function(error) {
                                         console.log("Logout Failed!", error);
                                         //$('#messageModalLabel').html(spanText('ERROR: '+error.code, ['danger']))
                                         });
                                  });
                  })

//removes elements specidied by id
function remove(id) {
    var removeTarget = document.getElementById(id);
    removeTarget.style.display = "none";
}

//removes w3-grayscale class from images
function removeGrayScale(id) {
    var element = document.getElementById(id);
    element.classList.remove("w3-grayscale-max");
}

// removes the locktag, button, and grayscale class to show specified item is unlocked
function unlock(buttonId, tagId, imageId){
    remove(tagId);
    remove(buttonId);
    removeGrayScale(imageId);
}

/* 
 Gets the string represntation of what's unlocked(1) and what's locked(0) from firbase and unlocks the corresponding item for each category (board design, piece design, and background design)
 */
function initializeLocked(){
    unlockedRef.once('value', function(snapshot) {
                     //gets the reference for each data to read
                     userUnlocked = snapshot.val();
                     unlockedBoard = userUnlocked.board;
                     unlockedPiece = userUnlocked.piece;
                     unlockedBackground = userUnlocked.background;
                     //unlock unlocked items for board design
                     for (var boardIndex=0; boardIndex<unlockedBoard.length;boardIndex++){
                     if(unlockedBoard.charAt(boardIndex)=="1"){									
                     unlock("boardButton"+boardIndex,"boardLockTag"+boardIndex,"boardImage"+boardIndex);
                     }
                     }
                     //unlock unlocked items for piece design
                     for (var pieceIndex=0; pieceIndex<unlockedPiece.length;pieceIndex++){
                     if(unlockedPiece.charAt(pieceIndex)=="1"){									
                     unlock("pieceButton"+pieceIndex,"pieceLockTag"+pieceIndex,"pieceImage"+pieceIndex);
                     }
                     }
                     //unlock unlocked items for background design
                     for (var backgroundIndex=0; backgroundIndex<unlockedBackground.length;backgroundIndex++){
                     if(unlockedBackground.charAt(backgroundIndex)=="1"){									
                     unlock("backgroundButton"+backgroundIndex,"backgroundLockTag"+backgroundIndex,"backgroundImage"+backgroundIndex);
                     }
                     }
                     });
}

//takes in a string and change a character specified by the index
function replaceAtIndex(string,index){
    var newString ="";
    //loops through the string, replacing the character at index by 1 while keeping the rest
    for(var i=0;i<string.length;i++){
        if(i==index) newString+="1";
        else newString+=string.charAt(i);
    }
    return newString;
}

//when an item is purchased
function updateAndUnlock(buttonId, tagId, imageId){
    //splits buttonID to identify which category of design the item belongs to and the item's index number
    var itemType=buttonId.substring(0,buttonId.length-1); //gets category
    var itemIndex=buttonId.charAt(buttonId.length-1); //gets item index
    //console.log("swap index: ",itemIndex);
    if(itemType=="boardButton"){
        //console.log("initial board unlocked status: ",unlockedBoard);
        unlockedBoard=replaceAtIndex(unlockedBoard,itemIndex);
        //gets the reference to the child node storing the string that repsents board unlock status
        var boardRef=unlockedRef.child('board'); 
        //replaces the onld string with the new one
        boardRef.set(
                     unlockedBoard
                     );
        //console.log("new board unlock status: ",unlockedBoard);
    }else if (itemType=="pieceButton"){
        //console.log("initial piece unlocked status: ",unlockedPiece);
        unlockedPiece=replaceAtIndex(unlockedPiece,itemIndex);
        var pieceRef=unlockedRef.child('piece');
        pieceRef.set(
                     unlockedPiece
                     );
        //console.log("new piece unlock status: ",unlockedPiece);
    }else if (itemType=="backgroundButton"){
        //console.log("initial background unlocked status: ",unlockedBackground);
        unlockedBackground=replaceAtIndex(unlockedBackground,itemIndex);
        var backgroundRef=unlockedRef.child('background');
        backgroundRef.set(
                          unlockedBackground
                          );
        //console.log("new background unlock status: ",unlockedBackground);
    }else{
        console.log("buttonId error: incorrectId");
    }
    unlock(buttonId,tagId,imageId);
}
