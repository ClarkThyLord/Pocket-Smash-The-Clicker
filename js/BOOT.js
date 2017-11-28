// Object containing save state
var SAVE = {};

// Object containing font properties
var FONT = {
  font: "25px Karmatic_Arcade",
  fill: "rgb(226, 226, 226)",
  align: "center",
  boundsAlignH: "center",
  boundsAlignV: "middle"
};

// Object containing all the scenes
var GAME = {};

GAME.BOOT = function(game) {};

GAME.BOOT.prototype = {
  init: function() {
    // TOUCH SUPPORT
    this.input.maxPointers = 1;

    // LOSE FOCUS PROTOCOL; true: pause game, false: resume game
    this.stage.disableVisibilityChange = true;

    if (this.game.device.desktop) { // DESKTOP SETTINGS
      this.scale.pageAlignHorizontally = true;
    } else { // MOBILE SETTINGS
      this.scale.forceOrientation(true, false);
      this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
      this.scale.setMinMax(480, 260, 1024, 768);
      this.scale.forceLandscape = true;
      this.scale.pageAlignHorizontally = true;
    }
  },
  preload: function() {
    // Preload things for the following scene
    this.load.image("G_background", "./res/global/background.jpg");
    this.load.image("G_logo", "./res/global/logo.png");
  },
  create: function() {
    this.state.start("PRELOAD");
  }
};
