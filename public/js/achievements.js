var challengesRef; //The firebase reference to the unlocked section of each user
var userChallenges; //The object that stores each item's unlock status
//The string that have the completion percentage of each challange
var challengePiece, challengeDraw, challengeLose, challengeOffline, challengeOnline; 
var challengeO, challengeX, challengeMode;

$(document).ready(function () {

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

    
    console.log("In achievements");

    var keyValue = sessionStorage.getItem("userkey");
    var nameOfUser = sessionStorage.getItem("username");
    var battleText = sessionStorage.getItem("battleText");
    var cashMoney = sessionStorage.getItem("cash");
    var url = sessionStorage.getItem("picURL");
    

    challengesRef = firebase.database().ref('/users/' + keyValue + '/challenges');
    initializeChallenge();

    console.log("challengePiece out: ", challengePiece);

    $( window ).on( "load", function() { 

        console.log("Poooooooop!!");

        document.getElementById('username').innerHTML = nameOfUser;
        document.getElementById('battleText').innerHTML = battleText;
        document.getElementById('cash').innerHTML = '$' + cashMoney;
        $('.image').attr('src', url);

        //Edit Profile
        $('#editProfile').on('click', function (e) {
            e.preventDefault();

            console.log("going to achievements");
            console.log("name: ", nameOfUser);
            console.log("battleText: ", battleText);
            console.log("cashMoney: ", cashMoney);
            console.log("url: ", url);

            window.location.href = "editProfile.html"
            //window.location.href = "achievements.html?key="+keyValue+"&username="+nameOfUser+"&battleText="+battleText+"&cashMoney="+cashMoney+"&url="+url;
            
        });

        //Home Page
        $('#homePage').on('click', function (e) {
            e.preventDefault();

            console.log("going to achievements");
            console.log("name: ", nameOfUser);
            console.log("battleText: ", battleText);
            console.log("cashMoney: ", cashMoney);
            console.log("url: ", url);

            window.location.href = "mainMenu.html"
            //window.location.href = "achievements.html?key="+keyValue+"&username="+nameOfUser+"&battleText="+battleText+"&cashMoney="+cashMoney+"&url="+url;
            
        });

        //Customization
        $('#customization').on('click', function (e) {
            e.preventDefault();

            console.log("going to customization");
            console.log("name: ", nameOfUser);
            console.log("battleText: ", battleText);
            console.log("cashMoney: ", cashMoney);
            console.log("url: ", url);

            window.location.href = "customization.html"
        });

        //Leaderboard
        $('#leaderboard').on('click', function (e) {
            e.preventDefault();

            console.log("going to leaderboards");
            console.log("name: ", nameOfUser);
            console.log("battleText: ", battleText);
            console.log("cashMoney: ", cashMoney);
            console.log("url: ", url);

            window.location.href = "leaderboard.html"
        });
    
    })
    //create firebase references
    var Auth = firebase.auth();
    var dbRef = firebase.database();
    var auth = null;

    //Logout
    $('#logout').on('click', function (e) {
        e.preventDefault();

        console.log("loggin out");

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
    });
})

// function from https://jsfiddle.net/hibbard_eu/pxnZZ/
function animateProgressBar(el, width) {
    el.animate(
        { width: width },
        {
            duration: 2000,
            step: function (now, fx) {
                if (fx.prop == 'width') {
                    el.html(Math.round(now * 100) / 100 + '%');
                }
            }
        }
    );
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


        $('.progress').each(function () {
            animateProgressBar($(this).find("div"), $(this).data("width"))
        });

    });


}
    
    
