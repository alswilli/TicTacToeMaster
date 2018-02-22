/*sessionStorage.setItem("name", "smitty");
sessionStorage.setItem("picUrl", "https://firebasestorage.googleapis.com/v0/b/tictactoemaster-b46ab.appspot.com/o/1517607600847-OwlWingUp.png?alt=media&token=5c8f19ff-d2b2-490e-85c6-759b3dcec9e5");
sessionStorage.setItem("cash", "100");
sessionStorage.setItem("battleText", "get rekt");*/

// Initialize Firebase
var config = {
apiKey: "AIzaSyARQqkwmw-yDfR4Fl7eyDSs464kPyDTWpo",
authDomain: "tictactoemaster-b46ab.firebaseapp.com",
databaseURL: "https://tictactoemaster-b46ab.firebaseio.com",
projectId: "tictactoemaster-b46ab",
storageBucket: "tictactoemaster-b46ab.appspot.com",
messagingSenderId: "1050901435462"
};
firebase.initializeApp(config);


console.log("here we go");


var app = angular.module('TicTacToeApp', ['ngRoute']).config(function ($routeProvider) 
{
           $routeProvider
           .when('/home', {
                 templateUrl: 'views/gameList.html',
                 controller: 'HomeCtrl',
                 controllerAs: 'home'
                 })
           .when('/editProfile', {
                 templateUrl: 'views/editProfile.html',
                 controller: 'EditProfileCtrl',
                 controllerAs: 'editProfile'
                 })
            .when('/achievements', {
                   templateUrl: 'views/achievements.html',
                   controller: 'AchievementsCtrl',
                   controllerAs: '/achievements'
                   })
            .when('/customization', {
                   templateUrl: 'views/customization.html',
                   controller: 'CustomizationCtrl',
                   controllerAs: '/customization'
                   })  
            .when('/leaderboard', {
                   templateUrl: 'views/leaderboard.html',
                   controller: 'LeaderboardCtrl',
                   controllerAs: '/leaderboard'
                   }) 
             .when('/game', {
                   templateUrl: 'views/game.html',
                   controller: 'GameCtrl',
                   controllerAs: '/game'
                   }) 
           .otherwise({
                      redirectTo: '/home'
                      });
});

window.onbeforeunload = saveSessionInfo

app.keyValue = sessionStorage.getItem("userkey")
app.username = sessionStorage.getItem("name");
app.img_url = sessionStorage.getItem("picUrl");
app.battleText = sessionStorage.getItem("battleText");
app.money = sessionStorage.getItem("cash");
app.gameType = sessionStorage.getItem("gametype");
userRef = firebase.database().ref('/users/' + app.keyValue);

app.controller('SidebarCtrl', function($scope) {
             //setSelected("homePageLink");
               $scope.$on('update', function(event, link) {
                          $scope.username = app.username;//sessionStorage.getItem("name");
                          $scope.img_url = app.img_url;//sessionStorage.getItem("picUrl");
                          $scope.battleText = '"' + app.battleText + '"';
                          $scope.money = "$" +  app.money;//sessionStorage.getItem("cash");
                          if(document.getElementById("cash"))
                            document.getElementById("cash").innerHTML = "$" + app.money;
                          console.log("update dat user " + app.money)
                          setSelected(link);
                          });
               });

function setSelected(selectedId)
{
    console.log(selectedId)
    if(!document.getElementById("links"))
        return
    var links = document.getElementById("links").children;
    console.log(links);
    console.log(selectedId);
    for(var i = 0; i < links.length; i++)
    {
        links[i].style.backgroundColor = "";
    }
    //document.getElementById(selectedId).style.backgroundColor = "yellow";
    console.log(links);
    document.getElementById(selectedId).style.backgroundColor = "#00b8e6";
}

function saveSessionInfo()
{
    console.log("beforeonunload")
    sessionStorage.setItem("userkey",  app.keyValue)
    sessionStorage.setItem("name", app.username)
    sessionStorage.setItem("picUrl", app.img_url);
    sessionStorage.setItem("battleText", app.battleText);
    sessionStorage.setItem("cash",app.money);
    sessionStorage.setItem("gametype", app.gameType);
}

function logout()
{
    firebase.auth().signOut()
    .then(function(authData) {
          console.log("Logged out successfully");
          window.location.href = "index.html";
          auth = authData;
          //$('#messageModalLabel').html(spanText('Success!', ['center', 'success']))     
          })
    .catch(function(error) {
           console.log("Logout Failed!", error);
           //$('#messageModalLabel').html(spanText('ERROR: '+error.code, ['danger']))
           });
}
