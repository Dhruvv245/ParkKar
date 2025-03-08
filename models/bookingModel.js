const mongoose = require(`mongoose`);

const bookingSchema = new mongoose.Schema({
  parking: {
    type: mongoose.Schema.ObjectId,
    ref: `Parking`,
    required: [true, `A booking must belong to a parking`],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: `User`,
    required: [true, `A booking must belong to a user`],
  },
  price: {
    type: Number,
    required: [true, `A booking must have a price`],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  paid: {
    type: Boolean,
    default: true,
  },
});
bookingSchema.pre(/^find/, function (next) {
  this.populate(`user`).populate({
    path: `parking`,
    select: `name`,
  });
  next();
});

const Booking = mongoose.model(`Booking`, bookingSchema);

module.exports = Booking;
