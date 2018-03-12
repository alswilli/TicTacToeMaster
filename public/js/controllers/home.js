angular.module('TicTacToeApp')
   .controller('HomeCtrl',
      function HomeCtrl($scope, $rootScope, $window) {
         'use strict';

         initSoundPrefs();
         playTheme("main");

         //update siebar to hilight home page selection
         $rootScope.$broadcast('update', "homePageLink");

         //onclick listeners at every game button used for starting the correct game in game.js
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
            $window.location.href = "#/game";

         });
         $('#ultimate').on('click', function (e) {
            e.preventDefault();

            app.gameType = "ultimate";
            sessionStorage.setItem("gameType", "ultimate")
            $window.location.href = "#/game";

         });
      });
