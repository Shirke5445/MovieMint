const router = require("express").Router();
const Razorpay = require("razorpay");
const authMiddleware = require("../middlewares/authMiddleware");
const Booking = require("../models/bookingModel");
const Show = require("../models/showModel");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY,
  key_secret: process.env.RAZORPAY_SECRET,
});

// create Razorpay order
router.post("/make-payment", authMiddleware, async (req, res) => {
  try {
    const options = {
      amount: req.body.amount,
      currency: "INR",
      receipt: "movie_booking",
    };

    const order = await razorpay.orders.create(options);

    res.send({
      success: true,
      data: order,
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

// book show
router.post("/book-show", authMiddleware, async (req, res) => {
  try {
    const newBooking = new Booking(req.body);
    await newBooking.save();

    const show = await Show.findById(req.body.show);

    await Show.findByIdAndUpdate(req.body.show, {
      bookedSeats: [...show.bookedSeats, ...req.body.seats],
    });

    res.send({
      success: true,
      message: "Show booked successfully",
      data: newBooking,
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

// get bookings
router.get("/get-bookings", authMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.userId })

      .populate("show")
      .populate("user")
      .populate({
        path: "show",
        populate: [{ path: "movie" }, { path: "theatre" }],
      });

    res.send({
      success: true,
      data: bookings,
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
