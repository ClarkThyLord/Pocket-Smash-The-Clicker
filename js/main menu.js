GAME.MAINMENU = function(game) {
  // Setup variables
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
};

GAME.MAINMENU.prototype = {
  preload: function() {},
  create: function() {
    this.add.sprite(0, 0, 'mm_background');

    var gui = [];

    var instructions = this.add.sprite(400, 150, "mm_instructions");
    instructions.anchor.x = instructions.anchor.y = 0.5;
    gui.push(instructions);

    var left_arrow = this.add.sprite(50, 325, "mm_arrow");
    left_arrow.alpha = 0.3;
    left_arrow.anchor.x = left_arrow.anchor.y = 0.5;
    left_arrow.inputEnabled = true;
    left_arrow.events.onInputDown.add(this.moveLeft, this);
    gui.push(left_arrow);

    var right_arrow = this.add.sprite(750, 325, "mm_arrow");
    right_arrow.alpha = 0.3;
    right_arrow.anchor.x = right_arrow.anchor.y = 0.5;
    right_arrow.angle = 180;
    right_arrow.inputEnabled = true;
    right_arrow.events.onInputDown.add(this.moveRight, this);
    gui.push(right_arrow);

    var restart = this.add.sprite(700, 575, "mm_restart");
    restart.anchor.x = restart.anchor.y = 0.5;
    restart.inputEnabled = true;
    restart.events.onInputDown.add(this.restartGame, this);
    gui.push(restart);

    this.type = this.add.sprite(190, 530, "icon_unknown");
    this.type.anchor.x = this.type.anchor.y = 0.5;
    this.type.scale.x = this.type.scale.y = 0.50;
    gui.push(this.type);

    var heart = this.add.sprite(275, 470, "icon_heart");
    heart.anchor.x = heart.anchor.y = 0.5;
    heart.scale.x = heart.scale.y = 0.25;
    this.life = this.add.sprite(325, 470, "icon_life");
    this.life.anchor.x = 0;
    this.life.anchor.y = 0.5;
    gui.push(heart);
    gui.push(this.life);

    var sword = this.add.sprite(275, 520, "icon_sword");
    sword.anchor.x = sword.anchor.y = 0.5;
    sword.scale.x = sword.scale.y = 0.25;
    this.attack = this.add.sprite(325, 520, "icon_attack");
    this.attack.anchor.x = 0;
    this.attack.anchor.y = 0.5;
    gui.push(sword);
    gui.push(this.attack);

    var shield = this.add.sprite(275, 570, "icon_shield");
    shield.anchor.x = shield.anchor.y = 0.5;
    shield.scale.x = shield.scale.y = 0.25;
    this.defence = this.add.sprite(325, 570, "icon_defence");
    this.defence.anchor.x = 0;
    this.defence.anchor.y = 0.5;
    gui.push(shield);
    gui.push(this.defence);

    this.saveIcon = this.add.sprite(750, 50, "icon_save");
    this.saveIcon.anchor.x = this.saveIcon.anchor.y = 0.5;
    this.saveIcon.alpha = 0;
    gui.push(this.saveIcon);

    this.monsters = this.add.group();
    var x = 400;
    for (var monster_name in SAVE.monsters) {
      var refrence = MONSTERS[SAVE.monsters[monster_name]];

      var monster = this.add.sprite(x, 300, "game_" + SAVE.monsters[monster_name]);
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

    // Bring GUI to top
    for (var key in gui) {
      var obj = gui[key];
      obj.bringToTop();
    }

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
      this.soundIcon = this.add.sprite(50, 550, "noise_off");
      this.soundIcon.anchor.x = this.soundIcon.anchor.y = 0.5;
      this.soundIcon.scale.x = this.soundIcon.scale.y = 0.5;
      this.soundIcon.inputEnabled = true;
      this.soundIcon.events.onInputDown.add(this.toggleNoise, this);

      this.sound = this.add.audio("music");
    }
  },
  moveLeft: function(obj) {
    if (this.current !== 1) {
      console.log("Moving left!");
      this.current -= 1;
      this.monsters.forEach(function(monster) {
        monster.x += 250;
      });
    }
  },
  moveRight: function(obj) {
    if (this.current !== this.monsters.total) {
      console.log("Moving right!");
      this.current += 1;
      this.monsters.forEach(function(monster) {
        monster.x -= 250;
      });
    }
  },
  selectMonster: function(obj) {
    console.log("Selected Monster ---");
    console.log(obj.data.name);

    var info;
    if (this.selected === null) {
      console.log("First select!");
      obj.scale.x = obj.scale.y = 1.25;

      info = MONSTERS[obj.data.name];
      this.type.loadTexture("icon_" + info.type);
      this.life.scale.x = 0.05 * (info.life / 10);
      this.attack.scale.x = 0.05 * (info.attack / 3);
      this.defence.scale.x = 0.05 * (info.defence / 5);

      this.selected = obj;
    } else if (obj.data.name === this.selected.data.name) {
      console.log("Monster choosen!");
    } else {
      console.log("Another selected!");
      this.selected.scale.x = this.selected.scale.y = 1;

      obj.scale.x = obj.scale.y = 1.25;

      info = MONSTERS[obj.data.name];
      this.type.loadTexture("icon_" + info.type);
      this.life.scale.x = 0.05 * (info.life / 10);
      this.attack.scale.x = 0.05 * (info.attack / 3);
      this.defence.scale.x = 0.05 * (info.defence / 5);

      this.selected = obj;
    }
  },
  restartGame: function(obj) {
    console.log("Restarted game!");
    SAVE = {
      "money": 0,
      "items": [

      ],
      "monsters": [
        "cacus",
        "ugo",
        "bree",
        "bun",
        "bunnu",
        "frea",
        "lolo",
      ]
    };
    this.saveGame();
  },
  toggleNoise: function(obj) {
    console.log("Toggle noise!");
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
    console.log("Saving configuration ---\n" + save);
    localStorage.setItem("POCKET-SMASH-CONFIGURATION", save);
    setTimeout(function(saveIcon) {
      saveIcon.alpha = 0;
    }, 1000, this.saveIcon);
  },
  saveGame: function() {
    this.saveIcon.alpha = 100;
    var save = JSON.stringify(SAVE);
    console.log("Saving game ---\n" + save);
    localStorage.setItem("POCKET-SMASH-SAVE", save);
    setTimeout(function(saveIcon) {
      saveIcon.alpha = 0;
    }, 1000, this.saveIcon);
  },
  update: function() {



  },
  render: function() {



  }
};
