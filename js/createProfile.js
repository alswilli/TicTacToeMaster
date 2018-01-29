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

$(function(){
    $('#profile_image').change( function(e) {
        
        var img = URL.createObjectURL(e.target.files[0]);
        $('.image').attr('src', img);
    });
});

// Listen for form submit
document.getElementById("userInputForm").addEventListener('submit', submitUserData);

//Submit email
function submitUserData(event){
    console.log("Hiya");
    //alert("Email verified: Password Token sent!")
    event.preventDefault();

    // Get email value
    // var image = getInputVal('profile_image');
    var image = document.getElementById('profile_image').src;
    // console.log(image);
    var username = getInputVal('username');
    console.log(username);
    var email = getInputVal('email');
    console.log(email);
    var password = getInputVal('password');
    console.log(password);
    var battleText = getInputVal('battleText');
    console.log(battleText);
    // var secQ = getInputVal('secQ');
    // console.log(email);
    var secQAnswer = getInputVal('secQAnswer');
    console.log(secQAnswer);

    // const preUsers = document.getElementById('users');
    // var dbRefObject = firebase.database().ref().child('users');
    // //dbRefObject.add
    // dbRefObject.update({
    //             image: image,
    //             username: username,
    //             email: email,
    //             password: password,
    //             battleText: battleText,
    //             //seQ: secQ,
    //             secQAnswer: secQAnswer
    //         });
    //var uid = uid;


    var postData = {
                image: image,
                username: username,
                email: email,
                //uid: uid,
                password: password,
                battleText: battleText,
                //seQ: secQ,
                secQAnswer: secQAnswer
            };
    
    var newPostKey = firebase.database().ref().child('users').push().key;

    var updates = {};
    updates['/users/' + newPostKey] = postData;
    //updates['/user-posts/' + uid + '/' + newPostKey] = postData;

    firebase.database().ref().update(updates);
}

function getInputVal(id){
    // if(id == 'profile_image')
    // {
    //     document.getElementById(id).src;
    // }
    return document.getElementById(id).value;
}

function passwordRetrieval(){
    if (true) {
        var con=confirm("Email verified: Password Token sent!");
    } else {
        var con2=confirm("Email invalid: Please try again");   
    }
}
