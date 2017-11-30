GAME.STORE = function(game) {};

GAME.STORE.prototype = {
  create: function() {
    // Setup variables
    this.current = 1;
    this.item_counts = {};

    // Start of scene setup
    this.add.sprite(0, 0, "G_background");
    var title = this.add.image(400, 100, "store_title");
    title.anchor.x = title.anchor.y = 0.5;

    this.items = this.add.group();
    var frame, name, item, count, button, x = 400;
    for (var item_name in ITEMS) {
      frame = this.add.sprite(x, 400, "store_frame");
      frame.anchor.x = frame.anchor.y = 0.5;
      frame.data.name = item_name;
      frame.inputEnabled = true;
      frame.events.onInputDown.add(this.itemUse, this);

      name = this.add.text(0, -125, item_name, FONT);
      name.anchor.x = name.anchor.y = 0.5;

      item = this.add.sprite(0, -25, "item_" + item_name);
      item.anchor.x = item.anchor.y = 0.5;

      count = this.add.text(0, 50, "Inventory - " + (SAVE.player.items[item_name] || 0) + "\nCost - " + ITEMS[item_name].cost, FONT);
      count.anchor.x = count.anchor.y = 0.5;
      count.scale.x = count.scale.y = 0.5;

      button = this.add.sprite(0, 110, "store_buy");
      button.anchor.x = button.anchor.y = 0.5;
      button.data.name = item_name;
      button.inputEnabled = true;
      button.events.onInputDown.add(this.itemBuy, this);

      // Setup all the children to the frame
      frame.addChild(name);
      frame.addChild(item);
      frame.addChild(count);
      frame.addChild(button);

      // Add the refrenc to the items count
      this.item_counts[item_name] = count;

      // Add the "item" to the group of items
      this.items.add(frame);
      x += 400;
    }

    var money = this.add.sprite(75, 550, "G_money");
    money.anchor.x = money.anchor.y = 0.5;
    this.money = this.add.text(50, 0, SAVE.player.money, FONT);
    this.money.anchor.y = 0.5;
    money.addChild(this.money);

    this.announcement = this.add.text(400, 200, "TAP ON A ITEM TO USE IT!!!", FONT);
    this.announcement.anchor.x = this.announcement.anchor.y = 0.5;

    var left_arrow = this.add.sprite(50, 365, "mm_arrow");
    left_arrow.alpha = 0.6;
    left_arrow.anchor.x = left_arrow.anchor.y = 0.5;
    left_arrow.inputEnabled = true;
    left_arrow.events.onInputDown.add(function(obj, pointer) {
      // Click animation
      obj.scale.x = obj.scale.y = 1;
      this.add.tween(obj.scale).to({
        x: 0.75,
        y: 0.75
      }, 100, "Linear", true, 0, 0, true);
      // Click sound
      if (SAVE.config.sound === true) {
        this.click.play();
      }

      // Move all the items to the left if there is another item to the right
      if (this.current !== 1) {
        this.current -= 1;
        this.items.forEach(function(item) {
          item.x += 400;
        });
      }
    }, this);

    var right_arrow = this.add.sprite(750, 365, "mm_arrow");
    right_arrow.alpha = 0.6;
    right_arrow.anchor.x = right_arrow.anchor.y = 0.5;
    right_arrow.angle = 180;
    right_arrow.inputEnabled = true;
    right_arrow.events.onInputDown.add(function(obj, pointer) {
      // Click animation
      obj.scale.x = obj.scale.y = 1;
      this.add.tween(obj.scale).to({
        x: 0.75,
        y: 0.75
      }, 100, "Linear", true, 0, 0, true);
      // Click sound
      if (SAVE.config.sound === true) {
        this.click.play();
      }

      // Move all the items to the right if there is another item to the left
      if (this.current !== this.items.total) {
        this.current += 1;
        this.items.forEach(function(item) {
          item.x -= 400;
        });
      }
    }, this);

    var help = this.add.sprite(510, 575, "mm_help");
    help.anchor.x = help.anchor.y = 0.5;
    help.inputEnabled = true;
    help.events.onInputDown.add(function(obj, pointer) {
      // Click animation
      obj.scale.x = obj.scale.y = 1;
      this.add.tween(obj.scale).to({
        x: 0.75,
        y: 0.75
      }, 100, "Linear", true, 0, 0, true);
      // Click sound
      if (SAVE.config.sound === true) {
        this.click.play();
      }

      var slide = this.add.sprite(0, 0, "mm_help1");
      slide.data.slide = 1;
      slide.inputEnabled = true;
      slide.events.onInputDown.add(function(obj, pointer) {
        // Click sound
        if (SAVE.config.sound === true) {
          this.click.play();
        }

        if (obj.data.slide == 1) {
          obj.loadTexture("mm_help2");
        } else if (obj.data.slide == 2) {
          obj.loadTexture("mm_help3");
        } else {
          obj.destroy();
        }

        obj.data.slide += 1;
      }, this);
    }, this);

    var back = this.add.sprite(600, 570, "store_back");
    back.anchor.x = back.anchor.y = 0.5;
    back.inputEnabled = true;
    back.events.onInputDown.add(function(obj, pointer) {
      // Click animation
      obj.scale.x = obj.scale.y = 1;
      this.add.tween(obj.scale).to({
        x: 0.75,
        y: 0.75
      }, 100, "Linear", true, 0, 0, true);

      this.click.destroy();
      this.music.destroy();

      this.save();

      if (Object.keys(SAVE.monster).length === 0) {
        this.state.start("MAINMENU");
      } else {
        this.state.start("GAME");
      }
    }, this);

    // Setup saveicon
    this.saveicon = this.add.sprite(725, 50, "G_logo");
    this.saveicon.anchor.x = this.saveicon.anchor.y = 0.5;
    this.saveicon.scale.x = this.saveicon.scale.y = 0.15;
    this.saveicon.alpha = 0;

    // Setup music according to configurations
    this.soundIcon = (SAVE.config.sound === true) ? this.add.sprite(735, 570, "G_noise_on") : this.add.sprite(735, 570, "G_noise_off");
    this.soundIcon.anchor.x = this.soundIcon.anchor.y = 0.5;
    this.soundIcon.inputEnabled = true;
    this.soundIcon.events.onInputDown.add(function(obj, pointer) {
      // Click animation
      obj.scale.x = obj.scale.y = 1;
      this.add.tween(obj.scale).to({
        x: 0.75,
        y: 0.75
      }, 100, "Linear", true, 0, 0, true);
      // Click sound
      if (SAVE.config.sound === true) {
        this.click.play();
      }

      if (SAVE.config.sound === true) {
        SAVE.config.sound = false;
        obj.loadTexture("G_noise_off");
        this.music.stop();
      } else {
        SAVE.config.sound = true;
        obj.loadTexture("G_noise_on");
        this.music.play("", 0, 1, true);
      }

      this.save();
    }, this);

    this.music = this.add.audio("G_music");
    if (SAVE.config.sound === true) {
      this.music.play("", 0, 1, true);
    }

    this.click = this.add.audio("G_click");
  },
  itemBuy: function(obj, pointer) {
    // Click animation
    obj.scale.x = obj.scale.y = 1;
    this.add.tween(obj.scale).to({
      x: 0.75,
      y: 0.75
    }, 100, "Linear", true, 0, 0, true);
    // Click sound
    if (SAVE.config.sound === true) {
      this.click.play();
    }

    // Buy the item and add it to the players inventory
    if (SAVE.player.money >= ITEMS[obj.data.name].cost) {
      if (ITEMS[obj.data.name].cost == Infinity && SAVE.player.money == Infinity) {
        SAVE.player.money = 0;
      } else {
        SAVE.player.money -= ITEMS[obj.data.name].cost;
      }

      if (obj.data.name in SAVE.player.items) {
        SAVE.player.items[obj.data.name] += 1;
      } else {
        SAVE.player.items[obj.data.name] = 1;
      }

      if (ITEMS[obj.data.name].on_buy == true) {
        this.itemUse(obj, pointer);
      } else {
        this.updateText(obj, ("BOUGHT " + obj.data.name));
      }
    }
  },
  itemUse: function(obj, pointer) {
    // Click animation
    obj.scale.x = obj.scale.y = 1;
    this.add.tween(obj.scale).to({
      x: 0.75,
      y: 0.75
    }, 100, "Linear", true, 0, 0, true);
    // Click sound
    if (SAVE.config.sound === true) {
      this.click.play();
    }

    if (SAVE.player.items[obj.data.name] >= 1 && (ITEMS[obj.data.name].type == 0 || Object.keys(SAVE.monster).length !== 0)) {
      ITEMS[obj.data.name].use();
      SAVE.player.items[obj.data.name] -= 1;

      this.updateText(obj, ((ITEMS[obj.data.name].on_buy === true) ? ("BOUGHT AND USED " + obj.data.name) : ("USED " + obj.data.name)));
    }
  },
  save: function() {
    this.saveicon.alpha = 100;
    var save = JSON.stringify(SAVE);
    localStorage.setItem("PocketSmash", save);
    setTimeout(function(saveicon) {
      saveicon.alpha = 0;
    }, 1000, this.saveicon);
  },
  updateText: function(obj, text) {
    // Update the announcement
    this.announcement.setText(text);

    // Update money view
    this.money.setText(SAVE.player.money);

    // Update the items info
    this.item_counts[obj.data.name].setText("Inventory - " + SAVE.player.items[obj.data.name] + "\nCost - " + ITEMS[obj.data.name].cost);
  }
};
