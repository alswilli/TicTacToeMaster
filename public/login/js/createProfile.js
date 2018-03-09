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
            cash: 0,
            selected: "000"
        };

        var achievements = {
            draw: '0%',
            lose: '0%',
            mode: '0%',
            o: '0%',
            offline: '0%',
            online: '0%',
            piece: '0%',
            x: '0%',
            win100TTT: '0',
            win1003DT: '0',
            win100OAC: '0',
            win100ULT: '0'
        };

        var customization = {
            background: "1000",
            board: "1000",
            piece: "1000"
        };
        
        var initStats = { 
           win:      0,
           lose:     0,
           draw:     0,
           rating:   1200,
           username: data.username
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
                        document.location.href = "../../index.html";
                    })
    
              .catch(function (error) {
                  console.log("Error creating user:", error);
              });

                  usersRef.child(user.uid).child("challenges").set(achievements);

                  usersRef.child(user.uid).child("unlocked").set(customization);
                  
                  //Initialize the wins and losses in the leaderboard for the player
                  dbRef.ref('leaderboard/3DT'+'/'+user.uid).set(initStats);
                  dbRef.ref('leaderboard/OAC'+'/'+user.uid).set(initStats);
                  dbRef.ref('leaderboard/TTT'+'/'+user.uid).set(initStats);
                  dbRef.ref('leaderboard/ULT'+'/'+user.uid).set(initStats);
              });
            }
    }   
});

$(function(){
    $('#profile_image').change( function(e) {
        
        var img = URL.createObjectURL(e.target.files[0]);
        $('.image').attr('src', img);
    });
});

function getInputVal(id){
    return document.getElementById(id).value;
}

function passwordRetrieval(){
    if (true) {
        var con=confirm("Email verified: Password Token sent!");
    } else {
        var con2=confirm("Email invalid: Please try again");   
    }
}









