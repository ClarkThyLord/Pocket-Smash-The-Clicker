GAME.MAINMENU = function(game) {
  // Setup variables
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

    var left_arrow = this.add.sprite(50, 325, "mm_arrow");
    left_arrow.alpha = 0.3;
    left_arrow.anchor.x = left_arrow.anchor.y = 0.5;
    left_arrow.inputEnabled = true;
    left_arrow.events.onInputDown.add(this.moveLeft, this);

    var circle = this.add.sprite(400, 300, "mm_circle");
    circle.anchor.x = circle.anchor.y = 0.5;

    var right_arrow = this.add.sprite(750, 325, "mm_arrow");
    right_arrow.alpha = 0.3;
    right_arrow.anchor.x = right_arrow.anchor.y = 0.5;
    right_arrow.angle = 180;
    right_arrow.inputEnabled = true;
    right_arrow.events.onInputDown.add(this.moveRight, this);

    var heart = this.add.sprite(275, 490, "icon_heart");
    heart.anchor.x = heart.anchor.y = 0.5;
    heart.scale.x = heart.scale.y = 0.25;
    this.life = this.add.sprite(325, 490, "icon_life");
    this.life.anchor.x = 0;
    this.life.anchor.y = 0.5;

    var sword = this.add.sprite(275, 530, "icon_sword");
    sword.anchor.x = sword.anchor.y = 0.5;
    sword.scale.x = sword.scale.y = 0.25;
    this.attack = this.add.sprite(325, 530, "icon_attack");
    this.attack.anchor.x = 0;
    this.attack.anchor.y = 0.5;

    var shield = this.add.sprite(275, 575, "icon_shield");
    shield.anchor.x = shield.anchor.y = 0.5;
    shield.scale.x = shield.scale.y = 0.25;
    this.defence = this.add.sprite(325, 575, "icon_defence");
    this.defence.anchor.x = 0;
    this.defence.anchor.y = 0.5;

    this.saveIcon = this.add.sprite(750, 50, "icon_save");
    this.saveIcon.anchor.x = this.saveIcon.anchor.y = 0.5;
    this.saveIcon.alpha = 0;

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
    console.log("Moving left!");
  },
  moveRight: function(obj) {
    console.log("Moving right!");
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
    this.saveIcon.alpha = 0;
  },
  saveGame: function() {
    this.saveIcon.alpha = 100;
    var save = JSON.stringify(SAVE);
    console.log("Saving game ---\n" + save);
    localStorage.setItem("POCKET-SMASH-SAVE", save);
    this.saveIcon.alpha = 0;
  },
  update: function() {



  },
  render: function() {



  }
};
