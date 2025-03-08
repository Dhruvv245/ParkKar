const Parking = require(`./../models/parkingModel`);
const Booking = require(`./../models/bookingModel`);
const AppError = require(`../utils/appError`);
const catchAsync = require(`../utils/catchAsync`);

exports.getHome = catchAsync(async (req, res, next) => {
  res.status(200).render('home', {
    title: `Home`,
  });
});

exports.findParking = catchAsync(async (req, res, next) => {
  const parkings = await Parking.find();
  res.status(200).render(`findParking`, {
    title: `Find Parking`,
    parkings,
  });
});

exports.getParking = catchAsync(async (req, res, next) => {
  const parking = await Parking.findOne({ slug: req.params.slug }).populate({
    path: `reviews`,
    fields: `review rating user`,
  });
  const bookings = await Booking.find({ parking: parking._id });
  if (!parking)
    return next(new AppError(`There is no parking with that name`, 404));
  res.status(200).render(`parking`, {
    title: `${parking.name}`,
    parking,
    bookings,
  });
});

exports.listParking = catchAsync(async (req, res, next) => {
  res.status(200).render(`listParking`, {
    title: `List Parking`,
  });
});

exports.getAccount = catchAsync(async (req, res, next) => {
  res.status(200).render(`accountTry`, {
    title: `Your account`,
  });
});

exports.getMyBookings = catchAsync(async (req, res, next) => {
  const bookings = await Booking.find({ user: req.user.id });
  const parkingIds = bookings.map((el) => el.parking);
  const parkings = await Parking.find({ _id: { $in: parkingIds } });
  res.status(200).render(`myBookings`, {
    title: `My Bookings`,
    parkings,
  });
});
