const fs = require(`fs`);
const mongoose = require(`mongoose`);
const dotenv = require(`dotenv`);
dotenv.config({ path: `./../../config.env` });
const Parking = require(`./../../models/parkingModel`);
const User = require(`./../../models/userModel`);
const Review = require(`./../../models/reviewModel`);
const DB = process.env.DATABASE.replace(
  `<PASSWORD>`,
  process.env.DATABASE_PASSWORD
);
mongoose.connect(DB).then(() => {
  console.log(`Connected to DB`);
});

const parkings = JSON.parse(
  fs.readFileSync(`${__dirname}/parkings.json`, `utf-8`)
);
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, `utf-8`));
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, `utf-8`)
);

const importData = async () => {
  try {
    await Parking.create(parkings);
    await User.create(users, { validateBeforeSave: false });
    await Review.create(reviews);
    console.log(`Data successfully loaded`);
  } catch (err) {
    console.log(err.message);
  }
  process.exit();
};

const deleteData = async () => {
  try {
    await Parking.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log(`Data successfully deleted`);
  } catch (err) {
    console.log(err.message);
  }
  process.exit();
};

if (process.argv[2] === `--import`) {
  importData();
} else if (process.argv[2] === `--delete`) {
  deleteData();
}
