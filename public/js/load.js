/*
    This is where all the imgs are loaded, this doesn't need to be a whole
    separate file but will make the code a lot cleaner once we have more images
*/
var loadState = {
  
    /*
        preload is a function called before any game logic is exectued, every state 
        can have its own preload() function,but its easier to keep it all here
    */
    preload() {
        game.load.image('logo', 'imgs/phaser.png');
        game.load.image('star', 'imgs/star.png');
        game.load.image('square', 'imgs/square.png');
        game.load.image('moon', 'imgs/moon.png');
        game.load.image('board', 'imgs/angledBoard.png');
        
    },  
    
    /*
        creates this state, which has the sole purpose of switching to the menu after
        it loads the images
    */
    create() {
        game.handleOpponentLeaving = this.handleOpponentLeaving
        game.state.start('menu');
    },
    
    handleOpponentLeaving()
    {
        console.log("opponent left")
        if(game.state.current==="win")
            game.firstPlay = true
        else
            game.state.start("waitingRoom");
    },
};
