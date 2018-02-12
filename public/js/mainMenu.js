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

    var keyValue = localStorage.getItem("userKey");
    var nameOfUser = localStorage.getItem("username");
    var battleText = localStorage.getItem("battleText");
    var cashMoney = localStorage.getItem("cash");
    var url = localStorage.getItem("picURL");

    //var argumentVals = window.location.hash.split('&&');
    //console.log(argumentVals);

    /*keyValue = argumentVals[1];
    console.log(keyValue);
    nameOfUser = argumentVals[2];*/

    var dbRefObject = firebase.database().ref('/users/' + keyValue + '/username/');
                    dbRefObject.set(
                        nameOfUser
                    );

    /*console.log(nameOfUser);
    battleText = argumentVals[3];*/

    dbRefObject = firebase.database().ref('/users/' + keyValue + '/battleText/');
                    dbRefObject.set(
                        battleText
                    );

    /*console.log(battleText);
    cashMoney = argumentVals[4];*/

    var dbRefObject = firebase.database().ref('/users/' + keyValue + '/cash/');
                dbRefObject.set(
                    cashMoney
                );

    /*console.log(cashMoney);
    url = argumentVals[5];
    console.log(url);
    imageName = argumentVals[6];
    console.log(imageName);*/
                    
    imageName = localStorage.getItem("imageName")
    if (imageName != 'null')
    {
        dbRefObject = firebase.database().ref('/users/' + keyValue + '/image/');
                    dbRefObject.set(
                        imageName
                    );
    }

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
            localStorage.setItem("gameType", "original")
            window.location.href = "game.html";
            //window.location.href = "achievements.html?key="+keyValue+"&username="+nameOfUser+"&battleText="+battleText+"&cashMoney="+cashMoney+"&url="+url;         
        });
                
    //3D Tic Tac Toe
    $('#3dtictactoe').on('click', function (e) {
            e.preventDefault();
            
            console.log("going to 3d tictactoe");
            localStorage.setItem("gameType", "3d")
            window.location.href = "game.html";
            //window.location.href = "achievements.html?key="+keyValue+"&username="+nameOfUser+"&battleText="+battleText+"&cashMoney="+cashMoney+"&url="+url;                         
        });

        //Tic Tac Toe Original
    $('#orderChaos').on('click', function (e) {
            e.preventDefault();
        
            console.log("going to ordar and chaos");
            localStorage.setItem("gameType", "orderChaos")
            window.location.href = "game.html";
            //window.location.href = "game.html" + '#&&' + keyValue + '&&' + nameOfUser + '&&' + battleText + '&&' + cashMoney + '&&' + url  + '&&orderChaos';                   
        });

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

        //Achievements
        $('#achievements').on('click', function (e) {
            e.preventDefault();

            console.log("going to achievements");
            console.log("name: ", nameOfUser);
            console.log("battleText: ", battleText);
            console.log("cashMoney: ", cashMoney);
            console.log("url: ", url);

            window.location.href = "achievements.html"
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

