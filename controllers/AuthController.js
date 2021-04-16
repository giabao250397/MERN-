const argon2 = require("argon2");
const { response } = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");
// const mailgun = require("mailgun-js");
// const DOMAIN = "sandboxfa471575eef44c95af262214d86bee93.mailgun.org";
// const mg = mailgun({ apiKey: process.env.MAILGUN_APIKEY, domain: DOMAIN });

module.exports = {
  register: async (req, res) => {
    const { name, email, password } = req.body;
    if (!email || !password || !name)
      return res
        .status(400)
        .json({ success: false, message: "Missing email or password" });
    try {
      //check for existing email
      const user = await User.findOne({ email });
      if (user)
        return res
          .status(400)
          .json({ success: false, message: "Email already taken" });
      //All good
      const newUser = new User({ name, email, password });
      await newUser.save();

      //return token
      const accessToken = jwt.sign({ userId: newUser._id }, "bao");
      res.status(200).json({
        success: true,
        message: "User created successfully",
        accessToken,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: error.message });
    }
  },

  login: async (req, res) => {
    const { email, password } = req.body;

    //simple validation
    if (!email || !password)
      return res
        .status(400)
        .json({ success: false, message: "Missing email or password" });

    try {
      //check email
      const user = await User.findOne({ email });
      if (!user)
        return res
          .status(400)
          .json({ success: false, message: "Incorrect email or password" });

      //check password
      const passwordVaild = await argon2.verify(user.password, password);
      if (!passwordVaild)
        return res
          .status(400)
          .json({ success: false, message: "Incorrect email or password" });

      //all good
      const accessToken = jwt.sign({ userId: user._id }, "bao");
      res.status(200).json({
        success: true,
        message: "User logger in successfully",
        accessToken,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: error.message });
    }
  },

  sendResetLink: async (req, res, next) => {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email });

      if (!email) {
        return res.status(400).send({ error: "Email is required" });
      }

      if (!user) {
        return res.status(400).send({ error: "User not found" });
      }

      const accessToken = jwt.sign({ userId: user._id }, "bao");
      const link = `${req.protocol}://localhost:5000/api/auth/reset-password/${accessToken}`;

      await sendEmail(
        email,
        "giabao5678999@gmail.com",
        "Best To Do password reset",
        `
        <div>Click the link below to reset your password</div><br/>
        <div>${link}</div>
        `
      );
      return res.status(200).send({
        message: "Password reset link has been success send to your inbox",
      });
    } catch (err) {
      return next(new Error(err));
    }
  },

  resetPassword: async (req, res, next) => {
    try {
      // const accessToken = jwt.sign({ userId: user._id }, "bao");

      const { password } = req.body;
      const { accessToken } = req.params;
      const decoded = jwt.verify(accessToken, "bao");
      const hashedPassword = await argon2.hash(password);

      const userUpdated = await User.findByIdAndUpdate(decoded.userId, {
        password: hashedPassword,
      });

      return res
        .status(200)
        .send({ accessToken, message: "Update password success" });
    } catch (err) {
      return next(new Error(err));
    }
  },
};
