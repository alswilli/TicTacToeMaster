(function(){
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

    //get elements
  	const txtUserName = document.getElementById('username');
  	const txtPassword = document.getElementById('password');
  	const btnLogin = document.getElementById('btn-login');
  	//const btnSignUp = document.getElementById('btn-signup');
  	const btnSignOut = document.getElementById('btn-signout');

    //login event
  	btnLogin.addEventListener('click', e => {
  	    //get email and password
  	    const userName = txtUserName.value;
  	    const password = txtPassword.value;
  	    const auth = firebase.auth();

  	    //signin
  	    const promise = auth.signInWithEmailAndPassword(userName, password);
  	    //log any catched errors to console
  	    promise.catch(e => console.log(e.message));
  	});

    //signup event
  	//btnSignUp.addEventListener('click', e => {
  	    //get email and password
        //doesnt check if it is an actual email, not sure if we want to check?
  	  //  const userName = txtUserName.value;
  	  //  const password = txtPassword.value;
  	  //  const auth = firebase.auth();

  	    //signin
  	  //  const promise = auth.createUserWithEmailAndPassword(userName, password);
  	    //log any catched errors to console
  	  //  promise.catch(e => console.log(e.message));
  //	});

    //signout event
  	btnSignOut.addEventListener('click', e => {
  	    firebase.auth().signOut();
  	});
    
    //realtime listener to monitor sign up, log in, and log out
  	firebase.auth().onAuthStateChanged(firebaseUser => {
  	    if (firebaseUser) {
  	        console.log("logged in");
  	        window.location.href = "mainMenu.html";
  	        //if you hide sign out button
            //btnSignOut.classList.remove('hide');
  	    } else {
  	        console.log('not logged in');
  	        //if you hide sign out button
  	        //btnSignOut.classList.add('hide');
  	    }
  	});
}());