$(document).ready(function() {

    MYAPP = {};
 
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
   function passwordRetreival(event){
       //alert("Email verified: Password Token sent!")
       event.preventDefault();
   
       // Get email value
       var email = getInputVal('email');
       console.log(email);
   
       //var crapola = false;
       var inDB = false;

       var key;
   
       //firebase.database().ref('/users/email/').once('value').then(function(snapshot) {
       firebase.database().ref().child('users').orderByChild('email').equalTo(email).on("value", function(snapshot) {
       //console.log("Balls", firebase.database().ref().child('users').orderByChild('email').equalTo(email));
       //firebase.database().ref().child('users').orderByChild('email').equalTo(email).once('value').then(function(snapshot) {
           console.log("snapshot.val", snapshot.val());
           snapshot.forEach(function(data){
               console.log(data.key);
               key = data.key;
               var dbRefObject = firebase.database().ref();
               dbRefObject.update({
                    key: key,
                });
                console.log("Hello");
               //localStorage.setItem("key", key);
            //    localStorage.setItem("key", key);
            //    console.log("Key: ", localStorage.getItem("key"));
            //    window.onload = function(){
            //        localStorage.setItem("key", key);
            //        console.log("Key: ", localStorage.getItem("key"));
            //    }
           })
           //console.log(snapshot.val().child('email'));
           var foundEmail = (snapshot.val() != null) || 'Crap'; 
           console.log("foundEmail:", foundEmail);
           if(foundEmail != 'Crap'){    
            alert("Email verified!");
            var inDB = true;
            // var demo = 123;
            // document.getElementById('myLink').setAttribute('href', 'somelink.php?demo=' + demo);
            document.location.href = "passwordRecoveryp2.html";
           }
           //$('emailForm').attr('action') = "passwordRecoveryp2.html";
           //document.getElementById("emailForm").action = "passwordRecoveryp2.html";
           //document.getElementById("emailForm").action.submit();
           //return true;
           
           else {
                   alert("Email not found, please try again")
               }
               //crapola = true;
   
       });
   
    //    if(inDB == false) {
    //        alert("Email not found, please try again");
    //    }
   
       //document.getElementById("emailForm").action = "index.html";
   
       // if(crapola == true) {
       //     alert("Email verified!")
       //     document.location.href = "passwordRecoveryp2.html";
       //     //$('emailForm').attr('action') = "passwordRecoveryp2.html";
       //     //document.getElementById("emailForm").action = "passwordRecoveryp2.html";
       //     //document.getElementById("emailForm").action.submit();
       //     //return true;
       // }
       // else {
       //     alert("Email not found, please try again")
       // }
   }
   
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
}) 