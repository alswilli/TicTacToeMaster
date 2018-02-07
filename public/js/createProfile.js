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

//create firebase references
var Auth = firebase.auth();
var dbRef = firebase.database();
var contactsRef = dbRef.ref('contacts')
var usersRef = dbRef.ref('users')
var auth = null;

var e = document.getElementById("secQ");
var secQ = e.options[e.selectedIndex].text; 

//Register
$('#btn-submit').on('click', function (e) {
    e.preventDefault();

    // Get image ref
    const storageRef = firebase.storage().ref();

    const file = document.querySelector('#profile_image').files[0];

    if(file === undefined)
    {
        alert("Image file invalid, please enter a valid image!");
        console.log("penios");
        //break;
    }
    else{
        console.log("file: ", file);

        var imageName;

        const name = (+new Date()) + '-' +file.name;
        console.log("name: ", name);

        const metadata = {
            contentType: file.type
        };
        const task = storageRef.child(name).put(file, metadata);
        imageName = name;
        
        task.then((snapshot) => {
            const url = snapshot.downloadURL;
            console.log(name);
            console.log(imageName);
        }).catch((error) => {
            console.error(error);
        });

        var data = {
            image: imageName,
            email: $('#email').val(), //get the email from Form
            username: $('#username').val(), //get username
            password: $('#password').val(), //get password
            battleText: $('#battleText').val(), //get battle text
            secQ: secQ,
            secQAnswer: $('#secQAnswer').val(),
            cash: 0
    
    
        };
        
        if (data.email != '' && data.password != '') {
                //create the user
    
            firebase.auth()
              .createUserWithEmailAndPassword(data.email, data.password)
              .then(function (user) {
                  //now user is needed to be logged in to save data
                  console.log("Authenticated successfully with payload:", user);
                  alert("User profile created!");
                  auth = user;
                  //now saving the profile data
                  usersRef
                    .child(user.uid)
                    .set(data)
                    .then(function () {
                        console.log("User Information Saved:", user.uid);
                        document.location.href = "index.html";
                    })
    
              .catch(function (error) {
                  console.log("Error creating user:", error);
              });
              });
            }
    }   
});

$(function(){
    $('#profile_image').change( function(e) {
        
        var img = URL.createObjectURL(e.target.files[0]);
        $('.image2').attr('src', img);
    });
});

// // Listen for form submit
// document.getElementById("userInputForm").addEventListener('submit', submitUserData);

// //Submit email
// function submitUserData(event){
//     console.log("Hiya");
//     //alert("Email verified: Password Token sent!")
//     event.preventDefault();

//     const storageRef = firebase.storage().ref();

//     const file = document.querySelector('#profile_image').files[0];

//     var imageName;

//     const name = (+new Date()) + '-' +file.name;
//     const metadata = {
//         contentType: file.type
//     };
//     const task = storageRef.child(name).put(file, metadata);
//     imageName = name;
//     console.log(imageUrl);
    
//     task.then((snapshot) => {
//         const url = snapshot.downloadURL;
//         console.log(name);
//         console.log(imageName);
//     }).catch((error) => {
//         console.error(error);
//     });

//     // console.log(image);
//     var username = getInputVal('username');
//     console.log(username);
//     var email = getInputVal('email');
//     console.log(email);
//     var password = getInputVal('password');
//     console.log(password);
//     var battleText = getInputVal('battleText');
//     console.log(battleText);
//     var e = document.getElementById("secQ");
//     var secQ = e.options[e.selectedIndex].text; 
//     console.log(secQ);
//     var secQAnswer = getInputVal('secQAnswer');
//     console.log(secQAnswer);

//     // const preUsers = document.getElementById('users');
//     // var dbRefObject = firebase.database().ref().child('users');
//     // //dbRefObject.add
//     // dbRefObject.update({
//     //             image: image,
//     //             username: username,
//     //             email: email,
//     //             password: password,
//     //             battleText: battleText,
//     //             //seQ: secQ,
//     //             secQAnswer: secQAnswer
//     //         });
//     //var uid = uid;


//     var postData = {
//                 image: imageName,
//                 //imageUrl: imageUrl,
//                 username: username,
//                 email: email,
//                 //uid: uid,
//                 password: password,
//                 battleText: battleText,
//                 seQ: secQ,
//                 secQAnswer: secQAnswer
//             };
    
//     var newPostKey = firebase.database().ref().child('users').push().key;

//     var updates = {};
//     updates['/users/' + newPostKey] = postData;
//     //updates['/user-posts/' + uid + '/' + newPostKey] = postData;

//     firebase.database().ref().update(updates);
// }

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
