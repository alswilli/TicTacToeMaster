$(document).ready(function () {
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

   // Initialize db vars
   var keyValue = window.location.hash.substring(1)
   var userSecQ;
   var userSecQAnswer;
   var userPassword;

   //look up the user's key, and once it is found, use the data for that user to get the
   //answer to security questions
   firebase.database().ref('/users/' + keyValue).once('value').then(function (snapshot) {
      userSecQ = (snapshot.val().secQ);
      console.log("foundUser:", userSecQ);
      document.getElementById('secQ').innerHTML = userSecQ;
   });

   //add a listener, that calls secQVerification() when the element with id "secQForm" is submitted
   document.getElementById("secQForm").addEventListener('submit', secQVerification);

   //Submit email
   function secQVerification(event) {
      event.preventDefault();

      // Get answer value
      var answer = getInputVal('answer');


      /*LOOKUP USER, find a user with the given keyvalue, then check if answers match */
      firebase.database().ref('/users/' + keyValue).once('value').then(function (snapshot) {
         userSecQAnswer = (snapshot.val().secQAnswer);
         userPassword = (snapshot.val().password);
         console.log("foundUser:", userSecQAnswer);
         if (answer == userSecQAnswer) {
            alert("Correct Answer!")


            document.location.href = "passwordRecoveryp3.html" + '#' + keyValue;

            return true;
         } else {
            alert("Wrong Answer! Please try again")
         }
      });

   }

   // Retrieves value for id passed
   function getInputVal(id) {
      return document.getElementById(id).value;
   }
})
