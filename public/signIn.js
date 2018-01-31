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
 
  
 //Login
 $('#login').on('click', function (e)
                {
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
                            window.location.href = "mainMenu.html";
                            auth = authData;
                            //$('#messageModalLabel').html(spanText('Success!', ['center', 'success']))
                            
                            })
                      .catch(function(error) {
                             $('#error').css("visibility", "visible")
                             console.log("Login Failed!", error);
                             //$('#messageModalLabel').html(spanText('ERROR: '+error.code, ['danger']))
                             });
                      }
    });
    
     
 })

