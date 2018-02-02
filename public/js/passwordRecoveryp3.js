$(document).ready(function() {
                  
                  //window.onload = alert(localStorage.getItem("key"));
                  
                  //console.log(MYAPP.key);
                  
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
                  
                  var passwordVal;
                  var keyVal = window.location.hash.substring(1)
                  firebase.database().ref('/users/' + keyVal).once('value').then(function(snapshot) {
                        passwordVal = (snapshot.val().password);
                        console.log("foundKey:", passwordVal);
                        document.getElementById('display').innerHTML = passwordVal;
                        
                        // function showPassword() {
                        //     document.getElementById('display').innerHTML = "bobbob";
                        //                // document.getElementById("user_input").value; //essentiallu change this to DB data
                        // }
                        
                        })
                  
})
