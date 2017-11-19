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

    this.gui = [];

    this.saveIcon = null;

    this.soundIcon = null;
    this.sound = null;

    // Start of scene setup
    this.setupArea();

    this.soundIcon = this.add.sprite(475, 50, "icon_retire");
    this.soundIcon.anchor.x = this.soundIcon.anchor.y = 0.5;
    this.soundIcon.inputEnabled = true;
    this.soundIcon.events.onInputDown.add(this.retire, this);

    this.soundIcon = this.add.sprite(700, 50, "icon_store");
    this.soundIcon.anchor.x = this.soundIcon.anchor.y = 0.5;
    this.soundIcon.inputEnabled = true;
    this.soundIcon.events.onInputDown.add(this.store, this);

    this.life_enemy = this.add.sprite(50, 565, "icon_life");
    this.life_enemy.anchor.x = 0;
    this.life_enemy.anchor.y = 0.5;
    this.gui.push(this.life_enemy);

    this.life_player = this.add.sprite(550, 510, "icon_life");
    this.life_player.anchor.x = 0;
    this.life_player.anchor.y = 0.5;
    this.gui.push(this.life_player);

    this.saveIcon = this.add.sprite(750, 50, "icon_save");
    this.saveIcon.anchor.x = this.saveIcon.anchor.y = 0.5;
    this.saveIcon.alpha = 0;
    this.gui.push(this.saveIcon);

    // this.setupMonsters();

    // According to config
    if (CONFIGURATION.music == true) {
      this.soundIcon = this.add.sprite(50, 550, "noise_on");
      this.soundIcon.anchor.x = this.soundIcon.anchor.y = 0.5;
      this.soundIcon.scale.x = this.soundIcon.scale.y = 0.5;
      this.soundIcon.inputEnabled = true;
      this.soundIcon.events.onInputDown.add(this.toggleNoise, this);

      this.sound = this.add.audio("music");
      this.sound.play("", 0, 1, true);
    } else {
      this.soundIcon = this.add.sprite(50, 50, "noise_off");
      this.soundIcon.anchor.x = this.soundIcon.anchor.y = 0.5;
      this.soundIcon.scale.x = this.soundIcon.scale.y = 0.5;
      this.soundIcon.inputEnabled = true;
      this.soundIcon.events.onInputDown.add(this.toggleNoise, this);

      this.sound = this.add.audio("music");
    }
  },
  store: function() {
    console.log("STORE!");
  },
  retire: function() {
    console.log("RETIRE!");
    SAVE.monster = {};
    this.saveGame();
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
  setupMonsters: function() {
    if (this.monsters === null) {
      this.monsters = this.add.group();
    } else {
      this.monsters.destroy();
      this.monsters = this.add.group();
    }

    var x = 400;
    for (var monster_name in SAVE.monsters) {
      var refrence = MONSTERS[SAVE.monsters[monster_name]];

      var monster = this.add.sprite(x, 300, "this_" + SAVE.monsters[monster_name]);
      monster.anchor.x = monster.anchor.y = 0.5;
      monster.data.name = SAVE.monsters[monster_name];
      monster.inputEnabled = true;
      monster.events.onInputDown.add(this.selectMonster, this);
      var text = this.add.text(0, 110, SAVE.monsters[monster_name], FONT);
      text.anchor.x = text.anchor.y = 0.5;
      this.monsters.add(monster);
      monster.addChild(text);
      x += 250;
    }

    // Select the first monster
    this.selectMonster(this.monsters.getFirst());

    // Bring this.gui to top
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
