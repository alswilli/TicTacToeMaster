# TicTacToeMaster

NOTE: If creating a user is giving an error, make sure your password is 6 characters long, email uses @, and have a valid picture.

Link to demo: https://www.youtube.com/watch?v=AgtZBP0WBWY

NOTE: The Firebase Storage API has changed since we launched the app, causing user login to fail (404 error when authenticating user information). Please log in as Guest for now. 

----Installations needed----

node.js
https://nodejs.org/en/download/

heroku(if you want to push changes to website)

https://devcenter.heroku.com/articles/getting-started-with-nodejs#set-up

Express
use the following command

    npm install express --save
    
Socket.io
use the following command

    npm install socket.io --save


----How To Run----

From the top directory of your repo (i.e where Procfile is), run
the following command (Note that you will need Heroku installed)

    node server.js

Then, go to http://localhost:8081/ on your browser

If you decide to use heroku, the following command works too

    heroku local
    
Then, go to http://localhost:5000 on your browser

----Our Actual Website----

We have an actual site you can navigate to, with just a URL! No 
localhost hoops to jump through! Also allows us to play against 
each other for networking

https://tic-tac-toe-master.herokuapp.com/

To push changes you have made to the website, install heroku, 
then make sure you have a remote in your repo to the existing
tic-tac-toe-master website, with the foloowing command.

    heroku git:remote -a tic-tac-toe-master
    
To use heroku commands, you will have to register an account 
with heroku.

To push your changes to the website, use the folowing commands,
also available in herokuPushCommands.txt
    
    git pull heroku master
    git add .
    git commit -m "push <whatever you did> to heroku site"
    git push heroku master
  
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
