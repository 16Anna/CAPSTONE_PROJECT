const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: String,
  description: String,
  date: String,
  venue: String,
  totalSeats: Number,
  bookedSeats: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model("Event", eventSchema);