function playSound(sound) {
   var path = getSoundPath(sound);
   var volume = getSoundVolume("effect");
   var audio = document.createElement('AUDIO');
   var isMuted = false;
   if (document.getElementById("sfxButton").value == "off") {
      isMuted = true;
   }
   
   audio.src = path;
   audio.volume = volume;
   audio.muted = isMuted;
   audio.classList.add('effect');
   document.getElementById("main-body").append(audio);
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
   var volume = getSoundVolume("theme");
   var isMuted = false; 
   if (document.getElementById("bgmButton").value == "off") {
      isMuted = true;
   }
   
   var audio = document.createElement('AUDIO');
   audio.src = path;
   audio.volume = volume;
   audio.muted = isMuted;
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

function toggleSound(button) {
   var soundType = "effect";
   if (button.id == "bgmButton") {
      soundType = "theme";
   }
   
   var sounds = document.getElementsByClassName(soundType);
  
   if (button.value == "on") {
      button.value = "off";
      button.style.backgroundImage = "url('/imgs/sound-off.png')";
      for (var i=0; i<sounds.length; i++) {
         sounds[i].muted = true;
      }
   }else {
      button.value = "on";
      button.style.backgroundImage = "url('/imgs/sound-on.png')"
      for (var i=0; i<sounds.length; i++) {
         sounds[i].muted = false;
      }      
   }
}

function adjustVolume(slider) {
   var soundType = "effect";
   if (slider.id == "bgmSlider") {
      soundType = "theme";
   }

   var sounds = document.getElementsByClassName(soundType);
   
   for (var i=0; i<sounds.length; i++) {
      sounds[i].volume = slider.value;
   }
}

function getSoundVolume(soundType) {
   if (soundType == "theme")
      return document.getElementById("bgmSlider").value;
   return document.getElementById("sfxSlider").value;
}
