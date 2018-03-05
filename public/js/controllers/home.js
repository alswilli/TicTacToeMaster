angular.module('TicTacToeApp')
.controller('HomeCtrl',
            function HomeCtrl ($scope, $rootScope, $window ) {
            'use strict';
            //update siebar to hilight home page selection
            $rootScope.$broadcast('update', "homePageLink");
            //add onclick listeners ot every game button
            $('#3dtictactoe').on('click', function (e) {
                 e.preventDefault();
                 
                 app.gameType = "3d";
                 sessionStorage.setItem("gameType", "3d")
                 $window.location.href = "#/game";
                                 
            });
            $('#orderChaos').on('click', function (e) {
                e.preventDefault();
                
                app.gameType = "orderChaos";
                sessionStorage.setItem("gameType", "orderChaos")
                $window.location.href = "#/game";
                                
            });
            $('#tictactoeOriginal').on('click', function (e) {
               e.preventDefault();
               
               app.gameType = "original";
               sessionStorage.setItem("gameType", "original")
                                       console.log(app.gameType)
               $window.location.href = "#/game";
                                       
            });
            $('#ultimate').on('click', function (e) {
              e.preventDefault();
              
              app.gameType = "ultimate";
              sessionStorage.setItem("gameType", "ultimate")
              $window.location.href = "#/game";
                              
            });
});
