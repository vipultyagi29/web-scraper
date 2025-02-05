const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Event = require("./models/Event");
const scrapeEvents = require("./scraper");
const cron = require("node-cron");
require("dotenv").config();

const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true
  })
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error("MongoDB Connection Error:", err));
  

// Home Route - Fetch & Render Events
app.get("/", async (req, res) => {
  const events = await Event.find();
  res.render("index", { events });
});

// Scraper runs every 24 hours
cron.schedule("0 0 * * *", () => {
  console.log("Running scheduled scraper...");
  scrapeEvents();
});

// Run scraper once on startup
scrapeEvents();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
