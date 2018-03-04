var challengeFriendState = {
    
    /*
     called to initialize this state
     */
    create() 
    {

        makeClient();
        Client.checkForFriendChallenge()
        document.getElementById("challengeFriend").style.visibility = "visible";
        
        $('#challengeFriendForm').submit(function()
        {
              console.log("send challenge!!")
              var friendName = $('#friendName').val();
                                         console.log(friendName)
              findFriend(friendName)
              
              return false;
        });
        
        
        const gameName = game.add.text(
                                       game.world.centerX, 100, "Enter Opponent's Name",
                                       { font: '50px Arial', fill: '#ffffff' }
                                       )
        //setting anchor centers the text on its x, y coordinates
        gameName.anchor.setTo(0.5, 0.5)
        game.optionCount = 0;
        
        game.addMenuOption('Main Menu', 400, function () {
                           document.getElementById("chat-box").style.visibility = "hidden";
                           document.getElementById("open-box").style.visibility = "hidden";
                           document.getElementById("challengeFriend").style.visibility = "hidden";
                           Client.notifyQuit()
                           game.state.start("menu");
                           });
        
    },
    
    
    
};
 
function findFriend(friendName)
{
    console.log("go to the firebase")
    firebase.database().ref('/users/').orderByChild('username').equalTo(friendName).limitToFirst(1).on('child_added',  sendChallenge)
}

function sendChallenge(snapshot)
{
    console.log(snapshot.val())
    var friend = snapshot.val()
    Client.makeNewPlayer({"name":game.username, "gametype":game.gametype, "userkey":game.userkey, "friend":friend.username});
    
    //game.state.start("ticTac");
}
