var root
angular.module('TicTacToeApp')
.controller('GameCtrl',
            function HomeCtrl ($scope, $rootScope ) {
            'use strict';
            
            root = $rootScope;
            
            $rootScope.$broadcast('update', "homePageLink");
});
 
