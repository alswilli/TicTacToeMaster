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
   if (sound == "main")   return "sounds/main_menu.mp3";
   if (sound == "game")   return "sounds/lobby1.wav";
   if (sound == "lose")   return "sounds/lose_drums1.wav";
   if (sound == "draw")   return "sounds/lose_drums2.wav";
   if (sound == "win")    return "sounds/win1.mp3";
   if (sound == "select") return "sounds/menu_select.wav"
   if (sound == "piece")  return "sounds/click2.wav"
}

function toggleSound(button) {
   var soundType = "effect";
   if (button.id == "bgmButton") {
      soundType = "theme";
   }
   
   var sounds = document.getElementsByClassName(soundType);
  
   if (button.value == "on") { 
      //Button is not muted, so mute it
      button.value = "off";
      button.style.backgroundImage = "url('/imgs/sound_off2.png')";
      storeMuted(soundType, true);
      
      for (var i=0; i<sounds.length; i++) {
         sounds[i].muted = true;
      }
   }else { 
      //Button is muted, so unmute it
      button.value = "on";
      button.style.backgroundImage = "url('/imgs/sound_on2.png')"
      storeMuted(soundType, false);
      
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

function storeVolume(soundType, value) {
  
   if (soundType == "theme") {
      localStorage.setItem("bgmVolume", value);
   }else {
      localStorage.setItem("sfxVolume", value);
   }
}

function storeMuted(soundType, value) {
   
   if (soundType == "theme") {
      localStorage.bgmMuted = value;
      console.log("bgMuted is now: "+localStorage.bgmMuted);
   }else {
      localStorage.sfxMuted = value;
      console.log("sfxMuted is now: "+localStorage.sfxMuted);
   }
}

function getSoundVolume(soundType) {
   if (soundType == "theme")
      return document.getElementById("bgmSlider").value;
   return document.getElementById("sfxSlider").value;
}

function initSoundPrefs() {
   var bgmButton = document.getElementById("bgmButton");
   var bgmSlider = document.getElementById("bgmSlider");
   var sfxButton = document.getElementById("sfxButton");
   var sfxSlider = document.getElementById("sfxSlider");

   var bgmIsMuted = localStorage.getItem("bgmMuted");
   var bgmVolume  = localStorage.getItem("bgmVolume");
   var sfxIsMuted = localStorage.getItem("sfxMuted");
   var sfxVolume  = localStorage.getItem("sfxVolume");
   
   if (bgmIsMuted == "true") {
      bgmButton.value = "off";
      bgmButton.style.backgroundImage = "url('/imgs/sound_off2.png')";
   }else {
      bgmButton.value = "on";
      bgmButton.style.backgroundImage = "url('/imgs/sound_on2.png')";      
   }
   if (sfxIsMuted == "true") {
      sfxButton.value = "off";
      sfxButton.style.backgroundImage = "url('/imgs/sound_off2.png')";
   }else {
      sfxButton.value = "on";
      sfxButton.style.backgroundImage = "url('/imgs/sound_on2.png')";      
   }
   
   if (bgmVolume != null) {
      bgmSlider.value = bgmVolume;
   }
   if (sfxVolume != null) {
      sfxSlider.value = sfxVolume;
   }
}