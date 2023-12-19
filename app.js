if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const Player = require("./models/player.js");
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
  res.render("home");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("serving on port 3000");
});
