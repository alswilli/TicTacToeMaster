$(document).ready(function() {

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

console.log("In Home Page");

var keyValue;
var nameOfUser;
var battleText;
var cashMoney;
var url;

var argumentVals = window.location.hash.split('&&');
console.log(argumentVals);

keyValue = argumentVals[1]; 
console.log(keyValue);
nameOfUser = argumentVals[2];

var dbRefObject = firebase.database().ref('/users/' + keyValue + '/username/');
                dbRefObject.set(
                    username
                );

console.log(nameOfUser);
battleText = argumentVals[3];

dbRefObject = firebase.database().ref('/users/' + keyValue + '/battleText/');
                dbRefObject.set(
                    battleText
                );

console.log(battleText);
cashMoney = argumentVals[4];

var dbRefObject = firebase.database().ref('/users/' + keyValue + '/cash/');
            dbRefObject.set(
                cashMoney
            );

console.log(cashMoney);
url = argumentVals[5];
console.log(url);
imageName = argumentVals[6];

if (imageName != 'null')
{
    dbRefObject = firebase.database().ref('/users/' + keyValue + '/image/');
                dbRefObject.set(
                    imageName
                );
}

console.log(imageName);

$( window ).on( "load", function() { 

    console.log("Poooooooop!!");

    document.getElementById('username').innerHTML = nameOfUser;
    document.getElementById('battleText').innerHTML = battleText;
    document.getElementById('cash').innerHTML = '$' + cashMoney;
    $('.image').attr('src', url);

    //Tic Tac Toe Original
    $('#tictactoeOriginal').on('click', function (e) {
        e.preventDefault();

        console.log("going to tictactoe original");

        window.location.href = "game.html" + '#&&' + keyValue + '&&' + nameOfUser + '&&' + battleText + '&&' + cashMoney + '&&' + url + '&&null';
        //window.location.href = "achievements.html?key="+keyValue+"&username="+nameOfUser+"&battleText="+battleText+"&cashMoney="+cashMoney+"&url="+url;
            
    });

    //Edit Profile
    $('#editProfile').on('click', function (e) {
        e.preventDefault();

        console.log("going to achievements");
        console.log("name: ", nameOfUser);
        console.log("battleText: ", battleText);
        console.log("cashMoney: ", cashMoney);
        console.log("url: ", url);

        // var argumentData = [keyValue, nameOfUser, battleText, cashMoney, urlVar];
        // console.log("arguments: ", argumentData);

        window.location.href = "editProfile.html" + '#&&' + keyValue + '&&' + nameOfUser + '&&' + battleText + '&&' + cashMoney + '&&' + url + '&&null';
        //window.location.href = "achievements.html?key="+keyValue+"&username="+nameOfUser+"&battleText="+battleText+"&cashMoney="+cashMoney+"&url="+url;
            
    });

    //Achievements
    $('#achievements').on('click', function (e) {
        e.preventDefault();

        console.log("going to achievements");
        console.log("name: ", nameOfUser);
        console.log("battleText: ", battleText);
        console.log("cashMoney: ", cashMoney);
        console.log("url: ", url);

        // var argumentData = [keyValue, nameOfUser, battleText, cashMoney, urlVar];
        // console.log("arguments: ", argumentData);

        window.location.href = "achievements.html" + '#&&' + keyValue + '&&' + nameOfUser + '&&' + battleText + '&&' + cashMoney + '&&' + url + '&&null';
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

        window.location.href = "customization.html" + '#&&' + keyValue + '&&' + nameOfUser + '&&' + battleText + '&&' + cashMoney + '&&' + url + '&&null';
    });

    //Leaderboard
    $('#leaderboard').on('click', function (e) {
        e.preventDefault();

        console.log("going to leaderboards");
        console.log("name: ", nameOfUser);
        console.log("battleText: ", battleText);
        console.log("cashMoney: ", cashMoney);
        console.log("url: ", url);

        window.location.href = "leaderboard.html" + '#&&' + keyValue + '&&' + nameOfUser + '&&' + battleText + '&&' + cashMoney + '&&' + url + '&&null';
    });
})

 //create firebase references
 var Auth = firebase.auth();
 var dbRef = firebase.database();
 var auth = null;

//  console.log("name: ", nameOfUser);
//  console.log("battleText: ", battleText);
//  console.log("cashMoney: ", cashMoney);
//  console.log("url: ", url);
 
// //Achievements
// $('#achievements').on('click', function (e) {
//     e.preventDefault();

//     console.log("going to achievements");
//     console.log("name: ", nameOfUser);
//     console.log("battleText: ", battleText);
//     console.log("cashMoney: ", cashMoney);
//     console.log("url: ", url);

//     window.location.href = "achievements.html" + '#' + keyValue + '#' + nameOfUser + '#' + battleText + '#' + cashMoney + '#' + url;
// });

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

