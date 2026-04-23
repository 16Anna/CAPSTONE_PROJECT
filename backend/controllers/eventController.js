const Event = require("../models/Event");

// get all events
const getEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// create event
const createEvent = async (req, res) => {
  try {
    const { title, description, date, venue, totalSeats } = req.body;

    const event = new Event({
      title,
      description,
      date,
      venue,
      totalSeats,
      bookedSeats: 0
    });

    const savedEvent = await event.save();
    res.status(201).json(savedEvent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// delete event
const deleteEvent = async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: "Event deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getEvents,
  createEvent,
  deleteEvent
};