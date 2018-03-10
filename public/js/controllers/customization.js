var unlockedRef; //The firebase reference to the unlocked section of each user
var userUnlocked; //The object that stores each item's unlock status
//The string that contains unlocked status consists of 0's(locked) and 1's(unlocked)
var unlockedBoard; //String repsensentation of the unlocked status of board design
var unlockedPiece; //String repsensentation of the unlocked status of piece design
var unlockedBackground; //String repsensentation of the unlocked status of background design
var selectedList; //String representation of what is slected for each customization category
var root
//update the cash displayed on the sidebar

//
angular.module('TicTacToeApp')
   .controller('CustomizationCtrl',
      function CustomizationCtrl($scope, $rootScope) {
         'use strict';

         initSoundPrefs();
         playTheme("main");

         unlockedRef = userRef.child('unlocked');
         initializeLocked();
         initializeSelected();
         //update siebar to hilight customization page selection
         $rootScope.$broadcast('update', "customizationLink");
         root = $rootScope;
      });


//takes in a string and change a character specified by the index
function replaceAtIndex(string, index, char) {
   var newString = "";
   //loops through the string, replacing the character at index by 1 while keeping the rest
   for (var i = 0; i < string.length; i++) {
      if (i == index) newString += char;
      else newString += string.charAt(i);
   }
   return newString;
}

//makes elecment specified by id appear
function appear(id) {
   var targetElement = document.getElementById(id);
   targetElement.style.display = "block";
}

//makes element specified by id disappear
function remove(id) {
   var removeTarget = document.getElementById(id);
   removeTarget.style.display = "none";
}

//removes w3-grayscale class from images
function removeGrayScale(id) {
   var targetElement = document.getElementById(id);
   targetElement.classList.remove("w3-grayscale-max");
}

// removes the locktag, button, and grayscale class to show specified item is unlocked
function unlock(buttonId, tagId, imageId) {
   remove(tagId);
   remove(buttonId);
   removeGrayScale(imageId);
   document.getElementById(imageId).addEventListener("click", function () {
      changeSelection(buttonId);
   });
}

//display the pop up for user to have preview of the item and confirm thier purchase
function unlockConfirmation(buttonId, tagId, imageId) {
   var confirmPopUp = document.getElementById("confirmation"); //element of the pop up
   var itemCost = document.getElementById(buttonId).innerHTML;
   var image = document.getElementById(imageId); //image element of the selected item
   var itemName = image.parentNode.parentNode.querySelector("p").innerHTML;
   // changes the lines in the popup according to the selected item
   var confirmContent = confirmPopUp.querySelector("p");
   confirmContent.innerHTML = "Purchase " + itemName + " for " + itemCost + "?";
   //copy's the image of selected over to the preview popup
   document.getElementById("confirmationImage").src = image.src;
   //make the confirmation button direct to the correct purchase
   confirmPopUp.querySelectorAll("button")[0].onclick = function () {
      updateAndUnlock(buttonId, tagId, imageId);
      remove("confirmation");
   }
   //make the whole pop up appear
   appear("confirmation");
}

/*
 Gets the string represntation of what's unlocked(1) and what's locked(0) from firbase and unlocks the corresponding item for each category (board design, piece design, and background design)
 */
function initializeLocked() {
   unlockedRef.once('value', function (snapshot) {
      //gets the reference for each data to read
      userUnlocked = snapshot.val();
      unlockedBoard = userUnlocked.board;
      unlockedPiece = userUnlocked.piece;
      unlockedBackground = userUnlocked.background;

      //unlock unlocked items for board design
      for (var boardIndex = 0; boardIndex < unlockedBoard.length; boardIndex++) {
         if (unlockedBoard.charAt(boardIndex) == "1") {
            unlock("boardButton" + boardIndex, "boardLockTag" + boardIndex, "boardImage" + boardIndex);
         }
      }
      //unlock unlocked items for piece design
      for (var pieceIndex = 0; pieceIndex < unlockedPiece.length; pieceIndex++) {
         if (unlockedPiece.charAt(pieceIndex) == "1") {
            unlock("pieceButton" + pieceIndex, "pieceLockTag" + pieceIndex, "pieceImage" + pieceIndex);
         }
      }
      //unlock unlocked items for background design
      for (var backgroundIndex = 0; backgroundIndex < unlockedBackground.length; backgroundIndex++) {
         if (unlockedBackground.charAt(backgroundIndex) == "1") {
            unlock("backgroundButton" + backgroundIndex, "backgroundLockTag" + backgroundIndex, "backgroundImage" + backgroundIndex);
         }
      }
   });
}

//Reads the string respresentaion of what's unlocked and makes the selected tag of the corresponding customization to appear
function initializeSelected() {
   userRef.once('value', function (snapshot) {
      selectedList = snapshot.val().selected;
      appear("boardSelectedTag" + selectedList.charAt(0));
      appear("pieceSelectedTag" + selectedList.charAt(1));
      appear("backgroundSelectedTag" + selectedList.charAt(2));
   });
}

/*
 Handles the interaction with cash amount of player. Checks if the player has enough cash for item. If yes, unlocks item and updates cash to app and firbase
 */
function unlockVerification(buttonId, tagId, imageId) {
   var itemCost = document.getElementById(buttonId).innerHTML.substring(1);
   //for some reason I can't parseInt at the same time so I did it seperately
   itemCost = parseInt(itemCost);
   var cashMoney = app.money 
   if (cashMoney >= itemCost) {
      unlockConfirmation(buttonId, tagId, imageId);
   } else {

      //shows a popup box to tell user he/she doesn't have enough money
      appear('insufficientCash');
   }
}

//updates to firebase after an item is unlocked and calls to to the unlock function
function updateAndUnlock(buttonId, tagId, imageId) {
   //gets item's index number for swapping out character
   var itemIndex = buttonId.charAt(buttonId.length - 1);
   if (buttonId.startsWith("board")) {
      unlockedBoard = replaceAtIndex(unlockedBoard, itemIndex, "1");

      //gets the reference to the child node storing the string that repsents board unlock status
      var boardRef = unlockedRef.child('board');
      //replaces the onld string with the new one in firbase
      boardRef.set(
         unlockedBoard
      );
   } else if (buttonId.startsWith("piece")) {
      unlockedPiece = replaceAtIndex(unlockedPiece, itemIndex, "1");
      var pieceRef = unlockedRef.child('piece');
      pieceRef.set(
         unlockedPiece
      );
   } else if (buttonId.startsWith("background")) {
      unlockedBackground = replaceAtIndex(unlockedBackground, itemIndex, "1");
      var backgroundRef = unlockedRef.child('background');
      backgroundRef.set(
         unlockedBackground
      );
   } else {
      console.log("buttonId error: incorrectId");
   }
   unlock(buttonId, tagId, imageId);
   var cashMoney = app.money 
   var itemCost = document.getElementById(buttonId).innerHTML.substring(1);
   //for some reason I can't parseInt at the same time so I did it seperately
   itemCost = parseInt(itemCost);
   cashMoney = cashMoney - itemCost;
   app.money = cashMoney 
   root.$broadcast('update', "homePageLink");


   document.getElementById('cash').innerHTML = '$' + cashMoney;
   //gets reference to cash of user in firebase
   var cashRef = userRef.child("cash");
   cashRef.set(cashMoney); //updates cash to firebase;
}

/*
 Whenever a user selects a customization, writes to firebase to update the selected customiation. Moves the selected tag to the new selected customization
 */
function changeSelection(buttonId) {
   //represents the selected sutomization
   var itemIndex = buttonId.charAt(buttonId.length - 1);

   //reference for string respresentation of what's selected of each category
   var selectedRef = userRef.child('selected');

   //Uses the tsrating word of the buttonId to identify which catergory the selected customization belongs
   if (buttonId.startsWith("board")) {
      //Gets what is currently selected in the category to remove the selected tag
      var currentSelected = selectedList.charAt(0);
      remove("boardSelectedTag" + currentSelected);

      //updates the string represenation of selected customization locally
      selectedList = replaceAtIndex(selectedList, 0, itemIndex);

      //makes the selected tag of the newly selected customization appear
      appear("boardSelectedTag" + itemIndex);
   } else if (buttonId.startsWith("piece")) {
      var currentSelected = selectedList.charAt(1);
      remove("pieceSelectedTag" + currentSelected);
      selectedList = replaceAtIndex(selectedList, 1, itemIndex);
      appear("pieceSelectedTag" + itemIndex);
   } else if (buttonId.startsWith("background")) {
      var currentSelected = selectedList.charAt(2);
      remove("backgroundSelectedTag" + currentSelected);
      selectedList = replaceAtIndex(selectedList, 2, itemIndex);
      appear("backgroundSelectedTag" + itemIndex);
   } else {
      console.log("buttonId error: incorrectId");
   }
   app.selected = selectedList;
   //updates the change to firebase
   selectedRef.set(
      selectedList
   );
}

//toggle the piece displayed from O to X
function togglePiece() {
   var pieceImages = document.querySelectorAll(".pieceImg");
   for (var i = 0; i < pieceImages.length; i++) {
      var oldPath = pieceImages[i].src;
      if (oldPath.indexOf("X") == -1) {
         var newPath = oldPath.replace("O", "X");
      } else {
         var newPath = oldPath.replace("X", "O");
      }
      pieceImages[i].src = newPath;
   }
}
