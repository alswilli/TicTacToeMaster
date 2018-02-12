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

    console.log("In leaderboards");

    var keyValue = localStorage.getItem("userKey");
    var nameOfUser = localStorage.getItem("username");
    var battleText = localStorage.getItem("battleText");
    var cashMoney = localStorage.getItem("cash");
    var url = localStorage.getItem("picURL");
    
    $( window ).on( "load", function() { 

        document.getElementById('username').innerHTML = nameOfUser;
        document.getElementById('battleText').innerHTML = battleText;
        document.getElementById('cash').innerHTML = '$' + cashMoney;
        $('.image').attr('src', url);

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

            console.log("going to customization");
            console.log("name: ", nameOfUser);
            console.log("battleText: ", battleText);
            console.log("cashMoney: ", cashMoney);
            console.log("url: ", url);

            window.location.href = "achievements.html"
        });

        //Customization
        $('#customization').on('click', function (e) {
            e.preventDefault();

            console.log("going to leaderboards");
            console.log("name: ", nameOfUser);
            console.log("battleText: ", battleText);
            console.log("cashMoney: ", cashMoney);
            console.log("url: ", url);

            window.location.href = "customization.html"
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
