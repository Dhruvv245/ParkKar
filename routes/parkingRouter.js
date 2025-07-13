const express = require(`express`);
const parkingController = require(`../controllers/parkingController`);
const authController = require(`../controllers/authController`);
const freeSlotsController = require(`../controllers/freeSlotsController`);
const reviewRouter = require(`./reviewRouter`);

const router = express.Router();

router.use(`/:parkingId/reviews`, reviewRouter);
router.post('/slot-update', freeSlotsController.receiveSlotUpdate);
router
  .route(`/parkings-within/:distance/center/:latlng/unit/:unit`)
  .get(parkingController.getParkingsWithin);
router
  .route(`/distances/:latlng/unit/:unit`)
  .get(parkingController.getDistances);
router
  .route(`/`)
  .get(parkingController.getAllParkings)
  .post(
    authController.protect,
    parkingController.uploadImages,
    parkingController.resizeImages,
    parkingController.createParking
  );
router
  .route(`/:id`)
  .get(parkingController.getParking)
  .patch(
    authController.protect,
    authController.restrictTo(`admin`, `owner`),
    parkingController.updateParking
  )
  .delete(
    authController.protect,
    authController.restrictTo(`admin`, `owner`),
    parkingController.deleteParking
  );

module.exports = router;
