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

   // Listen for form submit
   document.getElementById("emailForm").addEventListener('submit', passwordRetreival);

   //Submit email
   function passwordRetreival(event) {
      event.preventDefault();

      // Get email value
      var email = getInputVal('email');
      console.log(email);

      var inDB = false;

      var key;

      // Verify email: Send to next page if found, else, alert user no email found
      firebase.database().ref().child('users').orderByChild('email').equalTo(email).on("value", function (snapshot) {
         var key;
         console.log("snapshot.val", snapshot.val());
         snapshot.forEach(function (data) {
            key = data.key;
         })
         var foundEmail = (snapshot.val() != null) || 'Crap';
         console.log("foundEmail:", foundEmail);
         if (foundEmail != 'Crap') {
            alert("Email verified!");
            var inDB = true;
            document.location.href = "passwordRecoveryp2.html" + '#' + key;
         } else {
            alert("Email not found, please try again")
         }
      });

      var messagesRef = firebase.database().ref('forgotEmails');

      // Retrieves value for id passed
      function getInputVal(id) {
         return document.getElementById(id).value;
      }

      // Save message to firebase
      function saveEmail(email) {
         var newMessageRef = messagesRef.push();
         newMessageRef.set({
            email: email
         });
      }
   }
})
