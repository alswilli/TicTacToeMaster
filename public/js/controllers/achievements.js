var challengePiece, challengeDraw, challengeLose, challengeOffline, challengeOnline;
var challengeO, challengeX, challengeMode;
var challengesRef;
angular.module('TicTacToeApp')
   .controller('AchievementsCtrl',
      function AchievmentsCtrl($scope, $rootScope) {
         'use strict';

         initSoundPrefs();
         playTheme("main");

         challengesRef = firebase.database().ref('/users/' + app.keyValue + '/challenges');
         initializeChallenge();
         //update siebar to hilight achievemnet page selection
         $rootScope.$broadcast('update', "achievementsLink");
      });



// function from https://jsfiddle.net/hibbard_eu/pxnZZ/
function animateProgressBar(el, width) {
   el.animate({
      width: width
   }, {
      duration: 2000,
      step: function (now, fx) {
         if (fx.prop == 'width') {
            el.html(Math.round(now * 100) / 100 + '%');
         }
      }
   });
}

function initializeChallenge() {

   challengesRef.once('value', function (snapshot) {

      //gets the reference for each data to read
      userChallenges = snapshot.val();

      challengePiece = userChallenges.piece;
      challengeDraw = userChallenges.draw;
      challengeLose = userChallenges.lose;
      challengeOffline = userChallenges.offline;
      challengeOnline = userChallenges.online;
      challengeO = userChallenges.o;
      challengeX = userChallenges.x;
      challengeMode = userChallenges.mode;
      challenge100TTT = userChallenges.win100TTT;
      challenge1003DT = userChallenges.win1003DT;
      challenge100OAC = userChallenges.win100OAC;
      challenge100ULT = userChallenges.win100ULT;

      console.log("challengePiece in: ", challengePiece);

      var challenge = document.getElementById('challengePiece');
      challenge.setAttribute('data-width', challengePiece);

      challenge = document.getElementById('challengeDraw');
      challenge.setAttribute('data-width', challengeDraw);

      challenge = document.getElementById('challengeLose');
      challenge.setAttribute('data-width', challengeLose);

      challenge = document.getElementById('challengeOffline');
      challenge.setAttribute('data-width', challengeOffline);

      challenge = document.getElementById('challengeOnline');
      challenge.setAttribute('data-width', challengeOnline);

      challenge = document.getElementById('challengeO');
      challenge.setAttribute('data-width', challengeO);

      challenge = document.getElementById('challengeX');
      challenge.setAttribute('data-width', challengeX);

      challenge = document.getElementById('challengeMode');
      challenge.setAttribute('data-width', challengeMode);

      challenge = document.getElementById('challenge100TTT');
      challenge.setAttribute('data-width', challenge100TTT);

      challenge = document.getElementById('challenge1003DT');
      challenge.setAttribute('data-width', challenge1003DT);

      challenge = document.getElementById('challenge100OAC');
      challenge.setAttribute('data-width', challenge100OAC);

      challenge = document.getElementById('challenge100ULT');
      challenge.setAttribute('data-width', challenge100ULT);


      $('.progress').each(function () {
         animateProgressBar($(this).find("div"), $(this).data("width"))
      });

   });


}
