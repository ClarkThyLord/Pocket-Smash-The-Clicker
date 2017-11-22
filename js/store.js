GAME.STORE = function(game) {};

GAME.STORE.prototype = {
  create: function() {
    // Setup variables
    this.current = 1;
    this.items = [];
    this.item_counts = {};
    this.gui = [];

    this.money = null;

    this.saveIcon = null;

    this.soundIcon = null;
    this.sound = null;

    // Start of scene setup
    this.add.sprite(0, 0, "store_background");

    var money = this.add.sprite(135, 550, "icon_money");
    money.anchor.x = money.anchor.y = 0.5;
    this.money = this.add.text(50, 0, SAVE.player.money, FONT);
    this.money.anchor.y = 0.5;
    money.addChild(this.money);
    this.gui.push(money);
    this.gui.push(this.money);

    var left_arrow = this.add.sprite(50, 365, "mm_arrow");
    left_arrow.alpha = 0.3;
    left_arrow.anchor.x = left_arrow.anchor.y = 0.5;
    left_arrow.inputEnabled = true;
    left_arrow.events.onInputDown.add(this.moveLeft, this);
    this.gui.push(left_arrow);

    var right_arrow = this.add.sprite(750, 365, "mm_arrow");
    right_arrow.alpha = 0.3;
    right_arrow.anchor.x = right_arrow.anchor.y = 0.5;
    right_arrow.angle = 180;
    right_arrow.inputEnabled = true;
    right_arrow.events.onInputDown.add(this.moveRight, this);
    this.gui.push(right_arrow);

    var back = this.add.sprite(695, 570, "store_back");
    back.anchor.x = back.anchor.y = 0.5;
    back.inputEnabled = true;
    back.events.onInputDown.add(this.back, this);
    this.gui.push(back);

    this.saveIcon = this.add.sprite(750, 50, "icon_save");
    this.saveIcon.anchor.x = this.saveIcon.anchor.y = 0.5;
    this.saveIcon.alpha = 0;
    this.gui.push(this.saveIcon);

    this.setupItems();

    // Bring GUI to the top
    for (var key in this.gui) {
      var obj = this.gui[key];
      obj.bringToTop();
    }

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
    var frame, name, item, count, button, x = 400;
    for (var item_name in ITEMS) {
      frame = this.add.sprite(x, 400, "store_frame");
      frame.anchor.x = frame.anchor.y = 0.5;
      frame.data.name = item_name;
      frame.inputEnabled = true;
      frame.events.onInputDown.add(this.useItem, this);
      name = this.add.text(0, -125, item_name, FONT);
      name.anchor.x = name.anchor.y = 0.5;
      item = this.add.sprite(0, -25, "item_" + item_name);
      item.anchor.x = item.anchor.y = 0.5;
      count = this.add.text(0, 50, SAVE.player.items[item_name] || "0", FONT);
      count.anchor.x = count.anchor.y = 0.5;
      button = this.add.sprite(0, 110, "store_buy");
      button.anchor.x = button.anchor.y = 0.5;
      button.data.name = item_name;
      button.inputEnabled = true;
      button.events.onInputDown.add(this.buyItem, this);
      frame.addChild(name);
      frame.addChild(item);
      frame.addChild(count);
      frame.addChild(button);
      this.item_counts[item_name] = count;
      x += 150;
    }
  },
  useItem: function(obj) {
    if (Object.keys(SAVE.monster).length !== 0) {
      console.log("USED: " + obj.data.name);

    }
  },
  buyItem: function(obj) {
    if (SAVE.player.money > ITEMS[obj.data.name].cost) {
      console.log("BOUGHT: " + obj.data.name);
      SAVE.player.money -= ITEMS[obj.data.name].cost;

      if (obj.data.name in SAVE.player.items) {
        SAVE.player.items[obj.data.name] += 1;
      } else {
        SAVE.player.items[obj.data.name] = 1;
      }

      this.updateText(obj);
    }
  },
  moveLeft: function(obj) {
    if (this.current !== 1) {
      this.current -= 1;
      this.items.forEach(function(item) {
        item.x += 150;
      });
    }
  },
  moveRight: function(obj) {
    if (this.current !== this.items.total) {
      this.current += 1;
      this.items.forEach(function(item) {
        item.x -= 150;
      });
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
  updateText: function(obj) {
    this.money.setText(SAVE.player.money);

    this.item_counts[obj.data.name].setText(SAVE.player.items[obj.data.name]);
  }
};
