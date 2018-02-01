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

$( window ).on( "load", function() { 

    var hola = 123456;

    var dbRefObject = firebase.database().ref().child('key');
    dbRefObject.set({
         Hola: hola,
     });

    var user = firebase.auth().currentUser;
    console.log(firebase.auth().currentUser);

    // firebase.database().ref('/users/' + userKey).once('value').then(function(snapshot) {
    //     userKey = (snapshot.val().username); 
    //     console.log("foundUser:", userKey);
    //     document.getElementById('username').innerHTML = userKey;
    // });

    var nameOfUser;

    if(user != null){
        nameOfUser = user.username;
        console.log(user.username);
        document.getElementById('username').innerHTML = nameOfUser;
    }

    // var username = "Waluigi";
    // document.getElementById('username').innerHTML = username;
    var battleText = "I am the best! Hah";
    document.getElementById('battleText').innerHTML = battleText;
    var img = "SiteImages/testAvatarImage.jpg";
    $('.image').attr('src', img);
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

