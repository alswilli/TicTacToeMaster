

angular.module('TicTacToeApp')
.controller('EditProfileCtrl',
            function EditCtrl ($scope, $rootScope ) {
            

            'use strict';

             $scope.img_url = app.img_url;
            //update siebar to hilight edit page selection
            $rootScope.$broadcast('update', 'editProfileLink');
            
            $(function(){
              $('#profile_image').change( function(e) {
                                         
                                         var img = URL.createObjectURL(e.target.files[0]);
                                         $('.imageNew').attr('src', img);
                                         });
              });
            $('#btn-applyChanges').on('click', updateUserInfo);
            
});

function updateUserInfo(e)
{
    e.preventDefault();
    
    // Get image ref
    const storageRef = firebase.storage().ref();
    
    const file = document.querySelector('#profile_image').files[0];
    
    if(file === undefined)
    {
        alert("Image file invalid, please enter a valid image!");
        console.log("penios");
        //break;
    }
    else
    {
        console.log("file: ", file);
        
        var imageName;
        
        firebase.database().ref('/users/' + app.keyValue).once('value').then(function(snapshot) {
             newImageName = (snapshot.val().image);
             newImageName = (+new Date()) + '-' + file.name;//newImageName;
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
                       firebase.storage().ref(name).getDownloadURL().then(function(url) {
                              newUrlVal = url;
                                       
      
                              app.username =  newUserName
                              app.battleText =  newBattleText
                              app.img_url = newUrlVal

                              //updates info on firebase
                              userRef.child("username").set(newUserName); 
                              userRef.child("battleText").set(newBattleText);
                              userRef.child("image").set(newImageName); 
                              window.location.href = "#/home"
                              
                              }).catch(function(error) {
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
