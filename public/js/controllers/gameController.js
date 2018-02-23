var root
angular.module('TicTacToeApp')
.controller('GameCtrl',
            function GameCtrl ($scope, $rootScope ) {
            'use strict';
            
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
