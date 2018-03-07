
function playSound(sound) {
   var path = getSoundPath(sound);
   var audio = document.createElement('AUDIO');
   audio.src = path;
   audio.play();
}


function playTheme(sound) {
   if (themeIsPlaying(sound)) 
      return;
   
   var themes = document.getElementsByClassName("theme");
   
   for (var i=0; i<themes.length; i++) {
      console.log("theme: "+themes[i]);
      themes[i].pause();
      themes[i].currentTime = 0;
   }
   
   var path = getSoundPath(sound);
   var audio = document.createElement('AUDIO');
   audio.src = path;
   audio.classList.add('theme');
   audio.classList.add(sound);
   audio.loop = true;
   document.getElementById("main-body").append(audio);
   audio.play();
}


function themeIsPlaying(sound) {
   var themes = document.getElementsByClassName("theme");
   console.log(themes);
   for (var i=0; i<themes.length; i++) {
      console.log("theme: "+i);
      if (themes[i].classList.contains(sound)) {
         if (!themes[i].paused) {
            return true;
         }  
      }
   }
   return false;
}


function getSoundPath(sound) {
   if (sound == "main")   return "sounds/main-menu.wav";
   if (sound == "game")   return "sounds/battle1.wav";
   if (sound == "lose")   return "sounds/lose-drums1.wav";
   if (sound == "draw")   return "sounds/lose-drums2.wav";
   if (sound == "win")    return "sounds/win1.mp3";
   if (sound == "select") return "sounds/menu-select.wav"
   if (sound == "piece")  return "sounds/click2.wav"
}