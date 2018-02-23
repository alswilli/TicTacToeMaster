/*
    This is where all the imgs are loaded, this doesn't need to be a whole
    separate file but will make the code a lot cleaner once we have more images
*/
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
var keyValue;
var nameOfUser;
var battleText;
var cashMoney;
var url;
var gametype;

var argumentVals = window.location.hash.split('&&');
console.log(argumentVals);

/*keyValue = argumentVals[1];
 console.log(keyValue);
 nameOfUser = localStorage.getItem("username")//argumentVals[2];
 console.log(nameOfUser);
 battleText = argumentVals[3];
 console.log(battleText);
 cashMoney = argumentVals[4];
 console.log(cashMoney);
 url = argumentVals[5];
 console.log(url);
 gametype = argumentVals[6]*/
gametype = sessionStorage.getItem("gameType");
nameOfUser = sessionStorage.getItem("username");
keyValue = sessionStorage.getItem("userkey");
nameOfUser = sessionStorage.getItem("username");
battleText = sessionStorage.getItem("battleText");
cashMoney = sessionStorage.getItem("cash");
url = sessionStorage.getItem("picURL");
var loadState = {
  
    /*
        preload is a function called before any game logic is exectued, every state 
        can have its own preload() function,but its easier to keep it all here
    */
    preload() {
        game.load.image('logo', 'imgs/phaser.png');
        game.load.image('star', 'imgs/star.png');
        game.load.image('square', 'imgs/square.png');
        game.load.image('moon', 'imgs/moon.png');
        game.load.image('board', 'imgs/angledBoard.png');
        
    },  
    
    /*
        creates this state, which has the sole purpose of switching to the menu after
        it loads the images
    */
    create() {
        game.handleOpponentLeaving = this.handleOpponentLeaving
        //game.showOpponent = this.showOpponent
        game.loadOpponent = this.loadOpponent
        game.state.start('menu');
    },
    
    handleOpponentLeaving()
    {
        updateLeaderboard(keyValue, "win");
        updateLeaderboard(game.opponentKey, "lose");
       
        if(game.state.current==="ticTac")
            game.state.start("waitingRoom");
        else
            game.firstPlay = true
        
        $('#opponentCard').css({ 'right': '0px', 'right': '-15%' }).animate({
                                                                            'right' : '-15%'    
                                                                            });  
    },
    
    loadOpponent(data)
    {
        if(game.id === data.id)
        {
            game.opponent = data.challenger
            game.opponentKey = data.challengerkey
        }
        else
        {
            game.opponent = data.username
            game.opponentKey = data.userkey
        }
        firebase.database().ref('/users/' + game.opponentKey).once('value').then(function(snapshot)                                                         
        {
             game.opponentBattleText = (snapshot.val().battleText);            
             var img = (snapshot.val().image);
             firebase.storage().ref(img).getDownloadURL().then(function(url) 
             {
                   game.opponentPicURL = url;
                   document.getElementById('opponentUsername').innerHTML = game.opponent;
                   document.getElementById('opponentBattleText').innerHTML = game.opponentBattleText;
                   //document.getElementById('cash').innerHTML = '$' + cashMoney;
                   $('#opponentImage').attr('src', url);
                   document.getElementById('opponentCard').style.visibility = "visible";                                           
                   $('#opponentCard').css({ 'right': '0px', 'right': '-15%' }).animate({
                                                                                       'right' : '0%'    
                                                                                       });  
                   game.startMatch(data);
              })
     })
    }
};

$( window ).on( "load", function()
               {
               
               console.log("Poooooooop!!");
               
               document.getElementById('username').innerHTML = nameOfUser;
               document.getElementById('battleText').innerHTML = battleText;
               //document.getElementById('cash').innerHTML = '$' + cashMoney;
               $('#userImage').attr('src', url);
               document.getElementById('playerCard').style.visibility = "visible";
               
               $('#playerCard').css({ 'right': '0px', 'left': '-15%' }).animate({
                                                                     'left' : '0%'    
                                                                     });  
               
});
