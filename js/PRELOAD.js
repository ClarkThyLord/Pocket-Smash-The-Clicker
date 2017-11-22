GAME.PRELOAD = function(game) {
  // Setup variables
  this.icon = null;

  this.ready = false;
};

GAME.PRELOAD.prototype = {
  preload: function() {
    this.add.sprite(0, 0, "mm_load");
    this.icon = this.add.sprite(0, 0, "mm_icon");
    this.load.setPreloadSprite(this.icon);

    // Load data; if non then setup data
    CONFIGURATION = JSON.parse(localStorage.getItem("POCKET-SMASH-CONFIGURATION")) || {
      "music": true
    };
    SAVE = JSON.parse(localStorage.getItem("POCKET-SMASH-SAVE")) || {
      "player": {
        "level": 0,
        "xp": 0,
        "money": 0,
        "items": {

        },
        "life_boost": 0,
        "dmg_boost": 1.25,
        "def_boost": 0,
        "ult_boost": 2.5
      },
      "monster": {

      },
      "monsters": [
        "cacus",
        "ugo",
        "seriosity"
      ]
    };

    // Load main menu things
    this.load.image("mm_background", "./res/main menu/menu.jpg");
    this.load.image("mm_arrow", "./res/main menu/arrow.png");
    this.load.image("mm_restart", "./res/main menu/restart.png");

    // Load game stuff
    this.load.image("game_death", "./res/game/death.jpg");
    this.load.image("game_ground", "./res/game/ground.png");
    this.load.image("game_ult", "./res/game/ultimate.jpg");
    this.load.image("game_retire", "./res/game/retire.png");

    for (var key in AREAS) {
      this.load.image("area_" + AREAS[key].name, "./res/game/areas/" + AREAS[key].name + ".jpg");
    }
    for (var monster_name in MONSTERS) {
      this.load.image("monster_" + monster_name, "./res/game/monsters/" + monster_name + ".png");
    }

    // Load store stuff
    this.load.image("store_background", "./res/store/store.jpg");
    this.load.image("store_frame", "./res/store/frame.png");
    this.load.image("store_buy", "./res/store/buy.png");
    this.load.image("store_back", "./res/store/back.png");

    for (var item_name in ITEMS) {
      this.load.image("item_" + item_name, "./res/store/items/" + item_name + ".png");
    }

    // Load global stuff
    this.load.image("icon_money", "./res/shared/money.png");
    this.load.image("icon_store", "./res/shared/store.png");

    this.load.image("icon_save", "./res/shared/icon.png");

    this.load.image("noise_on", "./res/shared/noise_on.png");
    this.load.image("noise_off", "./res/shared/noise_off.png");

    this.load.image("icon_unknown", "./res/shared/unknown.png");
    this.load.image("icon_earth", "./res/shared/earth.png");
    this.load.image("icon_wind", "./res/shared/wind.png");
    this.load.image("icon_water", "./res/shared/water.png");
    this.load.image("icon_fire", "./res/shared/fire.png");
    this.load.image("icon_dark", "./res/shared/dark.png");
    this.load.image("icon_light", "./res/shared/light.png");
    this.load.image("icon_meme", "./res/shared/meme.png");

    this.load.image("icon_heart", "./res/shared/heart.png");
    this.load.image("icon_life", "./res/shared/life.jpg");
    this.load.image("icon_sword", "./res/shared/sword.png");
    this.load.image("icon_attack", "./res/shared/attack.jpg");
    this.load.image("icon_shield", "./res/shared/shield.png");
    this.load.image("icon_defence", "./res/shared/defence.jpg");

    this.load.audio("music", ["./res/shared/music.mp3"]);
  },
  create: function() {
    this.icon.cropEnabled = false;
  },
  update: function() {
    // Make sure music has finished loading
    if (this.cache.isSoundDecoded("music") && this.ready == false) {
      if (Object.keys(SAVE.monster).length !== 0) {
        this.ready = true;
        this.state.start("GAME");
      } else {
        this.ready = true;
        this.state.start("MAINMENU");
      }
    }
  }
};
