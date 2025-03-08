const mongoose = require(`mongoose`);
const validator = require(`validator`);
const slugify = require(`slugify`);
const parkingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, `A parking must have a name`],
      unique: true,
      trim: true,
      maxlength: [
        40,
        `A parking name must have less or equal than 40 characters`,
      ],
    },
    slug: {
      type: String,
    },
    maxSlots: {
      type: Number,
      required: [true, `A parking must have a slot count`],
    },
    freeSlots: {
      type: Number,
      default: function () {
        return this.maxSlots;
      },
    },
    role: {
      type: String,
      enum: [`public`, `private`],
      default: `private`,
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, `Rating must be above 1`],
      max: [5, `Rating must be below 5`],
      set: (val) => Math.round(val * 10) / 10,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A parking must have a price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          return val < this.price;
        },
        message: `Discount price must be less than the actual price`,
      },
    },
    description: {
      type: String,
      required: [true, `A parking must have a description`],
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, `A parking must have a cover image`],
    },
    images: [String],
    ownershipImage: {
      type: String,
      required: [
        true,
        `Without providing the ownership proof parking cannot be listed`,
      ],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    secretParking: {
      type: Boolean,
      default: false,
    },
    location: {
      type: {
        type: String,
        default: `Point`,
        enum: [`Point`],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    owner: {
      type: mongoose.Schema.ObjectId,
      ref: `User`,
      required: [true, `A parking must have an owner`],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
parkingSchema.index({ price: 1, ratingsAverage: -1 });
parkingSchema.index({ location: `2dsphere` });
parkingSchema.virtual(`reviews`, {
  ref: `Reviews`,
  foreignField: `parking`,
  localField: `_id`,
});
//Document Middleware-
parkingSchema.pre(`save`, function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});
//Query Middleware-
parkingSchema.pre(/^find/, function (next) {
  this.find({ secretParking: { $ne: true } });
  this.start = Date.now();
  this.populate({
    path: `owner`,
    select: `-__v -passwordChangedAt`,
  });
  next();
});
const Parking = mongoose.model(`Parking`, parkingSchema);

module.exports = Parking;
