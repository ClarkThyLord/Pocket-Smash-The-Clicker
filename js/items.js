var ITEMS = {
  "health potion": {
    "name": "health potion",
    "cost": 250,
    "type": 1, // 0: can be used anywhere, 1: can only be used ingame
    "use": function() {
      SAVE.monster.life += 100;
    }
  },
  "ultimate potion": {
    "name": "ultimate potion",
    "cost": 200,
    "type": 1, // 0: can be used anywhere, 1: can only be used ingame
    "use": function() {
      SAVE.monster.ult += 100;
    }
  },
  "temporary attack boost": {
    "name": "temporary attack boost",
    "cost": 150,
    "type": 1, // 0: can be used anywhere, 1: can only be used ingame
    "use": function() {
      SAVE.monster.attack += 1;
    }
  },
  "temporary defence boost": {
    "name": "temporary defence boost",
    "cost": 150,
    "type": 1, // 0: can be used anywhere, 1: can only be used ingame
    "use": function() {
      SAVE.monster.defence += 1;
    }
  },
  "temporary general boost": {
    "name": "temporary general boost",
    "cost": 200,
    "type": 1, // 0: can be used anywhere, 1: can only be used ingame
    "use": function() {
      SAVE.monster.attack += 0.5;
      SAVE.monster.defence += 0.5;
    }
  },
  "permanent health boost": {
    "name": "permanent health boost",
    "cost": 300,
    "type": 0, // 0: can be used anywhere, 1: can only be used ingame
    "use": function() {
      SAVE.player.life_boost += 1;
    }
  },
  "permanent attack boost": {
    "name": "permanent attack boost",
    "cost": 300,
    "type": 0, // 0: can be used anywhere, 1: can only be used ingame
    "use": function() {
      SAVE.player.dmg_boost += 1;
    }
  },
  "permanent defence boost": {
    "name": "permanent defence boost",
    "cost": 300,
    "type": 0, // 0: can be used anywhere, 1: can only be used ingame
    "use": function() {
      SAVE.player.def_boost += 1;
    }
  },
  "permanent general boost": {
    "name": "permanent general boost",
    "cost": 600,
    "type": 0, // 0: can be used anywhere, 1: can only be used ingame
    "use": function() {
      SAVE.player.life_boost += 0.5;
      SAVE.player.dmg_boost += 0.5;
      SAVE.player.def_boost += 0.5;
    }
  },
  "permanent speed boost": {
    "name": "permanent speed boost",
    "cost": 1000,
    "type": 0, // 0: can be used anywhere, 1: can only be used ingame
    "use": function() {
      SAVE.player.game_speed -= 0.5;
    }
  },
  "infinite money": {
    "name": "infinite money",
    "cost": 100000,
    "type": 0, // 0: can be used anywhere, 1: can only be used ingame
    "use": function() {
      SAVE.money = Infinity;
    }
  },
  "temporary infinite health": {
    "name": "temporary infinite health",
    "cost": Infinity,
    "type": 1, // 0: can be used anywhere, 1: can only be used ingame
    "use": function() {
      SAVE.monster.life = Infinity;
    }
  }
};
