GAME.PRELOAD = function(game) {
  // Setup variables
  this.logo = null;

  this.ready = false;
};

GAME.PRELOAD.prototype = {
  preload: function() {
    this.add.sprite(0, 0, "G_background");
    this.logo = this.add.sprite(0, 0, "G_logo");
    this.load.setPreloadSprite(this.logo);

    // Load saved data, or setup a new game if non is found
    SAVE = JSON.parse(localStorage.getItem("PocketSmash")) || {
      "player": { // Player data
        "money": 0,
        "items": {

        },
        "game_speed": 400,
        "life_boost": 0,
        "dmg_boost": 1.25,
        "def_boost": 0,
        "ult_boost": 5,
        "stats": {
          "level_ups": 0,
          "deaths": 0,
          "kills": 0,
          "dmg_received": 0,
          "dmg_dealt": 0,
          "ult_dealt": 0,
          "money_total": 0,
          "captures": 1
        }
      },
      "monster": { // Monster data; in-game it will contain a monster object

      },
      "favorites": [ // Monsters favorited by the user

      ],
      "monsters": [ // Monsters captured
        "cacus"
      ],
      "config": { // Game configurations
        "sound": true
      }
    };

    // Load main menu assets
    this.load.image("mm_title", "./res/mainmenu/title.png");
    this.load.image("mm_frame", "./res/mainmenu/frame.png");
    this.load.image("mm_start", "./res/mainmenu/start.png");

    // Load monster managing images
    this.load.image("mm_star_on", "./res/mainmenu/star_on.png");
    this.load.image("mm_star_off", "./res/mainmenu/star_off.png");
    this.load.image("mm_favorites", "./res/mainmenu/favorite.png");
    this.load.image("mm_all", "./res/mainmenu/all.png");
    this.load.image("mm_arrow", "./res/mainmenu/arrow.png");

    // Load game help images
    this.load.image("mm_help", "./res/mainmenu/help.png");
    this.load.image("mm_help1", "./res/mainmenu/help/help_1.jpg");
    this.load.image("mm_help2", "./res/mainmenu/help/help_2.jpg");
    this.load.image("mm_help3", "./res/mainmenu/help/help_3.jpg");

    // Load game assets
    // Load starting message
    this.load.image("game_start", "./res/game/start.png");
    this.load.image("game_retire", "./res/game/retire.png");

    // Load images used in the game
    this.load.image("game_ground", "./res/game/ground.png");

    // Load particles
    this.load.image("game_heal", "./res/game/heal.png");
    this.load.image("game_damage", "./res/game/damage.png");
    this.load.image("game_charge", "./res/game/charge.png");

    // Load all the area images(backgrounds)
    for (var key in AREAS) {
      this.load.image("area_" + AREAS[key].name, "./res/game/areas/" + AREAS[key].name + ".jpg");
    }

    // Load all the monster images(background)
    for (var monster_name in MONSTERS) {
      this.load.image("monster_" + monster_name, "./res/game/monsters/" + monster_name + ".png");
    }

    // Load store assets
    this.load.image("store_title", "./res/store/title.png");
    this.load.image("store_frame", "./res/store/frame.png");
    this.load.image("store_buy", "./res/store/buy.png");
    this.load.image("store_back", "./res/store/back.png");

    // Load all the item images
    for (var item_name in ITEMS) {
      this.load.image("item_" + item_name, "./res/store/items/" + item_name + ".png");
    }

    // Load global assets
    // Load imagse for icons
    this.load.image("G_stats", "./res/global/stats.png");
    this.load.image("G_stats_title", "./res/global/stats_title.png");
    this.load.image("G_money", "./res/global/money.png");
    this.load.image("G_store", "./res/global/store.png");

    // Load images for monster types
    this.load.image("G_earth", "./res/global/type/earth.png");
    this.load.image("G_wind", "./res/global/type/wind.png");
    this.load.image("G_water", "./res/global/type/water.png");
    this.load.image("G_fire", "./res/global/type/fire.png");
    this.load.image("G_dark", "./res/global/type/dark.png");
    this.load.image("G_light", "./res/global/type/light.png");
    this.load.image("G_meme", "./res/global/type/meme.png");

    // Load images for monsters stats
    this.load.image("G_ult", "./res/global/ultimate.jpg");
    this.load.image("G_heart", "./res/global/heart.png");
    this.load.image("G_life", "./res/global/life.jpg");
    this.load.image("G_sword", "./res/global/sword.png");
    this.load.image("G_attack", "./res/global/attack.jpg");
    this.load.image("G_shield", "./res/global/shield.png");
    this.load.image("G_defence", "./res/global/defence.jpg");

    // Load images for noise toggle
    this.load.image("G_noise_on", "./res/global/noise_on.png");
    this.load.image("G_noise_off", "./res/global/noise_off.png");

    // Load sound assets
    // Load music for entire game
    this.load.audio("G_music", ["./res/global/music.mp3"]);
    this.load.audio("G_click", ["./res/global/click.mp3"]);
  },
  create: function() {
    this.logo.cropEnabled = false;
  },
  update: function() {
    // Make sure all game sounds have finished loading
    if (this.cache.isSoundDecoded("G_music") && this.cache.isSoundDecoded("G_click") && this.ready == false) {
      this.ready = true;
      if (Object.keys(SAVE.monster).length !== 0) {
        // Load game; if saved data on monster is found
        this.state.start("GAME");
      } else {
        // Load main menu; if no saved data on monster was found
        this.state.start("MAINMENU");
      }
    }
  }
};
