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

var keyValue = window.location.hash.substring(1)
var nameOfUser;

$( window ).on( "load", function() { 

    //var hola = 123456;

    // var dbRefObject = firebase.database().ref().child(keyValue);
    // dbRefObject.set({
    //      Hola: hola,
    //  });

    // firebase.database().ref('/users/' + userKey).once('value').then(function(snapshot) {
    //     userKey = (snapshot.val().username); 
    //     console.log("foundUser:", userKey);
    //     document.getElementById('username').innerHTML = userKey;
    // });


    if(keyValue != null){
        firebase.database().ref('/users/' + keyValue).once('value').then(function(snapshot) {
            nameOfUser = (snapshot.val().username);
            console.log("Image: ", nameOfUser);
            document.getElementById('username').innerHTML = nameOfUser;
            var battleText = (snapshot.val().battleText);
            console.log("Image: ", battleText);
            document.getElementById('battleText').innerHTML = battleText;
            // var img = "SiteImages/testAvatarImage.jpg";
            var img = (snapshot.val().image);
            console.log("Image: ", img);
            var cashMoney = (snapshot.val().cash);
            document.getElementById('cash').innerHTML = '$' + cashMoney;
            var url;
            
            //$scope.getImgUrl = function(file) {
                firebase.storage().ref(img).getDownloadURL().then(function(url) {
                $('.image').attr('src', url);
                  //return url;
                }).catch(function(error) {
                  // Handle any errors here
                });
         //}

    })};

    // var username = "Waluigi";
    // document.getElementById('username').innerHTML = username;
    // var battleText = "I am the best! Hah";
    // document.getElementById('battleText').innerHTML = battleText;
    // var img = "SiteImages/testAvatarImage.jpg";
    // $('.image').attr('src', img);
    // alert("Image isfd loaded");
})

 //create firebase references
 var Auth = firebase.auth();
 var dbRef = firebase.database();
 var auth = null;

 //Logout
 $('#logout').on('click', function (e) {
     e.preventDefault();

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

