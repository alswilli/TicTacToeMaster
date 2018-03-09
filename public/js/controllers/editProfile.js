angular.module('TicTacToeApp')
   .controller('EditProfileCtrl',
      function EditCtrl($scope, $rootScope) {


         'use strict';

         initSoundPrefs();
         playTheme("main");

         $scope.img_url = app.img_url;
         //update siebar to hilight edit page selection
         $rootScope.$broadcast('update', 'editProfileLink');

         $(function () {
            $('#profile_image').change(function (e) {

               var img = URL.createObjectURL(e.target.files[0]);
               console.log(img)
               $('.imageNew').attr('src', img);
            });
         });

         // $('#usernameNew').attr('value', sessionStorage.getItem("name"));
         // $('#battleTextNew').attr('value', sessionStorage.getItem("battleText"));

         $('#usernameNew').attr('value', app.username);
         $('#battleTextNew').attr('value', app.battleText);

         $('#btn-applyChanges').on('click', updateUserInfo);

      });

function updateUserInfo(e) {
   e.preventDefault();

   console.log(document.getElementById("usernameNew").innerHTML)
   // sessionStorage.setItem("name", nameOfUser)

   // Get image ref
   const storageRef = firebase.storage().ref();

   const file = document.querySelector('#profile_image').files[0];

   if (file != null && file === undefined) {
      alert("Image file invalid, please enter a valid image!");
      console.log("penios");
      //break;
   } else if (file == null) //Don't want to upload a new profile pic but want to change other stuff
   {

      firebase.database().ref('/users/' + app.keyValue).once('value').then(function (snapshot) {

         //get the new values
         var newUserName = $('#usernameNew').val();
         var newBattleText = $('#battleTextNew').val();

         app.username = newUserName
         app.battleText = newBattleText

         //updates info on firebase
         userRef.child("username").set(newUserName);
         userRef.child("battleText").set(newBattleText);
         window.location.href = "#/home"

      });
   } else // want to change all
   {
      console.log("file: ", file);

      var imageName;

      firebase.database().ref('/users/' + app.keyValue).once('value').then(function (snapshot) {
         newImageName = (snapshot.val().image);
         newImageName = (+new Date()) + '-' + file.name; //newImageName;
         const name = newImageName;

         const metadata = {
            contentType: file.type
         };
         //get the new values
         var newUserName = $('#usernameNew').val();
         var newBattleText = $('#battleTextNew').val();
         const task = firebase.storage().ref().child(name).put(file, metadata);

         task.then((snapshot) => {
            const url = snapshot.downloadURL;
            console.log(name);
            console.log(newImageName);
            firebase.storage().ref(name).getDownloadURL().then(function (url) {
               newUrlVal = url;


               app.username = newUserName
               app.battleText = newBattleText
               app.img_url = newUrlVal

               //updates info on firebase
               userRef.child("username").set(newUserName);
               userRef.child("battleText").set(newBattleText);
               userRef.child("image").set(newImageName);
               window.location.href = "#/home"

            }).catch(function (error) {
               console.log(error);
               console.log("from connecting to fb")
            });
         }).catch((error) => {
            console.error(error);
            console.log("from task")
         });


      });
   }

}
