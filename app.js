if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const Player = require("./ models/player");
const dbUrl = process.env.DB_URL;

mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("DaTaBaSe CoNnEcTeD!");
});

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  try {
    const players = await Player.find({}).lean(); // Convert query result to plain JS objects

    // Calculate average scores for each player
    players.forEach((player) => {
      if (player.scores.length > 0) {
        const sum = player.scores.reduce((acc, score) => acc + score, 0);
        player.averageScore = sum / player.scores.length;
      } else {
        player.averageScore = 0; // Handle case where player has no scores
      }
    });

    // Sort players based on their average scores (from lowest to highest)
    players.sort((a, b) => a.averageScore - b.averageScore);

    // Render the page with sorted players
    res.render("home", { players });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error occurred while fetching players.");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("serving on port 3000");
});
