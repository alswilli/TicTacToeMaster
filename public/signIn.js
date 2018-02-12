$(document).ready(function(){

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

 var keyValue;
 var nameOfUser;
 var battleText;
 var cashMoney;
 var urlVal;

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
            
            // TO-DO: Something that Austin did so it wouldn't fluke before refreshing
            isValidated = true;
            auth = authData;
        
            keyValue = firebase.auth().currentUser.uid;
                            
            if(isValidated == true){
                firebase.database().ref('/users/' + keyValue).once('value').then(function(snapshot) {
                    nameOfUser = (snapshot.val().username);
                    console.log("Name of user: ", nameOfUser);
                    battleText = (snapshot.val().battleText);
                    console.log("Battle text: ", battleText);              
                    var img = (snapshot.val().image);
                    console.log("Image: ", img);
                    cashMoney = (snapshot.val().cash);
                                                 
                    firebase.storage().ref(img).getDownloadURL().then(function(url) {
                        urlVal = url;
                        localStorage.setItem("username", nameOfUser)
                        localStorage.setItem("userkey", keyValue)
                        localStorage.setItem("battleText", battleText)
                        localStorage.setItem("cash", cashMoney)
                        localStorage.setItem("picURL", urlVal)
                        localStorage.setItem("imageName", null)
                        window.location.href = "mainMenu.html"; /*+ '#&&' + keyValue + '&&' + nameOfUser + '&&' + battleText + '&&' + cashMoney + '&&' + urlVal + '&&null';*/
                        console.log("hola");
                    })
                })
            }
                            
                            
        })
        .catch(function(error) {
            $('#error').css("visibility", "visible")
            console.log("Login Failed!", error);
            //$('#messageModalLabel').html(spanText('ERROR: '+error.code, ['danger']))
        });
    }
});
 
$('#guestlogin').on('click', function (e){
    e.preventDefault();
    window.location.href = "mainMenu.html";
})

})



