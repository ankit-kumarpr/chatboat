const express = require("express");

const router = express.Router();

// controlles

const {
  RegisterSuperAdmin,
  SendUserOTP,
  VerifyOTP,
  refreshToken,
    resetPassword,
  forgotPassword
} = require("../Controller/authController");

// auth routers

router.post("/superadminregister", RegisterSuperAdmin);
router.post("/send-otp", SendUserOTP);
router.post("/verify-otp", VerifyOTP);
router.post("/refresh", refreshToken);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

module.exports = router;
