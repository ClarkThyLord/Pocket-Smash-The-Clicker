window.onload = function() {
  // Setup game
  var game = new Phaser.Game(800, 600, Phaser.AUTO, 'canvas-container');

  //	Add all the scenes to the game's scene manager
  game.state.add('BOOT', GAME.BOOT);
  game.state.add('PRELOAD', GAME.PRELOAD);
  game.state.add('MAINMENU', GAME.MAINMENU);
  game.state.add('GAME', GAME.GAME);
  game.state.add('STORE', GAME.STORE);

  //	Start of game
  game.state.start('BOOT');
};
