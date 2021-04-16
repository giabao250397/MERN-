const express = require("express");
const router = express.Router();

const authController = require("../controllers/AuthController");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/forgot-password", authController.sendResetLink);
router.post("/reset-password/:accessToken", authController.resetPassword);

module.exports = router;
