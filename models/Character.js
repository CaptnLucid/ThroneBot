const mongoose = require("mongoose");

const characterSchema = new mongoose.Schema({
  name: String,
  class: String,
  combatPower: Number,
  strength: Number,
  dexterity: Number,
  wisdom: Number,
  perception: Number,
  hitChance: Number,
  rangedDefense: Number,
  magicDefense: Number,
  meleeDefense: Number,
  meleeEvasion: Number,
  rangedEvasion: Number,
  magicEvasion: Number,
  meleeEndurance: Number,
  rangedEndurance: Number,
  magicEndurance: Number,
  imageUrl: String,
  userId: String,
});

module.exports = mongoose.model("Character", characterSchema);
