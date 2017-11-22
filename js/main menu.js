GAME.MAINMENU = function(game) {};

GAME.MAINMENU.prototype = {
  preload: function() {},
  create: function() {
    // Setup variables
    this.gui = [];

    this.current = 1;
    this.selected = null;
    this.monsters = null;

    this.type = null;
    this.life = null;
    this.attack = null;
    this.defence = null;

    this.saveIcon = null;

    this.soundIcon = null;
    this.sound = null;

    // Start of scene setup
    this.add.sprite(0, 0, 'mm_background');

    var left_arrow = this.add.sprite(50, 325, "mm_arrow");
    left_arrow.alpha = 0.3;
    left_arrow.anchor.x = left_arrow.anchor.y = 0.5;
    left_arrow.inputEnabled = true;
    left_arrow.events.onInputDown.add(this.moveLeft, this);
    this.gui.push(left_arrow);

    var right_arrow = this.add.sprite(750, 325, "mm_arrow");
    right_arrow.alpha = 0.3;
    right_arrow.anchor.x = right_arrow.anchor.y = 0.5;
    right_arrow.angle = 180;
    right_arrow.inputEnabled = true;
    right_arrow.events.onInputDown.add(this.moveRight, this);
    this.gui.push(right_arrow);

    var restart = this.add.sprite(695, 515, "mm_restart");
    restart.anchor.x = restart.anchor.y = 0.5;
    restart.inputEnabled = true;
    restart.events.onInputDown.add(this.restartGame, this);
    this.gui.push(restart);

    var store = this.add.sprite(695, 570, "icon_store");
    store.anchor.x = store.anchor.y = 0.5;
    store.inputEnabled = true;
    store.events.onInputDown.add(this.store, this);
    this.gui.push(store);

    this.type = this.add.sprite(190, 530, "icon_unknown");
    this.type.anchor.x = this.type.anchor.y = 0.5;
    this.type.scale.x = this.type.scale.y = 0.50;
    this.gui.push(this.type);

    var heart = this.add.sprite(275, 470, "icon_heart");
    heart.anchor.x = heart.anchor.y = 0.5;
    heart.scale.x = heart.scale.y = 0.25;
    this.life = this.add.sprite(325, 470, "icon_life");
    this.life.anchor.x = 0;
    this.life.anchor.y = 0.5;
    this.gui.push(heart);
    this.gui.push(this.life);

    var sword = this.add.sprite(275, 520, "icon_sword");
    sword.anchor.x = sword.anchor.y = 0.5;
    sword.scale.x = sword.scale.y = 0.25;
    this.attack = this.add.sprite(325, 520, "icon_attack");
    this.attack.anchor.x = 0;
    this.attack.anchor.y = 0.5;
    this.gui.push(sword);
    this.gui.push(this.attack);

    var shield = this.add.sprite(275, 570, "icon_shield");
    shield.anchor.x = shield.anchor.y = 0.5;
    shield.scale.x = shield.scale.y = 0.25;
    this.defence = this.add.sprite(325, 570, "icon_defence");
    this.defence.anchor.x = 0;
    this.defence.anchor.y = 0.5;
    this.gui.push(shield);
    this.gui.push(this.defence);

    this.saveIcon = this.add.sprite(750, 50, "icon_save");
    this.saveIcon.anchor.x = this.saveIcon.anchor.y = 0.5;
    this.saveIcon.alpha = 0;
    this.gui.push(this.saveIcon);

    this.setupMonsters();

    // Setup music according to config
    this.soundIcon = (CONFIGURATION.music) ? this.add.sprite(50, 550, "noise_on") : this.add.sprite(50, 550, "noise_off");
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

      var monster = this.add.sprite(x, 300, "monster_" + SAVE.monsters[monster_name]);
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
  moveLeft: function(obj) {
    if (this.current !== 1) {
      this.current -= 1;
      this.monsters.forEach(function(monster) {
        monster.x += 250;
      });
    }
  },
  moveRight: function(obj) {
    if (this.current !== this.monsters.total) {
      this.current += 1;
      this.monsters.forEach(function(monster) {
        monster.x -= 250;
      });
    }
  },
  selectMonster: function(obj) {

    var info;
    if (this.selected === null) {
      obj.scale.x = obj.scale.y = 1.25;

      info = MONSTERS[obj.data.name];
      this.type.loadTexture("icon_" + info.type);
      this.life.scale.x = 0.05 * (info.life / 10);
      this.attack.scale.x = 0.05 * (info.attack / 3);
      this.defence.scale.x = 0.05 * (info.defence / 5);

      this.selected = obj;
    } else if (obj.data.name !== this.selected.data.name) {
      this.selected.scale.x = this.selected.scale.y = 1;

      obj.scale.x = obj.scale.y = 1.25;

      info = MONSTERS[obj.data.name];
      this.type.loadTexture("icon_" + info.type);
      this.life.scale.x = 0.05 * (info.life / 10);
      this.attack.scale.x = 0.05 * (info.attack / 3);
      this.defence.scale.x = 0.05 * (info.defence / 5);

      this.selected = obj;
    } else {
      SAVE.monster = Object.assign({}, MONSTERS[obj.data.name]);
      this.saveGame();
      this.sound.destroy();
      this.state.start("GAME");
    }
  },
  restartGame: function(obj) {
    SAVE = {
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
    this.setupMonsters();
    this.saveGame();
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
