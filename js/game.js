GAME.GAME = function(game) {};

GAME.GAME.prototype = {
  preload: function() {},
  create: function() {
    // Setup variables
    this.area = 0;
    this.background = null;

    this.life_enemy = null;
    this.enemy = null;

    this.life_player = null;
    this.player = null;

    this.gui = [];

    this.saveIcon = null;

    this.soundIcon = null;
    this.sound = null;

    // Start of scene setup
    this.setupArea();

    var retire = this.add.sprite(475, 50, "icon_retire");
    retire.anchor.x = retire.anchor.y = 0.5;
    retire.inputEnabled = true;
    retire.events.onInputDown.add(this.retire, this);
    this.gui.push(retire);

    var store = this.add.sprite(700, 50, "icon_store");
    store.anchor.x = store.anchor.y = 0.5;
    store.inputEnabled = true;
    store.events.onInputDown.add(this.store, this);
    this.gui.push(store);

    this.saveIcon = this.add.sprite(750, 50, "icon_save");
    this.saveIcon.anchor.x = this.saveIcon.anchor.y = 0.5;
    this.saveIcon.alpha = 0;
    this.gui.push(this.saveIcon);

    this.setupPlayer();
    this.setupMonster();

    // Setup music according to config
    this.soundIcon = (CONFIGURATION.music) ? this.add.sprite(50, 50, "noise_on") : this.add.sprite(50, 50, "noise_off");
    this.soundIcon.anchor.x = this.soundIcon.anchor.y = 0.5;
    this.soundIcon.scale.x = this.soundIcon.scale.y = 0.5;
    this.soundIcon.inputEnabled = true;
    this.soundIcon.events.onInputDown.add(this.toggleNoise, this);

    this.sound = this.add.audio("music");
    if (CONFIGURATION.music) {
      this.sound.play("", 0, 1, true);
    }
  },
  store: function() {
    console.log("STORE!");
    this.saveGame();
    this.sound.destroy();
    this.state.start("STORE");
  },
  retire: function() {
    SAVE.monster = {};
    this.saveGame();
    this.sound.destroy();
    this.state.start("MAINMENU");
  },
  setupArea: function() {
    this.area = Math.floor(SAVE.monster.level / 5.5);
    if (this.area > 15) {
      area = 15;
    }

    if (this.background == null) {
      this.background = this.add.sprite(0, 0, AREAS[this.area].name + "_background");
    } else {
      this.background.loadTexture(AREAS[this.area].name + "_background");
    }
  },
  setupPlayer: function() {
    this.player = this.add.sprite(160, 570, "monster_" + SAVE.monster.name);
    this.player.anchor.x = 0.5;
    this.player.anchor.y = 1;

    this.life_player = this.add.sprite(50, 565, "icon_life");
    this.life_player.anchor.y = 0.5;
    this.life_player.scale.x = 0.05 * (SAVE.monster.life / 10);
    this.gui.push(this.life_player);
  },
  setupMonster: function() {
    var pick = Math.floor(Math.random() * AREAS[this.area].monsters.length);

    console.log(AREAS[this.area].monsters[pick]);

    this.enemy = this.add.sprite(660, 525, "monster_" + AREAS[this.area].monsters[pick]);
    this.enemy.anchor.x = 0.5;
    this.enemy.anchor.y = 1;

    this.life_enemy = this.add.sprite(550, 510, "icon_life");
    this.life_enemy.anchor.y = 0.5;
    this.life_enemy.scale.x = 0.05 * (MONSTERS[AREAS[this.area].monsters[pick]].life / 10);
    this.gui.push(this.life_enemy);

    // Bring GUI to the top
    for (var key in this.gui) {
      var obj = this.gui[key];
      obj.bringToTop();
    }
  },
  toggleNoise: function(obj) {
    if (CONFIGURATION.music == true) {
      this.soundIcon.loadTexture("noise_off");
      this.sound.stop();
      CONFIGURATION.music = false;
    } else {
      this.soundIcon.loadTexture("noise_on");
      this.sound.play("", 0, 1, true);
      CONFIGURATION.music = true;
    }
    this.saveConfig();
  },
  saveConfig: function() {
    this.saveIcon.alpha = 100;
    var save = JSON.stringify(CONFIGURATION);
    localStorage.setItem("POCKET-SMASH-CONFIGURATION", save);
    setTimeout(function(saveIcon) {
      saveIcon.alpha = 0;
    }, 1000, this.saveIcon);
  },
  saveGame: function() {
    this.saveIcon.alpha = 100;
    var save = JSON.stringify(SAVE);
    localStorage.setItem("POCKET-SMASH-SAVE", save);
    setTimeout(function(saveIcon) {
      saveIcon.alpha = 0;
    }, 1000, this.saveIcon);
  },
  update: function() {
    // NOTHING
  },
  render: function() {
    // NOTHING
  }
};
