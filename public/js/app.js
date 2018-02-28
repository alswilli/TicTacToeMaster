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

var game = null;


/*
    app is the main object that controlls the website. The routeProvider controlls which page to 
    open when a certain href is linked to. The routeProvider specifies which html page to open
    on a given route and which controller to use. The controller is essentially the javascript 
    code that runs on a html page
 */
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
                   controllerAs: '/game',
                   }) 
           .otherwise({
                      redirectTo: '/home'
                      });
});

//save info in session storage if user logs out, reloads page, or closes page without loggin out
window.onbeforeunload = saveSessionInfo
//load values from sessionStorage
app.keyValue = sessionStorage.getItem("userkey");
app.username = sessionStorage.getItem("name");
app.img_url = sessionStorage.getItem("picUrl");
app.battleText = sessionStorage.getItem("battleText");
app.money = sessionStorage.getItem("cash");
app.gameType = sessionStorage.getItem("gametype");
app.selected = sessionStorage.getItem("selectedList");
userRef = firebase.database().ref('/users/' + app.keyValue);
//the controller for the sidebar. attaches a callback that updates the cash, username, and battletext on screen
app.controller('SidebarCtrl', function($scope) {
             //setSelected("homePageLink");
               $scope.$on('update', function(event, link) 
                {
                          //set username, battletext, and img_url
                          $scope.username = app.username;
                          $scope.img_url = app.img_url;
                          $scope.battleText = '"' + app.battleText + '"';
                          $scope.money = "$" +  app.money;
                          //update cash on screen
                          if(document.getElementById("cash"))
                            document.getElementById("cash").innerHTML = "$" + app.money;
                          if($("#player_img"))
                            $("#player_img").attr("src", app.img_url);
                          console.log("update dat user " + app.money)
                          setSelected(link);
                          });
               });


/*
    sets the selected tab on the sidebar, i.e puts a light blue bar over the current page
 */
function setSelected(selectedId)
{
    console.log(selectedId)
    if(!document.getElementById("links"))
        return
    var links = document.getElementById("links").children;
    for(var i = 0; i < links.length; i++)
    {
        links[i].style.backgroundColor = "";
    }
    
    
    document.getElementById(selectedId).style.backgroundColor = "#00b8e6";
}
/*
    called before leaving the page, in case user refreshes page
 */
function saveSessionInfo()
{
    console.log("beforeonunload")
    sessionStorage.setItem("userkey",  app.keyValue);
    sessionStorage.setItem("name", app.username);
    sessionStorage.setItem("picUrl", app.img_url);
    sessionStorage.setItem("battleText", app.battleText);
    sessionStorage.setItem("cash",app.money);
    sessionStorage.setItem("gametype", app.gameType);
		sessionStorage.setItem("selectedList",app.selected);
}

/*
    logs out user and redirects to login page
 */
function logout()
{
    firebase.auth().signOut()
    .then(function(authData) {
          console.log("Logged out successfully");
          window.location.href = "index.html";
          auth = authData;     
          })
    .catch(function(error) {
           console.log("Logout Failed!", error);
           });
}
