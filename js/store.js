GAME.STORE = function(game) {};

GAME.STORE.prototype = {
  preload: function() {},
  create: function() {
    // Setup variables
    this.gui = [];

    this.money = null;

    this.saveIcon = null;

    this.soundIcon = null;
    this.sound = null;

    // Start of scene setup
    this.add.sprite(0, 0, "store_background");

    var back = this.add.sprite(695, 570, "store_back");
    back.anchor.x = back.anchor.y = 0.5;
    back.inputEnabled = true;
    back.events.onInputDown.add(this.back, this);
    this.gui.push(back);

    this.saveIcon = this.add.sprite(750, 50, "icon_save");
    this.saveIcon.anchor.x = this.saveIcon.anchor.y = 0.5;
    this.saveIcon.alpha = 0;
    this.gui.push(this.saveIcon);

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
  back: function() {
    this.saveGame();
    this.sound.destroy();
    if (Object.keys(SAVE.monster).length === 0) {
      this.state.start("MAINMENU");
    } else {
      this.state.start("GAME");
    }
  },
  setupItems: function() {
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
  }
};
