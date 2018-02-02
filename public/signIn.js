$(document).ready(function(){
    //need "<script src="https://www.gstatic.com/firebasejs/4.9.0/firebase.js"></script>" in html header
    //initialize firebase

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
 var auth = null;

// const preUsers = document.getElementById('users');
// var dbRefObject = firebase.database().ref().child('users');
// dbRefObject.set({
//           email: 'poop'
//       });
// dbRefObject.on('value', snap => console.log(snap.val()));

 //Login
 $('#login').on('click', function (e)
                {
                  var isValidated = false;
                  e.preventDefault();
                  
                  if( $('#loginEmail').val() != '' && $('#loginPassword').val() != '' ){
                  //login the user
                      var data ={
                          email: $('#username').val(),
                          password: $('#password').val()
                      };
                      firebase.auth().signInWithEmailAndPassword(data.email, data.password)
                      .then(function(authData) {
                            console.log("Authenticated successfully");
                            // const preUsers = document.getElementById('users');
                            // var dbRefObject = firebase.database().ref().child('users');
                            // dbRefObject.set({
                            //            email: data.email
                            //        });
                            console.log("pee");
                            // TO-DO: Something that Austin did so it wouldn't fluke before refreshing
                            isValidated = true;
                            auth = authData;
                            console.log("cock");
                            var text = firebase.auth().currentUser.uid;
                            console.log(text);
                            if(isValidated == true){
                                window.location.href = "mainMenu.html" + '#' + text;
                                console.log("hola");
                            }
                             // Save message to firebase

                            //  var newUserRef = emailRef.push();
                            //  newUserRef.set({
                            //      email: data.email
                            //  });
                            //$('#messageModalLabel').html(spanText('Success!', ['center', 'success']))
                            
                            })
                      .catch(function(error) {
                             $('#error').css("visibility", "visible")
                             console.log("Login Failed!", error);
                             //$('#messageModalLabel').html(spanText('ERROR: '+error.code, ['danger']))
                             });
                      }
                    // console.log("cock");
                    // if(isValidated == true){
                    //     window.location.href = "mainMenu.html";
                    //     console.log("hola");
                    // }
    });
 
$('#guestlogin').on('click', function (e){
    e.preventDefault();
    window.location.href = "mainMenu.html";
})

})



