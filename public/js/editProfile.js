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
    
    console.log("In Home Page");
    
    var keyValue;
    var nameOfUser;
    var battleText;
    var cashMoney;
    var url;
    
    var argumentVals = window.location.hash.split('&&');
    console.log(argumentVals);
    
    keyValue = argumentVals[1]; 
    console.log(keyValue);
    nameOfUser = argumentVals[2];
    console.log(nameOfUser);
    battleText = argumentVals[3];
    console.log(battleText);
    cashMoney = argumentVals[4];
    console.log(cashMoney);
    url = argumentVals[5];
    console.log(url);
    
    $( window ).on( "load", function() { 
    
        console.log("Poooooooop!!");
    
        document.getElementById('username').innerHTML = nameOfUser;
        document.getElementById('battleText').innerHTML = battleText;
        document.getElementById('cash').innerHTML = '$' + cashMoney;
        $('.image').attr('src', url);
    
        //Edit Profile
        $('#mainMenu').on('click', function (e) {
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
    
        //Achievements
        $('#achievements').on('click', function (e) {
            e.preventDefault();
    
            console.log("going to achievements");
            console.log("name: ", nameOfUser);
            console.log("battleText: ", battleText);
            console.log("cashMoney: ", cashMoney);
            console.log("url: ", url);
    
            // var argumentData = [keyValue, nameOfUser, battleText, cashMoney, urlVar];
            // console.log("arguments: ", argumentData);
    
            window.location.href = "achievements.html" + '#&&' + keyValue + '&&' + nameOfUser + '&&' + battleText + '&&' + cashMoney + '&&' + url + '&&null';
            //window.location.href = "achievements.html?key="+keyValue+"&username="+nameOfUser+"&battleText="+battleText+"&cashMoney="+cashMoney+"&url="+url;
                
        });
    
        //Customization
        $('#customization').on('click', function (e) {
            e.preventDefault();
    
            console.log("going to customization");
            console.log("name: ", nameOfUser);
            console.log("battleText: ", battleText);
            console.log("cashMoney: ", cashMoney);
            console.log("url: ", url);
    
            window.location.href = "customization.html" + '#&&' + keyValue + '&&' + nameOfUser + '&&' + battleText + '&&' + cashMoney + '&&' + url + '&&null';
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

    $('#btn-applyChanges').on('click', function (e) {
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
        else{
            console.log("file: ", file);
    
            var imageName;
    
            // const name = (+new Date()) + '-' +file.name;

            firebase.database().ref('/users/' + keyValue).once('value').then(function(snapshot) {
                newImageName = (snapshot.val().image);
            
                const name = newImageName;
                console.log("name: ", name);
    
                const metadata = {
                    contentType: file.type
                };
                const task = firebase.storage().ref().child(name).put(file, metadata);
                //imageName = name;
            
                task.then((snapshot) => {
                    const url = snapshot.downloadURL;
                    console.log(name);
                    console.log(newImageName);
                }).catch((error) => {
                    console.error(error);
                });

                var newUserName = $('#usernameNew').val(); //get username
                // var newUserName = document.getElementById('usernameNew').innerHTML
                console.log("New username: ", newUserName);
                var newBattleText = $('#battleTextNew').val(); //get battleText
                // var newBattleText = document.getElementById('battleTextNew').innerHTML
                console.log("New battleText: ", newBattleText);

                // var dbRefObject = firebase.database().ref('/users/' + keyValue + '/username/');
                // dbRefObject.set(
                //     newUsername
                // );
                // dbRefObject = firebase.database().ref('/users/' + keyValue + '/battleText/');
                // dbRefObject.set(
                //     newBattleText
                // );
                // dbRefObject = firebase.database().ref('/users/' + keyValue + '/image/');
                // dbRefObject.set(
                //     newImageName
                // );

                firebase.storage().ref(name).getDownloadURL().then(function(url) {
                    //$('.image').attr('src', url);
                    newUrlVal = url;
                    window.location.href = "mainMenu.html" + '#&&' + keyValue + '&&' + newUserName + '&&' + newBattleText + '&&' + cashMoney + '&&' + newUrlVal + '&&' + newImageName;
                    console.log("hola");
                    })

                //window.location.href = "mainMenu.html" + '#&&' + keyValue + '&&' + newUserName + '&&' + newBattleText + '&&' + cashMoney + '&&' + newUrl + '&&' + newImageName;
            });
        }
    });


    $(function(){
        $('#profile_image').change( function(e) {
            
            var img = URL.createObjectURL(e.target.files[0]);
            $('.imageNew').attr('src', img);
        });
    });

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