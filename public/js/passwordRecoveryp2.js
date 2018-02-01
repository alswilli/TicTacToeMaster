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
                  
                  var keyValue = window.location.hash.substring(1)
                  var userSecQ;
                  var userSecQAnswer;
                  var userPassword;
                  
                  /*firebase.database().ref('/users/' + keyValue).once('value').then(function(snapshot) {
                        //keyValue = (snapshot.val());
                        //console.log("foundKey:", keyValue);
                        //console.log('/users/' + keyValue);*/
                        firebase.database().ref('/users/' + keyValue).once('value').then(function(snapshot) {
                             userSecQ = (snapshot.val().secQ);
                             console.log("foundUser:", userSecQ);
                             document.getElementById('secQ').innerHTML = userSecQ;
                             });
                        //});
                  
                  //console.log('/users/' + keyValue);
                  
                  //document.getElementById('secQ').innerHTML = "Who is your favorite actor/actress?";
                  
                  // Listen for form submit
                  document.getElementById("secQForm").addEventListener('submit', secQVerification);
                  
                  //Submit email
                  function secQVerification(event){
                  event.preventDefault();
                  
                  // Get answer value
                  var answer = getInputVal('answer');
                  console.log(answer);
                  
                  
                  console.log(keyValue)
                  firebase.database().ref('/users/' + keyValue).once('value').then(function(snapshot) {
                       userSecQAnswer = (snapshot.val().secQAnswer);
                       userPassword = (snapshot.val().password);
                       console.log("foundUser:", userSecQAnswer);
                       if (answer == userSecQAnswer) {
                       alert("Correct Answer!")
                       /*var dbRefObject = firebase.database().ref();
                       dbRefObject.update({
                                          key: userPassword,
                                          });*/
                       
                       document.location.href = "passwordRecoveryp3.html" + '#' + keyValue;
                       //$('emailForm').attr('action') = "passwordRecoveryp2.html";
                       //document.getElementById("emailForm").action = "passwordRecoveryp2.html";
                       //document.getElementById("emailForm").action.submit();
                       return true;
                       }
                       else {
                       alert("Wrong Answer! Please try again")
                       }
                       });

                  
                 /* firebase.database().ref('key').once('value').then(function(snapshot) {
                        keyValue = (snapshot.val());
                        console.log("foundKey:", keyValue);
                        console.log('/users/' + keyValue);
                                                });*/
                  
                  // if (true) {
                  //     alert("Correct Answer!")
                  //     document.location.href = "passwordRecoveryp3.html";
                  //     //$('emailForm').attr('action') = "passwordRecoveryp2.html";
                  //     //document.getElementById("emailForm").action = "passwordRecoveryp2.html";
                  //     //document.getElementById("emailForm").action.submit();
                  //     return true;
                  // }
                  // else {
                  
                  // }
                  }
                  
                  function getInputVal(id){
                  return document.getElementById(id).value;
                  }
                  })
