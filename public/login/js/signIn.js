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
	var selected;

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
					console.log("Selected Customization: ", img);
                    selected = (snapshot.val().selected);
                                                 

                    firebase.storage().ref(img).getDownloadURL().then(function(url) {
                        urlVal = url;
                        sessionStorage.setItem("name", nameOfUser)
                        sessionStorage.setItem("userkey", keyValue)
                        sessionStorage.setItem("battleText", battleText)
                        sessionStorage.setItem("cash", cashMoney)
                        sessionStorage.setItem("picUrl", urlVal)
                        sessionStorage.setItem("imageName", null)
												sessionStorage.setItem("selectedList",selected)
                        window.location.href = "mainMenu.html"; 
                        console.log("hola");
                    })
                })
            }
                            
                            
        })
        .catch(function(error) {
            $('#error').css("visibility", "visible")
            console.log("Login Failed!", error);
        });
    }
});
 
$('#guestlogin').on('click', function (e){
    e.preventDefault();

    firebase.database().ref('/users/bRfjYiEy7iWn67IHnrqh0ksUjLY2').once('value').then(function(snapshot) {
        nameOfUser = (snapshot.val().username);
        console.log("Name of user: ", nameOfUser);
        battleText = (snapshot.val().battleText);
        console.log("Battle text: ", battleText);              
        var img = (snapshot.val().image);
        console.log("Image: ", img);
        cashMoney = (snapshot.val().cash);
				selected = (snapshot.val().selected);
                                     
        firebase.storage().ref(img).getDownloadURL().then(function(url) {
            urlVal = url;
            sessionStorage.setItem("name", nameOfUser)
            sessionStorage.setItem("userkey", 'bRfjYiEy7iWn67IHnrqh0ksUjLY2')
            sessionStorage.setItem("battleText", battleText)
            sessionStorage.setItem("cash", cashMoney)
            sessionStorage.setItem("picUrl", urlVal)
            sessionStorage.setItem("imageName", null)
						sessionStorage.setItem("selectedList",selected)
            window.location.href = "mainMenu.html"; 
            console.log("holaGuest");
        })
    })
})

})



