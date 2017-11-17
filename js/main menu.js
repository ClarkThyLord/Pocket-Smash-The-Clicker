GAME.MAINMENU = function(game) {
  // Setup variables
  this.life = null;
  this.attack = null;
  this.defence = null;

  this.musicIcon = null;
  this.musicMute = false;
  this.music = null;
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

    this.musicIcon = this.add.sprite(50, 550, "noise_on");
    this.musicIcon.anchor.x = this.musicIcon.anchor.y = 0.5;
    this.musicIcon.scale.x = this.musicIcon.scale.y = 0.5;
    this.musicIcon.inputEnabled = true;
    this.musicIcon.events.onInputDown.add(this.toggleNoise, this);

    this.music = this.add.audio("music");
    this.music.play("", 0, 1, true);
  },
  moveLeft: function(obj) {
    console.log("Moving left!");
  },
  moveRight: function(obj) {
    console.log("Moving right!");
  },
  toggleNoise: function(obj) {
    console.log("Toggle noise!");
    if (this.musicMute == false) {
      this.musicIcon.loadTexture("noise_off");
      this.music.stop();
      this.musicMute = true;
    } else {
      this.musicIcon.loadTexture("noise_on");
      this.music.play("", 0, 1, true);
      this.musicMute = false;
    }
  },
  update: function() {



  },
  render: function() {



  }
};
