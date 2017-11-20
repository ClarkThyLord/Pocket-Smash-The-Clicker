GAME.GAME = function(game) {};

GAME.GAME.prototype = {
  preload: function() {},
  create: function() {
    // Setup variables
    this.area = 0;
    this.background = null;

    this.player = {};
    this.enemy = {};

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

    // Bring GUI to the top
    for (var key in this.gui) {
      var obj = this.gui[key];
      obj.bringToTop();
    }

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
    this.player.monster = this.add.sprite(160, 570, "monster_" + SAVE.monster.name);
    this.player.monster.anchor.x = 0.5;
    this.player.monster.anchor.y = 1;
    this.player.monster.inputEnabled = true;
    this.player.monster.events.onInputDown.add(this.monsterULT, this);

    this.player.data = SAVE.monster;

    this.player.ult = this.add.sprite(300, 150, "icon_ult");
    this.player.ult.anchor.y = 0.5;
    this.player.ult.scale.x = 0.01 * (this.player.data.ult / 1);
    this.gui.push(this.player.ult);

    this.player.life = this.add.sprite(50, 565, "icon_life");
    this.player.life.anchor.y = 0.5;
    this.player.life.scale.x = 0.05 * (this.player.data.life / 10);
    this.gui.push(this.player.life);
  },
  setupMonster: function() {
    var pick = Math.floor(Math.random() * AREAS[this.area].monsters.length);

    this.enemy.monster = this.add.sprite(660, 525, "monster_" + AREAS[this.area].monsters[pick]);
    this.enemy.monster.anchor.x = 0.5;
    this.enemy.monster.anchor.y = 1;
    this.enemy.monster.inputEnabled = true;
    this.enemy.monster.events.onInputDown.add(this.monsterDMG, this);

    this.enemy.data = Object.assign({}, MONSTERS[AREAS[this.area].monsters[pick]]);
    this.enemy.data.level = Math.floor(Math.random() * (this.area + 4)) + 1;
    this.enemy.data.life = this.enemy.data.life + (this.enemy.data.life * (this.enemy.data.level / 13));
    this.enemy.data.attack = this.enemy.data.attack + (this.enemy.data.attack * (this.enemy.data.level / 13));
    this.enemy.data.defence = this.enemy.data.defence + (this.enemy.data.defence * (this.enemy.data.level / 13));

    this.enemy.life = this.add.sprite(550, 510, "icon_life");
    this.enemy.life.anchor.y = 0.5;
    this.enemy.life.scale.x = 0.05 * (this.enemy.data.life / 10);
    this.gui.push(this.enemy.life);
  },
  monsterDEATH: function() {
    var pick = Math.floor(Math.random() * AREAS[this.area].monsters.length);

    this.enemy.monster.loadTexture("monster_" + AREAS[this.area].monsters[pick]);

    this.enemy.data = Object.assign({}, MONSTERS[AREAS[this.area].monsters[pick]]);
    this.enemy.data.level = Math.floor(Math.random() * (this.area + 4)) + 1;
    this.enemy.data.life = this.enemy.data.life + (this.enemy.data.life * (this.enemy.data.level / 13));
    this.enemy.data.attack = this.enemy.data.attack + (this.enemy.data.attack * (this.enemy.data.level / 13));
    this.enemy.data.defence = this.enemy.data.defence + (this.enemy.data.defence * (this.enemy.data.level / 13));

    this.enemy.life.scale.x = 0.05 * (this.enemy.data.life / 10);
    // TODO LOOT and CAPTURE
  },
  monsterULT: function() {
    this.player.data.ult += 1;
    if (this.player.data.ult >= 100) {
      this.monsterDEATH();

      this.player.data.ult = 0;
    }
  },
  monsterDMG: function() {
    this.enemy.data.life -= (Math.floor(Math.random() * (this.player.data.attack + 1)) * (0.01 * this.enemy.data.defence)) * SAVE.player.dmg_boost;
    if (this.enemy.data.life >= 0) {
      this.monsterDEATH();
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
    this.player.ult.scale.x = 0.01 * (this.player.data.ult / 1);

    this.player.data.life -= Math.floor(Math.random() * (this.enemy.data.attack + 1)) * (0.01 * this.player.data.defence - (0.01 * SAVE.player.dmg_boost));
    this.enemy.data.life -= Math.floor(Math.random() * (this.player.data.attack + 1)) * (0.01 * this.enemy.data.defence);

    this.player.life.scale.x = 0.05 * (this.player.data.life / 10);
    this.enemy.life.scale.x = 0.05 * (this.enemy.data.life / 10);

    if (this.player.data.life >= 0) {
      // TODO PLAYER DEATH
    } else if (this.enemy.data.life >= 0) {
      this.monsterDEATH();
    }
  },
  render: function() {
    // NOTHING
  }
};
