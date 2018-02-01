# TicTacToeMaster
----Installations needed----
heroku
https://devcenter.heroku.com/articles/getting-started-with-nodejs#set-up

node.js
https://nodejs.org/en/download/




----How To Run----

From the top directory of your repo (i.e where Procfile is), run
the following command (Note that you will need Heroku installed)

    heroku local
   
Then, go to http://localhost:5000/ on your browser
Check this link for more info on running heroku via a local server
  https://devcenter.heroku.com/articles/heroku-local


----Our Actual Website----
We have an actual site you can navigate to, with just a URL! No 
localhost hoops to jump through! Also allows us to play against 
each other for networking

https://tic-tac-toe-master.herokuapp.com/
  
----Structure of Game Code----

In the index.html, there are multiple javascript sources in the body, these are
the files that run the tictactoe game. Each file, except for game.js, is a different 
state of the game, i.e menu, win, etc.

game.js initializes the game object and loads all of these states to the game object.
First, loadState loads the imgs, then the menuState is displayed. When the user clicks
the screen, ticTacState starts, which is the actual game. From there, when the game ends
winState is displayed, which can then restart ticTacState once the user clicks the screen
again.


----Tutorials/Links----

Basic Game in Phaser Tutorial
http://phaser.io/tutorials/making-your-first-phaser-game/index

States in Phaser
http://perplexingtech.weebly.com/game-dev-blog/using-states-in-phaserjs-javascript-game-developement

Local Http Server
http://www.linuxjournal.com/content/tech-tip-really-simple-http-server-python

Networking (When we get there)
http://www.dynetisgames.com/2017/03/06/how-to-make-a-multiplayer-online-game-with-phaser-socket-io-and-node-js/
