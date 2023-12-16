const express = require("express");
const path = require("path");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  res.render("home");
});

app.listen(3000, () => {
  console.log("serving on port 3000");
});
