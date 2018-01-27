// Listen for form submit
document.getElementById("emailForm").addEventListener('submit', passwordRetreival);

//Submit email
function passwordRetreival(event){
    //alert("Email verified: Password Token sent!")
    event.preventDefault();

    // Get email value
    var email = getInputVal('email');
    console.log(email);

    //document.getElementById("emailForm").action = "index.html";

    if (true) {
        alert("Email verified: Password Token sent!")
        document.location.href = "passwordRecoveryp2.html";
        //$('emailForm').attr('action') = "passwordRecoveryp2.html";
        //document.getElementById("emailForm").action = "passwordRecoveryp2.html";
        //document.getElementById("emailForm").action.submit();
        return true;
    }
    else {

    }
}

 
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

// Reference forgotEmails collection
var messagesRef = firebase.database().ref('forgotEmails');

// // Listen for form submit
// document.getElementById("emailForm").addEventListener('submit', passwordRetreival);

// //Submit email
// function passwordRetreival(event){
//     alert("Email verified: Password Token sent!")
//     e.preventDefault();

//     // Get email value
//     var email = getInputVal('email');
//     console.log(email);

//     // Save message
//     saveEmail(email);

//     if (true) {
//         alert("Email verified: Password Token sent!")
//     }
//     else {

//     }
// }

function getInputVal(id){
    return document.getElementById(id).value;
}

// Save message to firebase
function saveEmail(email){
    var newMessageRef = messagesRef.push();
    newMessageRef.set({
        email: email
    });
}