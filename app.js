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

app.get("/new", async (req, res) => {
  const players = await Player.find({});
  res.render("new", { players });
});

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

app.get("/newplayer", async (req, res) => {
  res.render("newplayer");
});

app.post("/newplayer", async (req, res) => {
  const player = new Player(req.body);
  await player.save();
  res.redirect("/");
});

app.post("/new", async (req, res) => {
  try {
    const playerName = req.body.name; // Get the selected player's name from the form

    // Find the player by name
    const player = await Player.findOne({ name: playerName });

    if (player) {
      // Player exists, add the new score to the player's scores array
      player.scores.push(parseInt(req.body.scores)); // Assuming scores are integers
      await player.save(); // Save the updated player data
    } else {
      // Handle case where the player doesn't exist (optional)
      console.log(`Player ${playerName} not found.`);
      // You may choose to create a new player here if needed
    }

    res.redirect("/"); // Redirect back to the homepage or wherever needed after updating the score
  } catch (err) {
    // Handle errors appropriately
    console.error(err);
    res.status(500).send("Error occurred while adding score.");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("serving on port 3000");
});
