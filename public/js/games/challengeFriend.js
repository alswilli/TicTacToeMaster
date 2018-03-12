var challengeFriendState = {

    /*
     called to initialize this state
     */
    create()
    {

        makeClient();
        Client.checkForFriendChallenge({"name":game.username, "gametype":game.gametype, "userkey":game.userkey})
        game.makeChallengeMenu = this.makeChallengeMenu
        game.confirmChallenge = this.confirmChallenge

        var background = game.add.sprite(game.world.centerX, game.world.centerY, 'menubackground');
        background.anchor.set(0.5);
        background.width = game.screenWidth;
        background.height = 700;

    },

    // Initialized menu used for initiating a challenger invite
    makeChallengeMenu()
    {
        var background = game.add.sprite(game.world.centerX, game.world.centerY, 'menubackground');
        background.anchor.set(0.5);
        background.width = game.screenWidth;
        background.height = 700;
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

    // Initialized menu used for accepting a challenger invite
    confirmChallenge(data)
    {
        const text = game.add.text(
                                       game.world.centerX, 100, "Accept challenge from " + data.name + "?",
                                       { font: '50px Arial', fill: '#ffffff' }
                                       )
        //setting anchor centers the text on its x, y coordinates
        text.anchor.setTo(0.5, 0.5)
        game.optionCount = 0;

        game.addMenuOption('Accept', 200, function () {
                           /*document.getElementById("chat-box").style.visibility = "hidden";
                           document.getElementById("open-box").style.visibility = "hidden";
                           document.getElementById("challengeFriend").style.visibility = "hidden";
                           Client.notifyQuit()*/
                           //game.challengingFriend = false
                           game.state.start("ticTac");
                           game.friend = {}
                           game.friend.username = game.username
                           //Client.acceptFriendChallenge(data)
                           });

        game.addMenuOption('Deny', 200, function () {
                           //Make alert to friend who got denied, defined in server,js
                           text.destroy()


                           Client.denyChallenge(game.username)
                           game.makeChallengeMenu()
                           });

    }

};


// Searches database for name of friend you are challenging
function findFriend(friendName) {
   console.log("go to the firebase")
   //check for the username in firebase
   firebase.database().ref('/users/').orderByChild('username').equalTo(friendName).limitToFirst(1).once("value", sendChallenge)
}

// Sends challenge invite to friend (which they see upon opening challenger game menu tab)
function sendChallenge(snapshot) {
   console.log(snapshot.val())
   snapshot.forEach(function (childSnapshot) {

      var value = childSnapshot.val();
      console.log("Title is : " + value.username);
      game.friend = value

   });
   console.log("FRIEND")
   console.log(game.friend)
   if (game.friend) {
      document.getElementById("challengeFriend").style.visibility = "hidden";
      game.state.start("ticTac");
   } else
      alert("no such user")

}
