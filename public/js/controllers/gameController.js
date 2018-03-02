var root
angular.module('TicTacToeApp')
.controller('GameCtrl',
            function GameCtrl ($scope, $rootScope ) {
            'use strict';
            
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
            
});
