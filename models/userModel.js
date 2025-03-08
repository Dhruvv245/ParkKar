const mongoose = require(`mongoose`);
const validator = require(`validator`);
const crypto = require(`crypto`);
const bcrypt = require(`bcryptjs`);

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, `Please tell us your name`],
    trim: true,
  },
  email: {
    type: String,
    required: [true, `Please provide your email`],
    trim: true,
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, `Please provide a valid email`],
  },
  phoneNumber: {
    //Store phone numbers of only private parking owners
    type: String,
    trim: true,
    unique: true,
    sparse: true,
    validate: [validator.isMobilePhone, `Please provide a valid phone number`],
  },
  photo: {
    type: String,
  },
  role: {
    type: String,
    enum: [`user`, `owner`, `admin`],
    default: `user`,
  },
  password: {
    type: String,
    required: [true, `Please enter a password`],
    minlength: [8, `Password must have atleast 8 characters`],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, `Please confirm your password`],
    //This only works on CREATE and SAVE
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: `Passwords are not the same!`,
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

userSchema.pre(`save`, async function (next) {
  if (!this.isModified(`password`)) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre(`save`, function (next) {
  if (!this.isModified(`password`) || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString(`hex`);
  this.passwordResetToken = crypto
    .createHash(`sha256`)
    .update(resetToken)
    .digest(`hex`);
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

const User = mongoose.model(`User`, userSchema);

module.exports = User;
