const AppError = require('../utils/appError');
const Parking = require(`./../models/parkingModel`);
const catchAsync = require(`../utils/catchAsync`);
const factory = require(`./factoryHandler`);

//Image Processing
const multer = require(`multer`);
const sharp = require(`sharp`);

const multerStorage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith(`image`)) {
    cb(null, true);
  } else {
    cb(new AppError(`Please upload only images!`, 400), false);
  }
};
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});
exports.uploadImages = upload.fields([
  { name: `ownershipImage`, maxCount: 1 },
  { name: `imageCover`, maxCount: 1 },
  { name: `images`, maxCount: 3 },
]);
exports.resizeImages = catchAsync(async (req, res, next) => {
  if (!req.files.ownershipImage || !req.files.imageCover || !req.files.images)
    return next();
  //Ownership Image
  req.body.ownershipImage = `proof-${req.user.id}-${Date.now()}-owner.jpeg`;
  await sharp(req.files.ownershipImage[0].buffer)
    .toFormat(`jpeg`)
    .toFile(`public/img/proofs/${req.body.ownershipImage}`);
  //Cover Image
  req.body.imageCover = `parking-${req.user.id}-${Date.now()}-cover.jpeg`;
  await sharp(req.files.imageCover[0].buffer)
    .resize(2000, 1333)
    .toFormat(`jpeg`)
    .jpeg({ quality: 90 })
    .toFile(`public/img/parkings/${req.body.imageCover}`);
  //Images
  req.body.images = [];
  await Promise.all(
    req.files.images.map(async (file, i) => {
      const filename = `parking-${req.user.id}-${Date.now()}-${i + 1}.jpeg`;
      req.body.images.push(filename);
      await sharp(file.buffer)
        .resize(2000, 1333)
        .toFormat(`jpeg`)
        .jpeg({ quality: 90 })
        .toFile(`public/img/parkings/${filename}`);
    })
  );
  next();
});

exports.createParking = factory.createOne(Parking);
exports.updateParking = factory.updateOne(Parking);
exports.getAllParkings = factory.getAll(Parking);
exports.getParking = factory.getOne(Parking, { path: `reviews` });
exports.deleteParking = factory.deleteOne(Parking);

exports.getParkingsWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(`,`);
  const radius = unit === `mi` ? distance / 3963.2 : distance / 6378.1;
  if (!lat || !lng) {
    next(
      new AppError(
        `Please provide latitude and longitude in the format lat,lng`,
        400
      )
    );
  }
  const parkings = await Parking.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });
  res.status(200).json({
    status: `success`,
    results: parkings.length,
    data: {
      data: parkings,
    },
  });
});

exports.getDistances = catchAsync(async (req, res, next) => {
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(`,`);
  const multiplier = unit === `mi` ? 0.000621371 : 0.001;
  if (!lat || !lng) {
    next(
      new AppError(
        `Please provide latitude and longitude in the format lat,lng`,
        400
      )
    );
  }
  const distances = await Parking.aggregate([
    {
      $geoNear: {
        near: {
          type: `Point`,
          coordinates: [lng * 1, lat * 1],
        },
        distanceField: `distance`,
        distanceMultiplier: multiplier,
      },
    },
    {
      $project: {
        distance: 1,
        name: 1,
      },
    },
  ]);
  res.status(200).json({
    status: `success`,
    data: {
      data: distances,
    },
  });
});
