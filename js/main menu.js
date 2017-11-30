GAME.MAINMENU = function(game) {};

GAME.MAINMENU.prototype = {
  create: function() {
    // Setup variables
    this.current = 0; // Monster we're viewing
    this.filtering = (SAVE.favorites.length !== 0) ? true : false; // Weather to only show favoriteted monster

    // Start of scene setup
    // Background image
    this.add.image(0, 0, "G_background");

    var title = this.add.image(400, 50, "mm_title");
    title.anchor.x = title.anchor.y = 0.5;

    // Setup monster managing
    var frame = this.add.image(200, 300, "mm_frame");
    frame.anchor.x = frame.anchor.y = 0.5;

    var monster = (this.filtering === true) ? SAVE.favorites[0] : SAVE.monsters[0];
    this.monster = this.add.image(0, 0, "monster_" + monster);
    this.monster.anchor.x = this.monster.anchor.y = 0.5;
    this.monster.data.name = monster;
    frame.addChild(this.monster);

    this.text = this.add.text(0, 125, monster, FONT);
    this.text.anchor.x = this.text.anchor.y = 0.5;
    this.monster.addChild(this.text);

    this.star = this.add.sprite(400, 145, (SAVE.favorites.indexOf(this.monster.data.name) !== -1) ? "mm_star_on" : "mm_star_off");
    this.star.anchor.x = this.star.anchor.y = 0.5;
    this.star.inputEnabled = true;
    this.star.events.onInputDown.add(function(obj, pointer) {
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

      // Check if current monster is in favorites
      var result = SAVE.favorites.indexOf(this.monster.data.name);
      if (result !== -1) {
        // Remove monster from favorites if found
        SAVE.favorites.splice(result, 1);
        obj.loadTexture("mm_star_off");

        if (this.filtering === true && SAVE.favorites.length === 0) {
          this.filter.loadTexture("mm_all");
          this.filtering = false;
          this.updateMonster();
        } else if (this.filtering === true) {
          this.current = 0;
          this.updateMonster();
        }
      } else {
        // Add monster to favorites if not found
        SAVE.favorites.push(this.monster.data.name);
        obj.loadTexture("mm_star_on");
      }
    }, this);

    this.filter = this.add.sprite(575, 145, "mm_" + ((SAVE.favorites.length !== 0) ? "favorites" : "all"));
    this.filter.anchor.x = this.filter.anchor.y = 0.5;
    this.filter.inputEnabled = true;
    this.filter.events.onInputDown.add(function(obj, pointer) {
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

      if (this.filtering === false && SAVE.favorites.length !== 0) {
        obj.loadTexture("mm_favorites");

        this.filtering = true;
        this.current = 0;
        this.updateMonster();
      } else if (this.filtering === true) {
        obj.loadTexture("mm_all");

        this.filtering = false;
        this.current = 0;
        this.updateMonster();
      }
    }, this);

    var heart = this.add.image(425, 250, "G_heart");
    heart.anchor.x = heart.anchor.y = 0.5;
    heart.scale.x = heart.scale.y = 0.25;
    this.life = this.add.image(150, 0, "G_life");
    this.life.anchor.y = 0.5;
    this.life.scale.x = this.life.scale.y = 3;
    heart.addChild(this.life);

    var sword = this.add.image(425, 315, "G_sword");
    sword.anchor.x = sword.anchor.y = 0.5;
    sword.scale.x = sword.scale.y = 0.25;
    this.attack = this.add.image(150, 0, "G_attack");
    this.attack.anchor.y = 0.5;
    this.attack.scale.x = this.attack.scale.y = 3;
    sword.addChild(this.attack);

    var shield = this.add.image(425, 380, "G_shield");
    shield.anchor.x = shield.anchor.y = 0.5;
    shield.scale.x = shield.scale.y = 0.25;
    this.defence = this.add.image(150, 0, "G_defence");
    this.defence.anchor.y = 0.5;
    this.defence.scale.x = this.defence.scale.y = 3;
    shield.addChild(this.defence);

    this.type = this.add.sprite(450, 465, "G_earth");
    this.type.anchor.x = this.type.anchor.y = 0.5;
    this.type.scale.x = this.type.scale.y = 0.50;

    var left = this.add.sprite(125, 545, "mm_arrow");
    left.anchor.x = left.anchor.y = 0.5;
    left.inputEnabled = true;
    left.events.onInputDown.add(function(obj, pointer) {
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

      if (this.current > 0) {
        this.current -= 1;

        this.updateMonster();
      }
    }, this);

    var right = this.add.sprite(260, 545, "mm_arrow");
    right.anchor.x = right.anchor.y = 0.5;
    right.angle = 180;
    right.inputEnabled = true;
    right.events.onInputDown.add(function(obj, pointer) {
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

      if ((this.filtering === true && this.current < (SAVE.favorites.length - 1)) || (this.filtering === false && this.current < (SAVE.monsters.length - 1))) {
        this.current += 1;

        this.updateMonster();
      }
    }, this);

    var start = this.add.sprite(605, 500, "mm_start");
    start.anchor.x = start.anchor.y = 0.5;
    start.inputEnabled = true;
    start.events.onInputDown.add(function(obj, pointer) {
      // Click animation
      obj.scale.x = obj.scale.y = 1;
      this.add.tween(obj.scale).to({
        x: 0.75,
        y: 0.75
      }, 100, "Linear", true, 0, 0, true);

      // Setup monster for playing
      SAVE.monster = Object.assign({}, MONSTERS[this.monster.data.name]);
      SAVE.monster.stats = {
        "kills": 0,
        "dmg_received": 0,
        "dmg_dealt": 0,
        "ult_dealt": 0,
        "money_total": 0,
        "captures": 0
      };

      this.click.destroy();
      this.music.destroy();
      this.save();

      this.state.start("GAME");
    }, this);

    var help = this.add.sprite(375, 575, "mm_help");
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
      slide.events.onInputDown.add(function(obj, pointer) { // Click sound
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

    var stats = this.add.sprite(475, 570, "G_stats");
    stats.anchor.x = stats.anchor.y = 0.5;
    stats.inputEnabled = true;
    stats.events.onInputDown.add(function(obj, pointer) {
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

      var cover = this.add.sprite(0, 0, "G_background");
      cover.inputEnabled = true;
      cover.events.onInputDown.add(function(obj, pointer) {
        // Click sound
        if (SAVE.config.sound === true) {
          this.click.play();
        }

        obj.destroy();
      }, this);

      var title = this.add.image(400, 75, "G_stats_title");
      title.anchor.x = title.anchor.y = 0.5;
      cover.addChild(title);

      var text = this.add.text(400, 375, "Game Speed - " + SAVE.player.game_speed + "\nLife Boost - " + SAVE.player.life_boost + "%\nAttack Boost - " + SAVE.player.dmg_boost + "\nDefence Boost - " + SAVE.player.def_boost + "\nTotal Levelups - " + SAVE.player.stats.level_ups + "\nTotal Deaths - " + SAVE.player.stats.deaths + "\nTotal Kills - " + SAVE.player.stats.kills + "\nDamage Received - " + SAVE.player.stats.dmg_received + "\nDamage Dealt - " + SAVE.player.stats.dmg_dealt + "\nUltimates Dealt - " + SAVE.player.stats.ult_dealt + "\nLifetime Money - " + SAVE.player.stats.money_total + "\nCaptured Monsters - " + SAVE.player.stats.captures + " - 155", FONT);
      text.anchor.x = text.anchor.y = 0.5;
      cover.addChild(text);
    }, this);

    var store = this.add.sprite(605, 570, "G_store");
    store.anchor.x = store.anchor.y = 0.5;
    store.inputEnabled = true;
    store.events.onInputDown.add(function(obj, pointer) {
      // Click animation
      obj.scale.x = obj.scale.y = 1;
      this.add.tween(obj.scale).to({
        x: 0.75,
        y: 0.75
      }, 100, "Linear", true, 0, 0, true);

      this.click.destroy();
      this.music.destroy();

      this.save();

      this.state.start("STORE");
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

    // Lastly update viewing monster for whatever reason >_>
    this.updateMonster();
  },
  updateMonster: function() {
    var monster = (this.filtering === true) ? SAVE.favorites[this.current] : SAVE.monsters[this.current];
    this.monster.loadTexture("monster_" + monster);
    this.text.setText(monster);
    this.monster.data.name = monster;

    // Update favorite icon
    if (SAVE.favorites.indexOf(this.monster.data.name) !== -1) {
      this.star.loadTexture("mm_star_on");
    } else {
      this.star.loadTexture("mm_star_off");
    }

    // Update monster stats
    this.life.scale.x = 0.05 * ((MONSTERS[monster].life / 10) * (1 + SAVE.player.life_boost));
    this.attack.scale.x = 0.05 * ((MONSTERS[monster].attack / 3) * (1 + SAVE.player.dmg_boost));
    this.defence.scale.x = 0.05 * ((MONSTERS[monster].defence / 2.5) * (1 + SAVE.player.def_boost));
    this.type.loadTexture("G_" + MONSTERS[monster].type);
  },
  save: function() {
    this.saveicon.alpha = 100;
    var save = JSON.stringify(SAVE);
    localStorage.setItem("PocketSmash", save);
    setTimeout(function(saveicon) {
      saveicon.alpha = 0;
    }, 1000, this.saveicon);
  }
};
