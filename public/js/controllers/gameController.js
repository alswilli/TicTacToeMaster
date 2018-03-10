var root
angular.module('TicTacToeApp')
   .controller('GameCtrl',
      function GameCtrl($scope, $rootScope) {
         'use strict';

         initSoundPrefs();
         playTheme("game");

         app.numGames++
            if (app.numGames > MAX_GAME_NUM) {
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

function initChat() {
   var clicked = false;
   var checked = null;
   game.notificationCount = 0; //different for both clients

   $('#inputBox').submit(function () {
      var message = $('#m').val()
      Client.chatMessage({
         "message": message,
         "user": null,
         "notificationCount": game.notificationCount
      });
      $('#m').val('');
      return false;
   });


   $('.open').click(function () {
      if (checked == 'justClicked') {
         checked = 'clickAgain'
      } else if (checked == 'clickAgain') {
         clicked = false;
      }
      if (clicked == false) {
         document.getElementById("open-box").style.bottom = "350px";
         document.getElementById("box").style.height = "325px";
         document.getElementById("inputBox").style.visibility = "visible";
         document.getElementById("closeBox").style.visibility = "visible";
         clicked = true;
         if (document.getElementById("notifications").style.visibility == "visible") {
            document.getElementById("notifications").style.visibility = "hidden";
         }
      }

   });
   document.getElementById("closeBox").onclick = function () {
      closeChat()
   };

   function closeChat() {
      if (clicked == true) {
         document.getElementById("open-box").style.bottom = "0px";
         document.getElementById("box").style.height = "0px";
         document.getElementById("inputBox").style.visibility = "hidden";
         document.getElementById("closeBox").style.visibility = "hidden";
         
         checked = 'justClicked'
         game.notificationCount = 0

      }
   }

}
