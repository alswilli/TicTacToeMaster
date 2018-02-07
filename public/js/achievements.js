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

    //get a specific user's key
    var keyValue = window.location.hash.substring(1)

    //get data from that specific user
    var userSecQ;


    /*LOOKUP USER, find a user with the given keyvalue, then do something with the data */
    firebase.database().ref('/users/' + keyValue + '/challenges/').once('value').then(function (snapshot) {
        userSecQ = (snapshot.val().secQ);
        console.log("foundUser:", userSecQ);

    });




    var bar1 = document.getElementById('bar1');
    bar1.setAttribute('data-width', '50%');

    

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
    $('.progress').each(function () {
        animateProgressBar($(this).find("div"), $(this).data("width"))
    });



    console.log("In achievements");

    var argumentVals = window.location.hash.split('&&');
    console.log(argumentVals);
    
    var keyValue = argumentVals[1]; 
    console.log(keyValue);
    var nameOfUser = argumentVals[2];
    console.log(nameOfUser);
    var battleText = argumentVals[3];
    console.log(battleText);
    var cashMoney = argumentVals[4];
    console.log(cashMoney);
    var url = argumentVals[5];
    console.log(url);
    
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

            // var argumentData = [keyValue, nameOfUser, battleText, cashMoney, urlVar];
            // console.log("arguments: ", argumentData);

            window.location.href = "editProfile.html" + '#&&' + keyValue + '&&' + nameOfUser + '&&' + battleText + '&&' + cashMoney + '&&' + url + '&&null';
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

            // var argumentData = [keyValue, nameOfUser, battleText, cashMoney, urlVar];
            // console.log("arguments: ", argumentData);

            window.location.href = "mainMenu.html" + '#&&' + keyValue + '&&' + nameOfUser + '&&' + battleText + '&&' + cashMoney + '&&' + url + '&&null';
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
    
    