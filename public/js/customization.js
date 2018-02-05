// Initialize Firebase
var config =
{
		apiKey: "AIzaSyARQqkwmw-yDfR4Fl7eyDSs464kPyDTWpo",
		authDomain: "tictactoemaster-b46ab.firebaseapp.com",
		databaseURL: "https://tictactoemaster-b46ab.firebaseio.com",
		projectId: "tictactoemaster-b46ab",
		storageBucket: "tictactoemaster-b46ab.appspot.com",
		messagingSenderId: "1050901435462"
};
firebase.initializeApp(config);

//get a specific user's key
var keyValue = window.location.hash.substring(1)


//get data from that specific user
var userUnlocked;


/*LOOKUP USER, find a user with the given keyvalue, then do something with the data */
firebase.database().ref('/users/' + keyValue).once('value').then(function(snapshot){
	userUnlocked = (snapshot.val().secQ);
	console.log("foundUser:", userUnlocked);

 });
function remove(id) {
	var removeTarget = document.getElementById(id);
	removeTarget.style.display = "none";
}
function removeGrayScale(id) {
  var element = document.getElementById(id);
  element.classList.remove("w3-grayscale-max");
}
function unlock(tagId, buttonId, imageId){
	remove(tagId);
	remove(buttonId);
	removeGrayScale(imageId);
}
function loadCustomizations(itemName,tagId, buttonId, imageId){}