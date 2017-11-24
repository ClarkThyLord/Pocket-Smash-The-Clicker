var ITEMS = {
  "health potion": {
    "name": "potion",
    "cost": 200,
    "type": 1, // 0: can be used anywhere, 1: can only be used ingame
    "use": function() {
      console.log("HEALING!!!");
      SAVE.monster.life += 100;
    }
  }
};
