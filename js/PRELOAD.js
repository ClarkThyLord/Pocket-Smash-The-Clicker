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

    // Load data; if non then setup data
    CONFIGURATION = JSON.parse(localStorage.getItem("POCKET-SMASH-CONFIGURATION")) || {
      "music": true
    };
    SAVE = JSON.parse(localStorage.getItem("POCKET-SMASH-SAVE")) || {
      "money": 0,
      "items": [

      ],
      "monsters": [
        "cacus"
      ]
    };

    // FOR DEBUGGING
    console.log("LOADED ---\nCONFIGURATION: " + JSON.stringify(CONFIGURATION) + "\nSAVE: " + JSON.stringify(SAVE));

    // Load main menu things
    this.load.image("mm_background", "./res/main menu/menu.jpg");
    this.load.image("mm_arrow", "./res/main menu/arrow.png");
    this.load.image("mm_instructions", "./res/main menu/instructions.png");
    this.load.image("mm_restart", "./res/main menu/restart.png");

    // Load game stuff
    for (var monster_name in MONSTERS) {
      this.load.image("game_" + monster_name, "./res/game/monsters/" + monster_name + ".png");
    }

    // Load global stuff
    this.load.image("icon_save", "./res/shared/icon.png");

    this.load.image("noise_on", "./res/main menu/noise_on.png");
    this.load.image("noise_off", "./res/main menu/noise_off.png");

    this.load.image("icon_unknown", "./res/shared/unknown.png");
    this.load.image("icon_earth", "./res/shared/earth.png");
    this.load.image("icon_wind", "./res/shared/wind.png");
    this.load.image("icon_water", "./res/shared/water.png");
    this.load.image("icon_heart", "./res/shared/fire.png");
    this.load.image("icon_dark", "./res/shared/dark.png");
    this.load.image("icon_light", "./res/shared/light.png");
    this.load.image("icon_meme", "./res/shared/meme.png");

    this.load.image("icon_heart", "./res/shared/heart.png");
    this.load.image("icon_life", "./res/shared/life.jpg");
    this.load.image("icon_sword", "./res/shared/sword.png");
    this.load.image("icon_attack", "./res/shared/attack.jpg");
    this.load.image("icon_shield", "./res/shared/shield.png");
    this.load.image("icon_defence", "./res/shared/defence.jpg");

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
