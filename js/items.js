var ITEMS = {
  "health potion": {
    "name": "health potion",
    "cost": 250,
    "type": 1, // 0: can be used anywhere, 1: can only be used ingame
    "on_buy": false, // Weather item should be used on buy
    "use": function() {
      SAVE.monster.life += 100;
    }
  },
  "ultimate potion": {
    "name": "ultimate potion",
    "cost": 200,
    "type": 1, // 0: can be used anywhere, 1: can only be used ingame
    "on_buy": false, // Weather item should be used on buy
    "use": function() {
      SAVE.monster.ult += 100;
    }
  },
  "temp attack boost": {
    "name": "temp attack boost",
    "cost": 150,
    "type": 1, // 0: can be used anywhere, 1: can only be used ingame
    "on_buy": false, // Weather item should be used on buy
    "use": function() {
      SAVE.monster.attack += 1;
    }
  },
  "temp defence boost": {
    "name": "temp defence boost",
    "cost": 150,
    "type": 1, // 0: can be used anywhere, 1: can only be used ingame
    "on_buy": false, // Weather item should be used on buy
    "use": function() {
      SAVE.monster.defence += 1;
    }
  },
  "temp general boost": {
    "name": "temp general boost",
    "cost": 200,
    "type": 1, // 0: can be used anywhere, 1: can only be used ingame
    "on_buy": false, // Weather item should be used on buy
    "use": function() {
      SAVE.monster.attack += 0.5;
      SAVE.monster.defence += 0.5;
    }
  },
  "perm health boost": {
    "name": "perm health boost",
    "cost": 300,
    "type": 0, // 0: can be used anywhere, 1: can only be used ingame
    "on_buy": true, // Weather item should be used on buy
    "use": function() {
      SAVE.player.life_boost += 0.10;
    }
  },
  "perm attack boost": {
    "name": "perm attack boost",
    "cost": 300,
    "type": 0, // 0: can be used anywhere, 1: can only be used ingame
    "on_buy": true, // Weather item should be used on buy
    "use": function() {
      SAVE.player.dmg_boost += 0.25;
    }
  },
  "perm defence boost": {
    "name": "perm defence boost",
    "cost": 300,
    "type": 0, // 0: can be used anywhere, 1: can only be used ingame
    "on_buy": true, // Weather item should be used on buy
    "use": function() {
      SAVE.player.def_boost += 0.005;
    }
  },
  "perm general boost": {
    "name": "perm general boost",
    "cost": 600,
    "type": 0, // 0: can be used anywhere, 1: can only be used ingame
    "on_buy": true, // Weather item should be used on buy
    "use": function() {
      SAVE.player.life_boost += 0.05;
      SAVE.player.dmg_boost += 0.15;
      SAVE.player.def_boost += 0.0025;
    }
  },
  "perm speed boost": {
    "name": "perm speed boost",
    "cost": 1000,
    "type": 0, // 0: can be used anywhere, 1: can only be used ingame
    "on_buy": true, // Weather item should be used on buy
    "use": function() {
      if (SAVE.player.game_speed > 1) {
        SAVE.player.game_speed -= 0.5;
      }
    }
  },
  "infinite money": {
    "name": "infinite money",
    "cost": 100000,
    "type": 0, // 0: can be used anywhere, 1: can only be used ingame
    "on_buy": true, // Weather item should be used on buy
    "use": function() {
      SAVE.money = Infinity;
    }
  },
  "temp infinite health": {
    "name": "temp infinite health",
    "cost": Infinity,
    "type": 1, // 0: can be used anywhere, 1: can only be used ingame
    "on_buy": false, // Weather item should be used on buy
    "use": function() {
      SAVE.monster.life = Infinity;
    }
  }
};
