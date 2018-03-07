var root
angular.module('TicTacToeApp')
.controller('GameCtrl',
            function GameCtrl ($scope, $rootScope ) {
            'use strict';
            
            //playTheme("game");         
   
            app.numGames++
            if(app.numGames > MAX_GAME_NUM)
            {
                location.reload(); 
            }
            
            root = $rootScope;
            //update siebar to hilight home page selection
            $rootScope.$broadcast('update', "homePageLink");
            //create socket connection
            makeClient();
            
            
            
            startGame();
            //force disconnect when changing current route
            $scope.$on('$routeChangeStart', function (event) {
                       event.preventDefault();
                       
                       Client.notifyQuit();
                       makeClient();
            });
            
            initChat()
            
});

function initChat() 
{
      var clicked = false;
      var checked = null;
      game.notificationCount = 0; //different for both clients
      
      $('#inputBox').submit(function(){
                       console.log("Chat worked")
                       var message = $('#m').val()
                       console.log("Message: ", message) 
                       Client.chatMessage({"message": message, "user": null, "notificationCount": game.notificationCount});
                    //    game.notificationCount++;
                       // socket.emit('chat message', $('#m').val());
                       $('#m').val('');
                       return false;
                       });
      
      // $('.notif').on('change', function() {
      //     console.log("I CHANGED");
      // });
      
      $('.open').click(function(){
           // $('.open').style.height = "350px";
           if(checked == 'justClicked') {
           checked = 'clickAgain'
           }
           else if (checked == 'clickAgain') {
           clicked = false;
           }
           if(clicked == false) {
           // document.getElementById("open-box").style.height = "350px";
           document.getElementById("open-box").style.bottom = "350px";
           // document.getElementById("open-box").style.height = "50px";
           document.getElementById("box").style.height = "325px";
           document.getElementById("inputBox").style.visibility = "visible";
           document.getElementById("closeBox").style.visibility = "visible";
           clicked = true;
           if (document.getElementById("notifications").style.visibility == "visible") {
           document.getElementById("notifications").style.visibility = "hidden"; 
           }
           }
           // else{
           //     // console.log('poop')
           //     // document.getElementById("box").style.height = "20px";
           //     // document.getElementById("open").style.height = "30px";
           //     // document.getElementById("inputBox").style.visibility = "hidden";
           //     // document.getElementById("closeBox").style.visibility = "hidden";
           //     // clicked = false
           // }
           });
        document.getElementById("closeBox").onclick = function() {closeChat()};

            function closeChat() {
            if(clicked == true) {
            console.log("hola");
            document.getElementById("open-box").style.bottom = "0px";
            document.getElementById("box").style.height = "0px";
            // document.getElementById("open").style.height = "30px";
            document.getElementById("inputBox").style.visibility = "hidden";
            document.getElementById("closeBox").style.visibility = "hidden";
            // clicked = false;
            checked = 'justClicked'
            console.log("balls");
            game.notificationCount = 0
            // Client.updateNotificationCount({"notificationCount": notificationCount});
            }
        }
// $('.closeBox').click(function(){
//     console.log("hola")
//     // document.getElementById("box").style.height = "20px";
//     // document.getElementById("open").style.height = "30px";
//     // document.getElementById("inputBox").style.visibility = "hidden";
//     document.getElementById("closeBox").style.visibility = "hidden";
//     clicked = false
// });
}

