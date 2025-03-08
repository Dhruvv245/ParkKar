const express = require(`express`);
const authController = require(`../controllers/authController`);
const bookingController = require(`../controllers/bookingController`);
const viewController = require(`../controllers/viewController`);

const router = express.Router();

router.get(
  `/`,
  bookingController.createBookingCheckout,
  authController.isLoggedIn,
  viewController.getHome
);
router.get(
  `/findParking`,
  authController.isLoggedIn,
  viewController.findParking
);
router.get(
  `/parking/:slug`,
  authController.isLoggedIn,
  viewController.getParking
);
router.get(`/me`, authController.protect, viewController.getAccount);
router.get(`/listParking`, authController.protect, viewController.listParking);
router.get(
  `/my-bookings`,
  authController.protect,
  viewController.getMyBookings
);

module.exports = router;
