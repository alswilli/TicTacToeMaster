/*
    This is where all the imgs are loaded, this doesn't need to be a whole
    separate file but will make the code a lot cleaner once we have more images
*/
// Initialize Firebase

var keyValue;
var nameOfUser;
var battleText;
var cashMoney;
var url;
var gametype;

var argumentVals = window.location.hash.split('&&');
console.log(argumentVals);




var loadState = {
  
    /*
        preload is a function called before any game logic is exectued, every state 
        can have its own preload() function,but its easier to keep it all here
    */
    preload() {
        var prefix = 'imgs/'
        if(app.gameType == "3d")
            prefix = 'imgs/3D/'
         
            
        //game.load.image('logo', 'imgs/piece' + piceNum + '.png');
        game.load.image('star', 'imgs/star.png');
        //game.load.image('square', 'imgs/square.png');
        game.load.image('moon', 'imgs/moon.png');
        game.load.image('board', 'imgs/angledBoard.png');
        game.load.image('greensquare', 'imgs/greensquare.png')
        game.load.image('square', prefix + 'square.png')
        console.log(prefix)
    },  
    
    /*
        creates this state, which has the sole purpose of switching to the menu after
        it loads the images
    */
    create() {
        game.handleOpponentLeaving = this.handleOpponentLeaving
        //game.showOpponent = this.showOpponent
        game.loadOpponent = this.loadOpponent
        game.disconnectSocket = this.disconnectSocket
        game.checkForDoubleClick = this.checkForDoubleClick
        game.animateOpponentLeaving = this.animateOpponentLeaving
        
        game.gametype = app.gameType;
        game.userkey = app.keyValue;
        game.nameOfUser = app.username;
        game.username = app.username;
        game.battleText = app.battleText;
        game.cash = parseInt(app.money);
        game.url = app.img_url;
        console.log("in load: ", game.gametype);
        game.opponentLeft = false;
        game.state.start('menu');
    },
    
    handleOpponentLeaving()
    {
        console.log("opponent left")
        if(game.state.current==="ticTac")
            game.state.start("waitingRoom");
        else
            game.firstPlay = true
        game.opponentLeft = true;
        $('#opponentCard').css({ 'right': '0px', 'right': '-20%' }).animate({
                                                                            'right' : '-20%'    
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
                   document.getElementById('opponentBattleText').innerHTML = '"' + game.opponentBattleText +'"';
                   //document.getElementById('cash').innerHTML = '$' + cashMoney;
                   $('#opponentImage').attr('src', url);
                   document.getElementById('opponentCard').style.visibility = "visible";                                           
                   $('#opponentCard').css({ 'right': '0px', 'right': '-20%' }).animate({
                                                                                       'right' : '0%'    
                                                                                       });  
                   game.opponentLeft = false;
                   game.startMatch(data);
              })
     })
    },
    
    disconnectSocket()
    {
        Client.disconnect();
    },
    
    checkForDoubleClick()
    {
        var turn
        if(app.gameType === "orderChaos")
            turn = game.isXTurn ?  "order" : "chaos"
        else
            turn = game.isXTurn ? "x" : "o"
        if(turn === game.previousPiece)
        {
            console.log("you double clicking mother fucker")
            game.isXTurn = !game.isXTurn
            game.waiting = true
            return true
        }
        else
            return false
    },
    
    animateOpponentLeaving()
    {
        game.opponentLeft = true;
        $('#opponentCard').css({ 'right': '0px', 'right': '-20%' }).animate({
                                                                            'right' : '-20%'    
                                                                            });
    }
    
};


