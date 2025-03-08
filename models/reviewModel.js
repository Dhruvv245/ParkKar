const mongoose = require(`mongoose`);
const Parking = require(`./parkingModel`);
const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, `Review cannot be empty!`],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: `User`,
      required: [true, `The review must belong to a user!`],
    },
    parking: {
      type: mongoose.Schema.ObjectId,
      ref: `Parking`,
      required: [true, `The review must belong to a parking!`],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reviewSchema.index({parking:1,user:1},{unique:true});//Preventing duplicate reviews

reviewSchema.statics.calcAverageRatings = async function(parkingId) {
  const stats = await this.aggregate([
    {
      $match: { parking: parkingId },
    },
    {
      $group: {
        _id: `$parking`,
        nRating: { $sum: 1 },
        avgRating: { $avg: `$rating` },
      },
    },
  ]);
  if(stats.length>0){
    await Parking.findByIdAndUpdate(parkingId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    });
  }else{
    await Parking.findByIdAndUpdate(parkingId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: `user`,
    select: `name photo`,
  });
  next();
});

reviewSchema.post(`save`, function () {
  this.constructor.calcAverageRatings(this.parking);
});

reviewSchema.pre(/^findOneAnd/,async function(next){
  this.r = await this.findOne();
  next();
});  

reviewSchema.post(/^findOneAnd/,async function(){
  await this.r.constructor.calcAverageRatings(this.r.parking);
});

const Review = mongoose.model(`Reviews`, reviewSchema);
module.exports = Review;
