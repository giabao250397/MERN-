const mongoose = require("mongoose");
const argon2 = require("argon2");

const { isEmail } = require("validator");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    require: [true, "Please enter an email"],
    unique: true,
    lowercase: true,
    validate: [isEmail, "please enter a valid email"],
  },
  password: {
    type: String,
    require: [true, "Please enter an password"],
    minLength: [6, "Minium password length is 6 characters"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  // resetLink: {
  //   data: String,
  //   default: "",
  // },
});

UserSchema.pre("save", async function (next) {
  const hashedPassword = await argon2.hash(this.password);
  this.password = hashedPassword;
  next();
});

module.exports = mongoose.model("users", UserSchema);
