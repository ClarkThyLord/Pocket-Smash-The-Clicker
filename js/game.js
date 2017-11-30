GAME.GAME = function(game) {};

GAME.GAME.prototype = {
  create: function() {
    // Setup variables
    this.ending = false;
    this.player = {}; // Object of player
    this.enemy = {}; // Object of enemy

    this.area = {
      "current": 0, // What area we're on
      "object": null // Refrence to areas object
    };

    // Start of scene setup
    this.setupArea();

    // Setup player
    // Make a refrence to the player's monster data
    this.player.data = SAVE.monster;

    // Setup player's ground
    var ground = this.add.sprite(160, 570, "game_ground");
    ground.anchor.x = ground.anchor.y = 0.5;

    // Setup player's monster
    this.player.monster = this.add.sprite(0, 0, "monster_" + this.player.data.name);
    this.player.monster.anchor.x = 0.5;
    this.player.monster.anchor.y = 1;
    this.player.monster.inputEnabled = true;
    this.player.monster.events.onInputDown.add(this.ultimateCharge, this);
    ground.addChild(this.player.monster);

    // Setup player's health bar
    this.player.life = this.add.sprite(-100, 0, "G_life");
    this.player.life.anchor.y = 0.5;
    this.player.life.scale.x = 0.05 * (this.player.data.life / 10);
    ground.addChild(this.player.life);

    // Setup player's heal particles
    this.player.heal = this.add.emitter(0, 0, 100);
    this.player.heal.makeParticles("game_heal");
    this.player.monster.addChild(this.player.heal);

    // Setup player's damage particles
    this.player.dmg = this.add.emitter(0, 0, 100);
    this.player.dmg.makeParticles("game_damage");
    this.player.monster.addChild(this.player.dmg);

    // Setup player's ultimate bar
    this.player.ult = this.add.sprite(300, 225, "G_ult");
    this.player.ult.anchor.y = 0.5;
    this.player.ult.scale.x = 0.01 * (this.player.data.ult / 10);

    // Setup player's charge particles
    this.player.charge = this.add.emitter(0, 0, 100);
    this.player.charge.makeParticles("game_charge");

    // Setup enemy
    // Setup enemie's ground
    ground = this.add.sprite(660, 525, "game_ground");
    ground.anchor.x = ground.anchor.y = 0.5;

    // Setup enemy monster
    this.enemy.monster = this.add.sprite(0, 0, "monster_cacus");
    this.enemy.monster.anchor.x = 0.5;
    this.enemy.monster.anchor.y = 1;
    this.enemy.monster.inputEnabled = true;
    this.enemy.monster.events.onInputDown.add(this.enemyDamage, this);
    ground.addChild(this.enemy.monster);

    // Setup monster's life bar
    this.enemy.life = this.add.sprite(-100, 0, "G_life");
    this.enemy.life.anchor.y = 0.5;
    ground.addChild(this.enemy.life);

    // Setup enemie's damage particles
    this.enemy.dmg = this.add.emitter(0, 0, 1000);
    this.enemy.dmg.makeParticles("game_damage");

    // Spawn the enemy monster
    this.enemySpawn();

    // Setup GUI
    // Setup saveicon
    this.saveicon = this.add.sprite(725, 50, "G_logo");
    this.saveicon.anchor.x = this.saveicon.anchor.y = 0.5;
    this.saveicon.scale.x = this.saveicon.scale.y = 0.15;
    this.saveicon.alpha = 0;

    this.announcement = this.add.text(400, 150, "TAP ON THE ENEMY TO ATTACK!!!\nTAP ON YOUR MONSTER TO CHARGE ULTIMATE!!!", FONT);
    this.announcement.anchor.x = this.announcement.anchor.y = 0.5;

    var money = this.add.sprite(75, 50, "G_money");
    money.anchor.x = money.anchor.y = 0.5;
    this.money = this.add.text(50, 0, SAVE.player.money, FONT);
    this.money.anchor.y = 0.5;
    money.addChild(this.money);

    var help = this.add.sprite(375, 30, "mm_help");
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

    var stats = this.add.sprite(475, 30, "G_stats");
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

      this.stats();
    }, this);

    var retire = this.add.sprite(605, 30, "game_retire");
    retire.anchor.x = retire.anchor.y = 0.5;
    retire.inputEnabled = true;
    retire.events.onInputDown.add(function(obj, pointer) {
      // Click animation
      obj.scale.x = obj.scale.y = 1;
      this.add.tween(obj.scale).to({
        x: 0.75,
        y: 0.75
      }, 100, "Linear", true, 0, 0, true);

      this.retire();
    }, this);

    var store = this.add.sprite(735, 30, "G_store");
    store.anchor.x = store.anchor.y = 0.5;
    store.inputEnabled = true;
    store.events.onInputDown.add(function() {
      this.click.destroy();
      this.music.destroy();

      this.save();

      this.state.start("STORE");
    }, this);

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

    var cover = this.add.sprite(0, 0, "G_background");
    cover.inputEnabled = true;
    cover.events.onInputDown.add(function(obj) {
      // Click sound
      if (SAVE.config.sound === true) {
        this.click.play();
      }

      obj.destroy();

      // Start the game's cycle
      this.loop = this.time.events.loop(SAVE.player.game_speed, this.cycle, this);
    }, this);

    var start = this.add.sprite(0, 0, "game_start");
    start.alpha = 0;

    // Fade in and out
    this.add.tween(start).to({
      alpha: 1
    }, 1000, Phaser.Easing.Linear.None, true, 0, 1500, true);

    cover.addChild(start);
  },
  setupArea: function() {
    // Choose the area according to the players monster level
    this.area.current = Math.floor(SAVE.monster.level / 5.5);

    // Make sure that the area choosen isn't bigger than the areas length
    if (this.area.current >= AREAS.length) {
      this.area.current = AREAS.length - 1;
    }

    // Update area texture if it's not setup; or update if it's different
    if (this.area.object === null) {
      this.area.object = this.add.sprite(0, 0, "area_" + AREAS[this.area.current].name);
    } else {
      this.area.object.loadTexture("area_" + AREAS[this.area.current].name);
    }
  },
  cycle: function() {
    this.playerDamage();
    this.enemyDamage();
  },
  ultimateCharge: function(obj, pointer) {
    // Setup variables to prevent errors >_>
    obj = obj || {};
    pointer = pointer || {
      "x": 0,
      "y": 0
    };

    // Add to the player's ultimate charge
    this.player.data.ult += SAVE.player.ult_boost;

    if (this.player.data.ult >= 100) {
      this.ultimateExecute();
    } else {
      // Scale the player's ultimate bar
      this.player.ult.scale.x = 0.01 * (this.player.data.ult / 1);
    }

    // Emmit charge particles
    this.player.charge.x = pointer.x;
    this.player.charge.y = pointer.y;
    this.player.charge.start(true, 1000, null, 10);
  },
  ultimateExecute: function() {
    // Reset the player's ultimate charge
    this.player.data.ult = 0;

    // Update stats
    this.player.data.stats.ult_dealt += 1;
    SAVE.player.stats.ult_dealt += 1;

    // Execute the enemy
    this.enemyDeath();
  },
  playerCheck: function() {
    // Check if the player has leveled up according to his level
    if (this.player.data.xp / (150 * this.player.data.level) >= 1) {
      this.updateText("LEVEL UP!!!");

      this.playerHeal();

      // Update stats
      SAVE.player.stats.level_ups += 1;

      this.player.data.xp = this.player.data.xp - (150 * this.player.data.level);
      this.player.data.level += 1;

      // Update player's stats
      this.player.data.attack += this.player.data.attack * 0.13;
      this.player.data.defence += this.player.data.defence * 0.13;

      this.save();
      this.setupArea();
    }
  },
  playerHeal: function() {
    // Heal the player if he needs it
    if (this.player.data.life < 600) {
      this.player.data.life += (this.area.current + 1) * 50;

      // Emmit particles
      this.player.heal.start(true, 1000, null, 10);
    }
  },
  playerDamage: function() {
    // Formula: (random() * maxDmg) * (1 - ((def * 0.01) * defBoost))
    var dmg = Math.floor((Math.random() * (this.enemy.data.attack + 1)) * (1 - ((this.player.data.defence * 0.01) * SAVE.player.def_boost)));

    // Remove from player's life
    this.player.data.life -= dmg;

    // Update stats
    this.player.data.stats.dmg_received += 1;
    SAVE.player.stats.dmg_received += dmg;

    // Update the player's life bar
    this.player.life.scale.x = 0.05 * (this.player.data.life / 10);

    this.player.dmg.start(true, 1000, null, 10);

    if (this.player.data.life <= 0 || NaN) {
      this.playerDeath();
    }
  },
  playerDeath: function() {
    // Stop the game's cycle
    this.time.events.remove(this.loop);

    // Update stats
    SAVE.player.stats.deaths += 1;

    // Update the player's life bar
    this.player.life.scale.x = 0.0;

    this.ending = true;
    this.stats();
  },
  enemySpawn: function() {
    // Pick a valid monster from the current area
    var monster = AREAS[this.area.current].monsters[Math.floor(Math.random() * AREAS[this.area.current].monsters.length)];

    // Load the monsters texture
    this.enemy.monster.loadTexture("monster_" + monster);

    // Create a copy of the monster's stats
    this.enemy.data = Object.assign({}, MONSTERS[monster]);

    // Alter monster stats according to the area
    this.enemy.data.level = Math.floor(Math.random() * (this.area.current + 4)) + 1;
    this.enemy.data.life = Math.floor(this.enemy.data.life + (this.enemy.data.life * (this.enemy.data.level / 13)));
    this.enemy.data.attack = Math.floor(this.enemy.data.attack + (this.enemy.data.attack * (this.enemy.data.level / 13)));
    this.enemy.data.defence = Math.floor(this.enemy.data.defence + (this.enemy.data.defence * (this.enemy.data.level / 13)));

    // Scale enemie's life bar
    this.enemy.life.scale.x = 0.05 * (this.enemy.data.life / 10);

    // Check the player
    this.playerCheck();
  },
  enemyDamage: function(obj, pointer) {
    // Setup variables to prevent errors >_>
    obj = obj || null;
    pointer = pointer || {
      "x": 660,
      "y": 525
    };

    var dmg = (obj === null) ? Math.floor((Math.random() * (this.player.data.attack + 1)) * (1 + SAVE.player.dmg_boost * 0.01)) : (Math.floor((Math.random() * (this.enemy.data.attack + 1)) * (1 - ((this.player.data.defence * 0.01) * SAVE.player.def_boost)))) * SAVE.player.dmg_boost;

    // Remove from enemie's life
    this.enemy.data.life -= dmg;

    // Update the enemie's life bar
    this.enemy.life.scale.x = 0.05 * (this.enemy.data.life / 10);

    // Update stats
    this.player.data.stats.dmg_dealt += dmg;
    SAVE.player.stats.dmg_dealt += dmg;

    this.enemy.dmg.x = pointer.x;
    this.enemy.dmg.y = pointer.y;
    this.enemy.dmg.start(true, 1000, null, 10);

    if (this.enemy.data.life <= 0 || NaN) {
      this.enemyDeath();
    }
  },
  enemyDeath: function() {
    this.playerHeal();

    // Update stats
    this.player.data.stats.kills += 1;
    SAVE.player.stats.kills += 1;

    // Give the player xp
    this.player.data.xp += this.enemy.data.level * 11;

    // Get the enemies drop
    var loot = this.enemy.data.drops[Math.floor(Math.random() * 10)];

    if (loot != null) {
      if (loot == "capture" && SAVE.monsters.indexOf(this.enemy.data.name) === -1) {
        this.updateText("CAPTURED " + this.enemy.data.name + "!!!");

        SAVE.monsters.push(this.enemy.data.name);

        this.player.data.stats.captures += 1;
        SAVE.player.stats.captures += 1;
      } else if (isNaN(loot)) {
        this.updateText("OBTAINED " + loot + "!!!");

        if (loot in SAVE.player.items) {
          SAVE.player.items[loot] += 1;
        } else {
          SAVE.player.items[loot] = 1;
        }
      } else {
        this.updateText("FOUND " + loot + " COINS!!!");

        SAVE.player.money += loot;
        this.player.data.stats.money_total += 1;
        SAVE.player.stats.money_total += loot;
      }
    }

    // Spawn a new enemy
    this.enemySpawn();
  },
  stats: function() {
    var cover = this.add.sprite(0, 0, "G_background");
    cover.alpha = 0;

    var title = this.add.image(400, 75, "G_stats_title");
    title.anchor.x = title.anchor.y = 0.5;
    cover.addChild(title);

    // Face in the GUI
    this.add.tween(cover).to({
      alpha: 1
    }, 250, Phaser.Easing.Linear.None, true);

    // Enable input handeling
    cover.inputEnabled = true;
    cover.events.onInputDown.add(function(obj, pointer) {
      if (this.ending === true) {
        this.retire();
      } else {
        // Click sound
        if (SAVE.config.sound === true) {
          this.click.play();
        }

        obj.destroy();
      }
    }, this);

    // Setup monsters stats view
    var monster = this.add.sprite(400, 250, "monster_" + this.player.data.name);
    monster.anchor.x = monster.anchor.y = 0.5;
    cover.addChild(monster);

    var sword = this.add.sprite(300, 325, "G_sword");
    sword.anchor.x = sword.anchor.y = 0.5;
    sword.scale.x = sword.scale.y = 0.25;
    var attack = this.add.sprite(350, 325, "G_attack");
    cover.addChild(sword);
    attack.anchor.x = 0;
    attack.anchor.y = 0.5;
    attack.scale.x = 0.05 * (this.player.data.attack / 3);
    cover.addChild(attack);

    var shield = this.add.sprite(300, 375, "G_shield");
    shield.anchor.x = shield.anchor.y = 0.5;
    shield.scale.x = shield.scale.y = 0.25;
    var defence = this.add.sprite(350, 375, "G_defence");
    cover.addChild(shield);
    defence.anchor.x = 0;
    defence.anchor.y = 0.5;
    defence.scale.x = 0.05 * (this.player.data.defence / 5);
    cover.addChild(defence);

    var text = this.add.text(400, 500, "Level - " + this.player.data.level + "\nKills - " + this.player.data.stats.kills + "\nDamage Dealt - " + this.player.data.stats.dmg_dealt + "\nDamage Received - " + this.player.data.stats.dmg_received + "\nUltimates Dealt - " + this.player.data.stats.ult_dealt + "\nMoney Total - " + this.player.data.stats.money_total + "\nMonster Captures - " + this.player.data.stats.captures + " - 155", FONT);
    text.anchor.x = text.anchor.y = 0.5;
    cover.addChild(text);
  },
  retire: function() {
    // Check that stats have been shown before retiring
    if (this.ending == false) {
      this.playerDeath();
    } else {
      SAVE.monster = {};

      this.click.destroy();
      this.music.destroy();

      this.save();

      this.state.start("MAINMENU");
    }
  },
  updateText: function(text) {
    // Update the announcement
    this.announcement.setText(text);
    // Update money view
    this.money.setText(SAVE.player.money);
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
