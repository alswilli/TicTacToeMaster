/* See getSoundPath() for the names of sound */

/* Plays a sound given the name
 * First we get the path of the sound given the name and create the audio element.
 * Then we set the volume of it based on the sound preference of the user and play it.
 */
function playSound(sound) {
   var path    = getSoundPath(sound);
   var volume  = getSoundVolume("effect");
   var isMuted = false;
   if (document.getElementById("sfxButton").value == "off") {
      isMuted = true;
   }

   var audio = document.createElement('AUDIO');
   audio.src    = path;
   audio.volume = volume;
   audio.muted  = isMuted;
   audio.classList.add('effect');

   //The element needs to be appended if we want to search it later
   document.getElementById("main-body").append(audio);
   audio.play();
}

/* Plays a theme giving the name.
   If the theme is already playing, do nothing. If not, we pause all current themes playing.
   Then we get the path of the sound to create the audio element, and set the volume of the
   theme based on user preferences and finally we play it.
 */
function playTheme(sound) {
   if (themeIsPlaying(sound))
      return;

   var themes = document.getElementsByClassName("theme");
   for (var i=0; i<themes.length; i++) {
      themes[i].pause();
      themes[i].currentTime = 0;
   }

   var path = getSoundPath(sound);
   var volume = getSoundVolume("theme");
   var isMuted = false;
   if (document.getElementById("bgmButton") != null && document.getElementById("bgmButton").value == "off") {
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

/* Checks if the current theme is playing by getting and iterating over
 * all the elements with with the class theme and checking if the the
 * theme is not paused. Can refactor to remove looping and instead check
 * the specific id later if we just set the id when creating the audio element.
 */
function themeIsPlaying(sound) {
   var themes = document.getElementsByClassName("theme");
   console.log(themes);

   for (var i=0; i<themes.length; i++) {

      if (themes[i].classList.contains(sound)) {
         if (!themes[i].paused) {
            return true;
         }
      }

   }
   return false;
}

/* Returns the volume value of the given sound type
 */
function getSoundVolume(soundType) {
   if(document.getElementById("bgmSlider") === null)
       return 0.3
   if (soundType == "theme")
      return document.getElementById("bgmSlider").value;
   return document.getElementById("sfxSlider").value;
}

/* Returns the path of the sound for ease or sound usage.
 * We can maybe change this O(n) logic by initializing a dictionary of the values
 * when starting to app
 */
function getSoundPath(sound) {
   if (sound == "main")   return "sounds/main_menu.mp3";
   if (sound == "game")   return "sounds/lobby1.wav";

   if (sound == "lose")   return "sounds/lose_drums1.wav";
   if (sound == "draw")   return "sounds/draw1.wav";
   if (sound == "win")    return "sounds/win1.mp3";
   if (sound == "hover")  return "sounds/select4.mp3";
   if (sound == "click")  return "sounds/select3.wav";
   if (sound == "achievement")   return "sounds/achievement1.mp3";
   if (sound == "placeMyPiece")  return "sounds/click2.wav";
   if (sound == "placeOppPiece") return "sounds/click3.wav";
   if (sound == "oppJoined") return "sounds/slide_in.wav";
   if (sound == "oppLeft")   return "sounds/slide_out.wav";
}

/* Toggles whether the sound button is muted or not.
 * It first identifies the button to toggle by its id. Then if the button value
 * is "on", then it's unmuted, so we have to mute it, change the image, and store
 * the new preferences in localstorage. It also loops through all current sounds's
 * muted property to update them.
 */
function toggleSound(button) {
   var soundType = "effect";
   if (button.id == "bgmButton")
      soundType = "theme";

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

/* Adjusts the volume of all sounds of the given type
 * First identifies the soundtype to be adjusted, then loops through
 * all sounds of the given type to update. This is called whenever the
 * volume slider moves.
 */
function adjustVolume(slider) {
   var soundType = "effect";
   if (slider.id == "bgmSlider") {
      soundType = "theme";
   }

   var sounds = document.getElementsByClassName(soundType);

   for (var i=0; i<sounds.length; i++) {
      sounds[i].volume = slider.value;
   }
   console.log(soundType+" : "+slider.value);
}

/* Stores the volume value of the given sound type.
 * Called whenever the slider is released.
 */
function storeVolume(soundType, value) {

   if (soundType == "theme") {
      localStorage.setItem("bgmVolume", value);
   }else {
      localStorage.setItem("sfxVolume", value);
   }
}

/* Stores the muted status of the given sound type
 * Called whenver the sound buttons are pressed.
 */
function storeMuted(soundType, value) {

   if (soundType == "theme") {
      localStorage.bgmMuted = value;
   }else {
      localStorage.sfxMuted = value;
   }
}

/* Initializes the sound control to the user's preferences by using
 * localstorage to get the values and update the buttons and sliders.
 */
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
   }
   if (sfxIsMuted == "true") {
      sfxButton.value = "off";
      sfxButton.style.backgroundImage = "url('/imgs/sound_off2.png')";
   }

   if (bgmVolume != null && bgmSlider != null) {
      bgmSlider.value = bgmVolume;
   }
   if (sfxVolume != null && sfxSlider != null) {
      sfxSlider.value = sfxVolume;
   }
}
