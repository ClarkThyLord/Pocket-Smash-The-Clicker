GAME.GAME = function(game) {};

GAME.GAME.prototype = {
  create: function() {
    // Setup variables
    this.player = {};
    this.enemy = {};

    this.stage = {
      "num": 0,
      "object": null
    };

    // Start of scene setup
    this.setupStage();

    var money = this.add.sprite(150, 50, "icon_money");
    money.anchor.x = money.anchor.y = 0.5;
    this.money = this.add.text(50, 0, SAVE.player.money, FONT);
    this.money.anchor.y = 0.5;
    money.addChild(this.money);

    this.announcement = this.add.text(400, 150, "TAP ON THE ENEMY TO ATTACK!!!\nTAP ON YOUR MONSTER TO CHARGE ULTIMATE!!!", FONT);
    this.announcement.anchor.x = this.announcement.anchor.y = 0.5;

    var restart = this.add.sprite(750, 30, "icon_restart");
    restart.anchor.x = restart.anchor.y = 0.5;
    restart.inputEnabled = true;
    restart.events.onInputDown.add(this.restart, this);
    this.gui.push(restart);

    var store = this.add.sprite(665, 30, "icon_store");
    store.anchor.x = store.anchor.y = 0.5;
    store.inputEnabled = true;
    store.events.onInputDown.add(this.store, this);
    this.gui.push(store);

    this.saveIcon = this.add.sprite(750, 50, "icon_save");
    this.saveIcon.anchor.x = this.saveIcon.anchor.y = 0.5;
    this.saveIcon.alpha = 0;
    this.gui.push(this.saveIcon);

    // Setup player
    // Setup player's ground
    var ground = this.add.sprite(160, 570, "game_ground");
    ground.anchor.x = ground.anchor.y = 0.5;

    // Setup player's monster
    this.player.monster = this.add.sprite(0, 0, "monster_" + SAVE.monster.name);
    this.player.monster.anchor.x = 0.5; this.player.monster.anchor.y = 1;
    this.player.monster.inputEnabled = true;
    this.player.monster.events.onInputDown.add(this.ultimateCharge, this);
    ground.addChild(this.player.monster);

    // Setup player's charge particles
    this.player.charge = this.add.emitter(0, 0, 100);
    this.player.charge.makeParticles("game_charge");

    // Setup player's heal particles
    this.player.heal = this.add.emitter(0, 0, 100);
    this.player.heal.makeParticles("game_heal");
    this.player.monster.addChild(this.player.heal);

    // Make a refrence to the player's monster data
    this.player.data = SAVE.monster;

    // Setup player's health bar
    this.player.life = this.add.sprite(-100, 0, "G_life");
    this.player.life.anchor.y = 0.5;
    this.player.life.scale.x = 0.05 * (this.player.data.life / 10);
    ground.addChild(this.player.life);

    // Setup player's ultimate bar
    this.player.ult = this.add.sprite(300, 225, "G_ult");
    this.player.ult.anchor.y = 0.5;
    this.player.ult.scale.x = 0.01 * (this.player.data.ult / 10);

    // Setup enemy
    // Chooose a valid monster from the area at random
    var pick = Math.floor(Math.random() * AREAS[0].monsters.length);

    // Setup enemie's ground
    var ground = this.add.sprite(660, 525, "game_ground");
    ground.anchor.x = this.enemy.ground.anchor.y = 0.5;

    // Setup enemy monster
    this.enemy.monster = this.add.sprite(0, 0, "monster_" + AREAS[this.area].monsters[pick]);
    this.enemy.monster.anchor.x = 0.5;
    this.enemy.monster.anchor.y = 1;
    this.enemy.monster.inputEnabled = true;
    this.enemy.monster.events.onInputDown.add(this.damageMonster, this);
    ground.addChild(this.enemy.monster);

    // Setup enemie's damage particles
    this.enemy.dmg = this.add.emitter(0, 0, 100);
    this.enemy.dmg.makeParticles("game_damage");

    // Setup monster's stats
    this.enemy.data = Object.assign({}, MONSTERS[AREAS[this.area].monsters[pick]]);
    this.enemy.data.level = Math.floor(Math.random() * (this.area + 4)) + 1;
    this.enemy.data.life = Math.floor(this.enemy.data.life + (this.enemy.data.life * (this.enemy.data.level / 13)));
    this.enemy.data.attack = Math.floor(this.enemy.data.attack + (this.enemy.data.attack * (this.enemy.data.level / 13)));
    this.enemy.data.defence = Math.floor(this.enemy.data.defence + (this.enemy.data.defence * (this.enemy.data.level / 13)));

    // Setup monster's life bar
    this.enemy.life = this.add.sprite(-100, 0, "icon_life");
    this.enemy.life.anchor.y = 0.5;
    this.enemy.life.scale.x = 0.05 * (this.enemy.data.life / 10);
    this.enemy.ground.addChild(this.enemy.life);

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

      if (SAVE.config.sound === true) {
        SAVE.config.sound = false;
        obj.loadTexture("G_noise_off");
        this.sound.stop();
      } else {
        SAVE.config.sound = true;
        obj.loadTexture("G_noise_on");
        this.sound.play("", 0, 1, true);
      }

      this.save();
    }, this);

    this.sound = this.add.audio("G_music");
    if (SAVE.config.sound === true) {
      this.sound.play("", 0, 1, true);
    }

    var start = this.add.sprite(0, 0, "game_start");
    start.alpha = 0;
    start.inputEnabled = true;
    start.events.onInputDown.add(function(obj) {
      obj.destroy();

      this.loop = this.time.events.loop(SAVE.player.game_speed, this.attack, this);
    }, this);
    this.add.tween(start).to({
      alpha: 1
    }, 1000, Phaser.Easing.Linear.None, true, 0, 1500, true);
  },
  store: function() {
    this.saveGame();
    this.sound.destroy();
    this.state.start("STORE");
  },
  restart: function() {
    if (this.ending == false) {
      this.playerDeath();
    } else {
      SAVE.monster = {};
      this.saveGame();
      this.sound.destroy();
      this.state.start("MAINMENU");
    }
  },
  setupArea: function() {
    this.area = Math.floor(SAVE.monster.level / 5.5);
    if (this.area >= AREAS.length) {
      this.area = AREAS.length - 1;
    }

    if (this.background == null) {
      this.background = this.add.sprite(0, 0, "area_" + AREAS[this.area].name);
    } {
      this.background.loadTexture("area_" + AREAS[this.area].name);
    }
  },
  playerCheck: function() {
    if (this.player.data.xp / (150 * this.player.data.level) >= 1) {
      this.updateText("LEVEL UP!!!");

      this.player.data.xp = this.player.data.xp - (150 * this.player.data.level);
      this.player.data.level += 1;

      if (this.player.data.life < 600) {
        this.player.data.life += this.player.data.life * 0.3;
        this.player.heal.start(true, 1000, null, 10);
      }

      this.player.data.attack += this.player.data.attack * 0.13;
      this.player.data.defence += this.player.data.defence * 0.13;

      this.saveGame();
      this.setupArea();
    }
  },
  playerDeath: function() {
    this.ending = true;

    SAVE.player.stats.deaths += 1;

    this.time.events.remove(this.loop);
    this.player.life.scale.x = 0.0;

    var death = this.add.sprite(0, 0, "game_death");
    death.alpha = 0;

    this.add.tween(death).to({
      alpha: 1
    }, 1000, Phaser.Easing.Linear.None, true);
    death.inputEnabled = true;
    death.events.onInputDown.add(this.restart, this);

    var monster = this.add.sprite(400, 250, "monster_" + this.player.data.name);
    monster.anchor.x = monster.anchor.y = 0.5;

    var sword = this.add.sprite(300, 325, "icon_sword");
    sword.anchor.x = sword.anchor.y = 0.5;
    sword.scale.x = sword.scale.y = 0.25;
    var attack = this.add.sprite(350, 325, "icon_attack");
    attack.anchor.x = 0;
    attack.anchor.y = 0.5;
    attack.scale.x = 0.05 * (this.player.data.attack / 3);

    var shield = this.add.sprite(300, 375, "icon_shield");
    shield.anchor.x = shield.anchor.y = 0.5;
    shield.scale.x = shield.scale.y = 0.25;
    var defence = this.add.sprite(350, 375, "icon_defence");
    defence.anchor.x = 0;
    defence.anchor.y = 0.5;
    defence.scale.x = 0.05 * (this.player.data.defence / 5);

    var text = this.add.text(400, 500, "Level - " + this.player.data.level + "\nKills - " + this.player.data.stats.kills + "\nDamage Dealt - " + this.player.data.stats.dmg_dealt + "\nUltimate Dealt - " + this.player.data.stats.ult_dealt + "\nMoney Total - " + this.player.data.stats.money_total + "\nMonster Captures - " + this.player.data.stats.captures + " - 155", FONT);
    text.anchor.x = text.anchor.y = 0.5;
    death.addChild(text);

  },
  monsterDEATH: function() {
    // Heal the player
    if (this.player.data.life < 600) {
      this.player.data.life += (this.area + 1) * 50;
      this.player.heal.start(true, 1000, null, 10);
    }

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

    var pick = Math.floor(Math.random() * AREAS[this.area].monsters.length);

    this.enemy.monster.loadTexture("monster_" + AREAS[this.area].monsters[pick]);

    this.enemy.data = Object.assign({}, MONSTERS[AREAS[this.area].monsters[pick]]);
    this.enemy.data.level = Math.floor(Math.random() * (this.area + 4)) + 1;
    this.enemy.data.life = Math.floor(this.enemy.data.life + (this.enemy.data.life * (this.enemy.data.level / 13)));
    this.enemy.data.attack = Math.floor(this.enemy.data.attack + (this.enemy.data.attack * (this.enemy.data.level / 13)));
    this.enemy.data.defence = Math.floor(this.enemy.data.defence + (this.enemy.data.defence * (this.enemy.data.level / 13)));

    this.enemy.life.scale.x = 0.05 * (this.enemy.data.life / 10);

    // Check the player
    this.playerCheck();
  },
  monsterULT: function(obj, pointer) {
    this.player.data.ult += SAVE.player.ult_boost;
    if (this.player.data.ult >= 100) {
      this.monsterDEATH();

      this.player.data.ult = 0;
      this.player.data.stats.ult_dealt += 1;
      SAVE.player.stats.ult_dealt += 1;
    }

    this.player.ult.scale.x = 0.01 * (this.player.data.ult / 1);

    this.player.charge.x = pointer.x;
    this.player.charge.y = pointer.y;
    this.player.charge.start(true, 1000, null, 10);
  },
  monsterDMG: function(obj, pointer) {
    var dmg = (Math.floor((Math.random() * (this.enemy.data.attack + 1)) * (1 - ((this.player.data.defence * 0.01) * SAVE.player.def_boost)))) * SAVE.player.dmg_boost;

    this.player.data.stats.dmg_dealt += 1;
    SAVE.player.stats.dmg_dealt += dmg;

    this.enemy.data.life -= dmg;
    if (this.enemy.data.life <= 0) {
      this.monsterDEATH();
    } else {
      this.enemy.life.scale.x = 0.05 * (this.enemy.data.life / 10);

      this.enemy.dmg.x = pointer.x;
      this.enemy.dmg.y = pointer.y;
      this.enemy.dmg.start(true, 1000, null, 10);
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
  attack: function() {
    this.player.ult.scale.x = 0.01 * (this.player.data.ult / 1);

    // Formula: (random() * maxDmg) * (1 - ((def * 0.01) * defBoost))
    // console.log("ENEMY DMG: " + Math.floor((Math.random() * (this.enemy.data.attack + 1)) * (1 - ((this.player.data.defence * 0.01) * SAVE.player.def_boost))));
    this.player.data.life -= Math.floor((Math.random() * (this.enemy.data.attack + 1)) * (1 - ((this.player.data.defence * 0.01) * SAVE.player.def_boost)));
    this.player.life.scale.x = 0.05 * (this.player.data.life / 10);

    // Formula: (random() * maxDmg) * (1 + dmgBoost * 0.001)
    // console.log("PLAYER DMG: " + Math.floor((Math.random() * (this.player.data.attack + 1)) * (1 + SAVE.player.dmg_boost * 0.01)));
    var dmg = Math.floor((Math.random() * (this.player.data.attack + 1)) * (1 + SAVE.player.dmg_boost * 0.01));

    this.player.data.stats.dmg_dealt += dmg;
    SAVE.player.stats.dmg_dealt += dmg;

    this.enemy.data.life -= dmg;
    this.enemy.life.scale.x = 0.05 * (this.enemy.data.life / 10);

    if (this.player.data.life <= 0) {
      this.playerDeath();
    }
    if (this.enemy.data.life <= 0) {
      this.monsterDEATH();
    }
  },
  updateText: function(text) {
    this.text.setText(text);
    this.money.setText(SAVE.player.money);
  }
};
