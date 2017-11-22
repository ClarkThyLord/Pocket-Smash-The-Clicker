GAME.GAME = function(game) {};

GAME.GAME.prototype = {
  create: function() {
    // Setup variables
    this.area = 0;
    this.background = null;
    this.text = null;

    this.player = {};
    this.enemy = {};

    this.gui = [];

    this.money = null;

    this.saveIcon = null;

    this.soundIcon = null;
    this.sound = null;

    this.loop = null;

    // Start of scene setup
    this.setupArea();

    var money = this.add.sprite(150, 50, "icon_money");
    money.anchor.x = money.anchor.y = 0.5;
    this.money = this.add.text(50, 0, SAVE.player.money, FONT);
    this.money.anchor.y = 0.5;
    money.addChild(this.money);

    this.text = this.add.text(400, 150, "TAP ON THE ENEMY TO ATTACK!!!\nTAP ON YOUR MONSTER TO CHARGE ULT!!!", FONT);
    this.text.anchor.x = 0.5;
    this.text.anchor.y = 0.1;
    this.gui.push(this.text);

    var retire = this.add.sprite(485, 30, "game_retire");
    retire.anchor.x = retire.anchor.y = 0.5;
    retire.inputEnabled = true;
    retire.events.onInputDown.add(this.retire, this);
    this.gui.push(retire);

    var store = this.add.sprite(695, 30, "icon_store");
    store.anchor.x = store.anchor.y = 0.5;
    store.inputEnabled = true;
    store.events.onInputDown.add(this.store, this);
    this.gui.push(store);

    this.saveIcon = this.add.sprite(750, 50, "icon_save");
    this.saveIcon.anchor.x = this.saveIcon.anchor.y = 0.5;
    this.saveIcon.alpha = 0;
    this.gui.push(this.saveIcon);

    this.setupPlayer();
    this.setupMonster();

    // Bring GUI to the top
    for (var key in this.gui) {
      var obj = this.gui[key];
      obj.bringToTop();
    }

    // Setup music according to config
    this.soundIcon = (CONFIGURATION.music) ? this.add.sprite(50, 50, "noise_on") : this.add.sprite(50, 50, "noise_off");
    this.soundIcon.anchor.x = this.soundIcon.anchor.y = 0.5;
    this.soundIcon.scale.x = this.soundIcon.scale.y = 0.5;
    this.soundIcon.inputEnabled = true;
    this.soundIcon.events.onInputDown.add(this.toggleNoise, this);

    this.sound = this.add.audio("music");
    if (CONFIGURATION.music) {
      this.sound.play("", 0, 1, true);
    }

    this.loop = this.time.events.loop(100, this.attack, this);
  },
  store: function() {
    this.saveGame();
    this.sound.destroy();
    this.state.start("STORE");
  },
  retire: function() {
    SAVE.monster = {};
    this.saveGame();
    this.sound.destroy();
    this.state.start("MAINMENU");
  },
  setupArea: function() {
    this.area = Math.floor(SAVE.monster.level / 5.5);
    if (this.area > 1) {
      this.area = 1;
    }

    if (this.background == null) {
      this.background = this.add.sprite(0, 0, "area_" + AREAS[this.area].name);
    } {
      this.background.loadTexture("area_" + AREAS[this.area].name);
    }
  },
  setupPlayer: function() {
    this.player.ground = this.add.sprite(160, 570, "game_ground");
    this.player.ground.anchor.x = this.player.ground.anchor.y = 0.5;

    this.player.monster = this.add.sprite(0, 0, "monster_" + SAVE.monster.name);
    this.player.monster.anchor.x = 0.5;
    this.player.monster.anchor.y = 1;
    this.player.monster.inputEnabled = true;
    this.player.monster.events.onInputDown.add(this.monsterULT, this);
    this.player.ground.addChild(this.player.monster);

    this.player.data = SAVE.monster;

    this.player.life = this.add.sprite(-100, 0, "icon_life");
    this.player.life.anchor.y = 0.5;
    this.player.life.scale.x = 0.05 * (this.player.data.life / 10);
    this.gui.push(this.player.life);
    this.player.ground.addChild(this.player.life);

    this.player.ult = this.add.sprite(300, 150, "game_ult");
    this.player.ult.anchor.y = 0.5;
    this.player.ult.scale.x = 0.01 * (this.player.data.ult / 1);
    this.gui.push(this.player.ult);
  },
  playerCheck: function() {
    if (this.player.data.xp / (150 * this.player.data.level) >= 1) {
      this.updateText("LEVEL UP!!!");

      this.player.data.xp = this.player.data.xp - (150 * this.player.data.level);
      this.player.data.level += 1;

      if (this.player.data.life < 600) {
        this.player.data.life += this.player.data.life * 0.3;
      }

      this.player.data.attack += this.player.data.attack * 0.13;
      this.player.data.defence += this.player.data.defence * 0.13;

      this.saveGame();
      this.setupArea();
    }
  },
  playerDeath: function() {
    this.time.events.remove(this.loop);
    this.player.life.scale.x = 0.0;

    var death = this.add.sprite(0, 0, "game_death");
    death.alpha = 0;

    this.add.tween(death).to({
      alpha: 1
    }, 1000, Phaser.Easing.Linear.None, true);
    death.inputEnabled = true;
    death.events.onInputDown.add(this.retire, this);
  },
  setupMonster: function() {
    // Chooose a valid monster at random
    var pick = Math.floor(Math.random() * AREAS[this.area].monsters.length);

    this.enemy.ground = this.add.sprite(660, 525, "game_ground");
    this.enemy.ground.anchor.x = this.enemy.ground.anchor.y = 0.5;

    this.enemy.monster = this.add.sprite(0, 0, "monster_" + AREAS[this.area].monsters[pick]);
    this.enemy.monster.anchor.x = 0.5;
    this.enemy.monster.anchor.y = 1;
    this.enemy.monster.inputEnabled = true;
    this.enemy.monster.events.onInputDown.add(this.monsterDMG, this);
    this.enemy.ground.addChild(this.enemy.monster);

    // Setup monster stats
    this.enemy.data = Object.assign({}, MONSTERS[AREAS[this.area].monsters[pick]]);
    this.enemy.data.level = Math.floor(Math.random() * (this.area + 4)) + 1;
    this.enemy.data.life = Math.floor(this.enemy.data.life + (this.enemy.data.life * (this.enemy.data.level / 13)));
    this.enemy.data.attack = Math.floor(this.enemy.data.attack + (this.enemy.data.attack * (this.enemy.data.level / 13)));
    this.enemy.data.defence = Math.floor(this.enemy.data.defence + (this.enemy.data.defence * (this.enemy.data.level / 13)));

    this.enemy.life = this.add.sprite(-100, 0, "icon_life");
    this.enemy.life.anchor.y = 0.5;
    this.enemy.life.scale.x = 0.05 * (this.enemy.data.life / 10);
    this.gui.push(this.enemy.life);
    this.enemy.ground.addChild(this.enemy.life);
  },
  monsterDEATH: function() {
    // Heal the player
    if (this.player.data.life < 600) {
      this.player.data.life += (this.area + 1) * 50;
    }

    // Give the player xp
    this.player.data.xp += this.enemy.data.level * 11;

    // Get the enemies drop
    var loot = this.enemy.data.drops[Math.floor(Math.random() * 10)];

    if (loot != null) {
      if (loot == "capture" && SAVE.monsters.indexOf(this.enemy.data.name) === -1) {
        this.updateText("CAPTURED " + this.enemy.data.name + "!!!");

        SAVE.monsters.push(this.enemy.data.name);
      } else if (isNaN(loot)) {
        this.updateText("OBTAINED " + loot + "!!!");

        if (loot in SAVE.player.items) {
          SAVE.player.items[loot] += 1;
        } else {
          SAVE.player.items[loot] = 1;
        }
      } else {
        this.updateText("FOUND " + loot + "!!!");

        SAVE.player.money += loot;
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
  monsterULT: function() {
    this.player.data.ult += SAVE.player.ult_boost;
    if (this.player.data.ult >= 100) {
      this.monsterDEATH();

      this.player.data.ult = 0;
    }

    this.player.ult.scale.x = 0.01 * (this.player.data.ult / 1);
  },
  monsterDMG: function() {
    this.enemy.data.life -= (Math.floor((Math.random() * (this.enemy.data.attack + 1)) * (1 - ((this.player.data.defence * 0.01) * SAVE.player.def_boost)))) * SAVE.player.dmg_boost;
    if (this.enemy.data.life <= 0) {
      this.monsterDEATH();
    } else {
      this.enemy.life.scale.x = 0.05 * (this.enemy.data.life / 10);
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
    this.enemy.data.life -= Math.floor((Math.random() * (this.player.data.attack + 1)) * (1 + SAVE.player.dmg_boost * 0.01));
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
