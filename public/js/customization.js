var unlockedRef;
var userUnlocked;
var unlockedBoard;
var unlockedPiece;
var unlockedBackground;
$(document).ready(function() {

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

    console.log("In customization");

    var argumentVals = window.location.hash.split('&&');
    console.log(argumentVals);
    
    var keyValue = argumentVals[1]; 
    console.log(keyValue);
    var nameOfUser = argumentVals[2];
    console.log(nameOfUser);
    var battleText = argumentVals[3];
    console.log(battleText);
    var cashMoney = argumentVals[4];
    console.log(cashMoney);
    var url = argumentVals[5];
    console.log(url);
	
		//gets reference for the user's unlocked items
		unlockedRef=firebase.database().ref('/users/' + keyValue+'/unlocked');
		initializeLocked();
    
    $( window ).on( "load", function() { 

        console.log("Poooooooop!!");

        document.getElementById('username').innerHTML = nameOfUser;
        document.getElementById('battleText').innerHTML = battleText;
        document.getElementById('cash').innerHTML = '$' + cashMoney;
        $('.image').attr('src', url);
    
        //Home Page
        $('#homePage').on('click', function (e) {
            e.preventDefault();

            console.log("going to achievements");
            console.log("name: ", nameOfUser);
            console.log("battleText: ", battleText);
            console.log("cashMoney: ", cashMoney);
            console.log("url: ", url);

            // var argumentData = [keyValue, nameOfUser, battleText, cashMoney, urlVar];
            // console.log("arguments: ", argumentData);

            window.location.href = "mainMenu.html" + '#&&' + keyValue + '&&' + nameOfUser + '&&' + battleText + '&&' + cashMoney + '&&' + url + '&&null';
            //window.location.href = "achievements.html?key="+keyValue+"&username="+nameOfUser+"&battleText="+battleText+"&cashMoney="+cashMoney+"&url="+url;
            
        });

        //Edit Profile
        $('#editProfile').on('click', function (e) {
            e.preventDefault();

            console.log("going to achievements");
            console.log("name: ", nameOfUser);
            console.log("battleText: ", battleText);
            console.log("cashMoney: ", cashMoney);
            console.log("url: ", url);

            // var argumentData = [keyValue, nameOfUser, battleText, cashMoney, urlVar];
            // console.log("arguments: ", argumentData);

            window.location.href = "editProfile.html" + '#&&' + keyValue + '&&' + nameOfUser + '&&' + battleText + '&&' + cashMoney + '&&' + url + '&&null';
            //window.location.href = "achievements.html?key="+keyValue+"&username="+nameOfUser+"&battleText="+battleText+"&cashMoney="+cashMoney+"&url="+url;
            
        });


        //Achievements
        $('#achievements').on('click', function (e) {
            e.preventDefault();

            console.log("going to customization");
            console.log("name: ", nameOfUser);
            console.log("battleText: ", battleText);
            console.log("cashMoney: ", cashMoney);
            console.log("url: ", url);

            window.location.href = "achievements.html" + '#&&' + keyValue + '&&' + nameOfUser + '&&' + battleText + '&&' + cashMoney + '&&' + url + '&&null';
        });

        //Leaderboard
        $('#leaderboard').on('click', function (e) {
            e.preventDefault();

            console.log("going to leaderboards");
            console.log("name: ", nameOfUser);
            console.log("battleText: ", battleText);
            console.log("cashMoney: ", cashMoney);
            console.log("url: ", url);

            window.location.href = "leaderboard.html" + '#&&' + keyValue + '&&' + nameOfUser + '&&' + battleText + '&&' + cashMoney + '&&' + url + '&&null';
        });
    })
    //create firebase references
		var Auth = firebase.auth();
		var dbRef = firebase.database();
		var auth = null;

		//  console.log("name: ", nameOfUser);
		//  console.log("battleText: ", battleText);
		//  console.log("cashMoney: ", cashMoney);
		//  console.log("url: ", url);

		// //Achievements
		// $('#achievements').on('click', function (e) {
		//     e.preventDefault();

		//     console.log("going to achievements");
		//     console.log("name: ", nameOfUser);
		//     console.log("battleText: ", battleText);
		//     console.log("cashMoney: ", cashMoney);
		//     console.log("url: ", url);

		//     window.location.href = "achievements.html" + '#' + keyValue + '#' + nameOfUser + '#' + battleText + '#' + cashMoney + '#' + url;
		// });

	//Logout
	$('#logout').on('click', function (e) {
		 e.preventDefault();

		 console.log("loggin out");

		 firebase.auth().signOut()
									 .then(function(authData) {
											 console.log("Logged out successfully");
											 window.location.href = "index.html";
											 auth = authData;
											 //$('#messageModalLabel').html(spanText('Success!', ['center', 'success']))

									 })
									 .catch(function(error) {
											 console.log("Logout Failed!", error);
											 //$('#messageModalLabel').html(spanText('ERROR: '+error.code, ['danger']))
									 });
	});
})
//removes elements specidied by id
function remove(id) {
	var removeTarget = document.getElementById(id);
	removeTarget.style.display = "none";
}
//removes w3-grayscale class from images
function removeGrayScale(id) {
	var element = document.getElementById(id);
	element.classList.remove("w3-grayscale-max");
}
// removes the locktag, button, and image after certain item is purchased
function unlock(buttonId, tagId, imageId){
	remove(tagId);
	remove(buttonId);
	removeGrayScale(imageId);
}
/* Gets the string represntation of what's unlocked(1) and what's locked(0)
*  from firbase and unlocks the corresponding item for each category
*/
function initializeLocked(){
	unlockedRef.once('value', function(snapshot) {
			userUnlocked = snapshot.val();
			unlockedBoard = userUnlocked.board;
			unlockedPiece = userUnlocked.piece;
			unlockedBackground = userUnlocked.background;
			for (var boardIndex=0; boardIndex<unlockedBoard.length;boardIndex++){
				if(unlockedBoard.charAt(boardIndex)=="1"){									
					unlock("boardButton"+boardIndex,"boardLockTag"+boardIndex,"boardImage"+boardIndex);
				}
			}
			for (var pieceIndex=0; pieceIndex<unlockedPiece.length;pieceIndex++){
				if(unlockedPiece.charAt(pieceIndex)=="1"){									
					unlock("pieceButton"+pieceIndex,"pieceLockTag"+pieceIndex,"pieceImage"+pieceIndex);
				}
			}
			for (var backgroundIndex=0; backgroundIndex<unlockedBackground.length;backgroundIndex++){
				if(unlockedBackground.charAt(backgroundIndex)=="1"){									
					unlock("backgroundButton"+backgroundIndex,"backgroundLockTag"+backgroundIndex,"backgroundImage"+backgroundIndex);
				}
			}
		});
}
function replaceAtIndex(string,index){
	var newString ="";
	for(var i=0;i<string.length;i++){
		if(i==index) newString+="1";
		else newString+=string.charAt(i);
	}
	return newString;
}
function updateAndUnlock(buttonId, tagId, imageId){
	var itemType=buttonId.substring(0,buttonId.length-1);
	var itemIndex=buttonId.charAt(buttonId.length-1);
	console.log("swap index: ",itemIndex);
	if(itemType=="boardButton"){
		console.log("initial board unlocked status: ",unlockedBoard);
		unlockedBoard=replaceAtIndex(unlockedBoard,itemIndex);
		var boardRef=unlockedRef.child('board');
		boardRef.set(
      unlockedBoard
    );
		console.log("new board unlock status: ",unlockedBoard);
	}else if (itemType=="pieceButton"){
		unlockedPiece=replaceAtIndex(unlockedPiece,itemIndex);
		var pieceRef=unlockedRef.child('piece');
		pieceRef.set(
      unlockedPiece
    );
	}else if (itemType=="backgroundButton"){
		unlockedBackground=replaceAtIndex(unlockedBackground,itemIndex);
		var backgroundRef=unlockedRef.child('background');
		backgroundRef.set(
      unlockedBackground
    );
	}else{
		console.log("buttonId error: incorrectId");
	}
	unlock(buttonId,tagId,imageId);
}
