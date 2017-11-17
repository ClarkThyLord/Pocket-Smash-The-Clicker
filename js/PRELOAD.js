GAME.PRELOAD = function(game) {
  // Setup variables
  this.icon = null;

  this.ready = false;
};

GAME.PRELOAD.prototype = {
  preload: function() {
    this.add.sprite(0, 0, 'mm_load');
    this.icon = this.add.sprite(0, 0, 'mm_icon');
    this.load.setPreloadSprite(this.icon);

    this.load.image("mm_background", "./res/main menu/menu.jpg");
    this.load.image("mm_arrow", "./res/main menu/arrow.png");
    this.load.image("mm_circle", "./res/main menu/circle.png");
    this.load.image("mm_circle", "./res/main menu/circle.png");
    this.load.image("mm_circle", "./res/main menu/circle.png");
    this.load.image("mm_circle", "./res/main menu/circle.png");
    this.load.image("noise_on", "./res/main menu/noise_on.png");
    this.load.image("noise_off", "./res/main menu/noise_off.png");
    this.load.audio("music", ["./res/main menu/music.mp3"]);
  },
  create: function() {
    this.icon.cropEnabled = false;
  },
  update: function() {
    // Make sure music has finished loading
    if (this.cache.isSoundDecoded("music") && this.ready == false) {
      this.ready = true;
      this.state.start("MAINMENU");
    }
  },
  render: function() {
    // NOTHING
  }
};
