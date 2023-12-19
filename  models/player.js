const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const playerSchema = new Schema({
  name: String,
  scores: [Number],
});

module.exports = mongoose.model("Player", playerSchema);
