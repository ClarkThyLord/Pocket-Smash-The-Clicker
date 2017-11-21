// Object containing game's configuration
var CONFIGURATION = {};
// Object containing save state
var SAVE = {};
// Object containing font properties
var FONT = {
  font: "25px Karmatic_Arcade",
  fill: "rgb(0, 0, 255)",
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
      this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
      this.scale.setMinMax(480, 260, 1024, 768);
      this.scale.forceLandscape = true;
      this.scale.pageAlignHorizontally = true;
    }
  },
  preload: function() {
    // Load preload things
    this.load.image("mm_icon", "./res/main menu/icon.png");
    this.load.image("mm_load", "./res/main menu/load.jpg");
  },
  create: function() {
    this.state.start("PRELOAD");
  }
};
