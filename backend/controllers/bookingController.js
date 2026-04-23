const Booking = require("../models/Booking");
const Event = require("../models/Event");

// create booking
const createBooking = async (req, res) => {
  try {
    const { userId, eventId } = req.body;

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.bookedSeats >= event.totalSeats) {
      return res.status(400).json({ message: "No seats available" });
    }

    const existing = await Booking.findOne({ userId, eventId });
    if (existing) {
      return res.status(400).json({ message: "Already booked" });
    }

    const booking = new Booking({ userId, eventId });
    await booking.save();

    event.bookedSeats += 1;
    await event.save();

    res.status(201).json({ message: "Booked successfully" });
  } catch (err) {
    console.log("CREATE BOOKING ERROR:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

// get user bookings
const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      userId: req.params.userId
    }).populate("eventId");

    res.json(bookings);
  } catch (err) {
    console.log("GET BOOKINGS ERROR:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

// cancel booking
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const event = await Event.findById(booking.eventId);

    if (event) {
      event.bookedSeats = Math.max(0, event.bookedSeats - 1);
      await event.save();
    }

    await booking.deleteOne();

    res.json({ message: "Booking cancelled" });
  } catch (err) {
    console.log("CANCEL BOOKING ERROR:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  createBooking,
  getUserBookings,
  cancelBooking
};