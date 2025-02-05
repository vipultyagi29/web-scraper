const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
  title: String,
  date: String,
  venue: String,
  link: String,
});

module.exports = mongoose.model("Event", EventSchema);