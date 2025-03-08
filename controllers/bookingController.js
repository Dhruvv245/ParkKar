const stripe = require(`stripe`)(process.env.STRIPE_SECRET_KEY);
const Booking = require(`../models/bookingModel`);
const Parking = require(`../models/parkingModel`);
const catchAsync = require(`./../utils/catchAsync`);
const factory = require(`./factoryHandler`);

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  const parking = await Parking.findById(req.params.parkingId);
  const session = await stripe.checkout.sessions.create({
    payment_method_types: [`card`],
    mode: `payment`,
    success_url: `${req.protocol}://${req.get(`host`)}/?parking=${
      req.params.parkingId
    }&user=${req.user.id}&price=${parking.price}`,
    cancel_url: `${req.protocol}://${req.get(`host`)}/parking/${parking.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.parkingId,
    billing_address_collection: `required`,
    line_items: [
      {
        price_data: {
          currency: 'inr',
          product_data: {
            name: `${parking.name}`,
            description: parking.description,
            images: [
              `https://lh5.googleusercontent.com/p/AF1QipNRv9WAjfWgD1ey4zmNGmA3KV5cS8JWutX1iH6k=w260-h175-n-k-no`,
            ],
          },
          unit_amount: parking.price * 100,
        },
        quantity: 1,
      },
    ],
  });
  //3.Send session to client
  res.status(200).json({
    status: `success`,
    session,
  });
});

//Temporary solution till site is live
exports.createBookingCheckout = catchAsync(async (req, res, next) => {
  const { parking, user, price } = req.query;
  if (!parking && !user && !price) return next();
  await Booking.create({
    parking,
    user,
    price,
  });
  res.redirect(req.originalUrl.split(`?`)[0]);
});

exports.getParkingBookings = catchAsync(async (req, res, next) => {
  const parkingId = req.params.id;
  const parkingBookings = await Booking.find({ parking: parkingId });
  res.status(200).json({
    status: `success`,
    parkingBookings,
  });
});

exports.getAllBookings = factory.getAll(Booking);
exports.getBooking = factory.getOne(Booking);
exports.createBooking = factory.createOne(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);
