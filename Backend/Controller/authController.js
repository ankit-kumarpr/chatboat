const User = require("../Models/UserModel");
const nodemailer = require("nodemailer");

const { sendOTP } = require("../utils/sendOTP");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/generateTokens");
const jwt = require("jsonwebtoken");

// regisetr super admin

const RegisterSuperAdmin = async (req, res) => {
  const { name, email, phone, Address, gender } = req.body;

  try {
    if (!name || !email || !phone) {
      return res.status(400).json({
        error: true,
        message: "Something went wrong || Missing required filed",
      });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(403).json({
        error: true,
        message: "User already register",
      });
    }

    const newUser = new User({
      name,
      email,
      phone,
      gender,
      Address,
      role: "SuperAdmin",
    });

    newUser.customerRef_no = newUser._id;

    await newUser.save();

    return res.status(200).json({
      error: false,
      message: "Super Admin register successfully",
      data: newUser,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};



// send otp api

const SendUserOTP = async (req, res) => {
  const { email } = req.body;
  try {
    
    if (!email) {
      return res.status(400).json({
        error: true,
        message: "Something went wrong || please enter email first",
      });
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const user = await User.findOne({ email });
    console.log("user", user);
    if (!user) {
      return res.status(404).json({
        error: true,
        message: "User not found || user not register",
      });
    }

    user.otp = otp;
    user.otpExpires = Date.now() + 5 * 60 * 1000;
    user.customerRef_no = user._id;
    console.log("user otp", otp);
    console.log("otp expire", email);
    console.log("customer refrence number", user.customerRef_no);
    await user.save();
    const senddata = await sendOTP(email, otp);
    
    return res.status(200).json({
      error: false,
      message: "Otp Sent Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};

// verify otp

const VerifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  try {
    if (!email || !otp) {
      return res.status(400).json({
        error: true,
        message: "Something went wrong || enter otp and Email",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        error: true,
        message: "User Not found",
      });
    }

    if (!user || user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({
        error: true,
        message: "Invalid or ecpired OTP",
      });
    }

    if (user.isBanned.status && user.isBanned.bannedUntil > Date.now()) {
      return res.status(403).json({
        error: true,
        message: "You are banned",
      });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    user.otp = null;
    await user.save();

    return res.status(200).json({
      error: false,
      message: "User logined in Successfully",
      data: {
        accessToken,
        refreshToken,
        user,
      },
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};

// refresh token

const refreshToken = async (req, res) => {
  const { token } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.REFRESH_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== token) {
      return res.status(403).json({
        error: true,
        message: "Invalid token",
      });
    }

    const accessToken = generateAccessToken(user);

    return res.status(200).json({
      error: false,
      message: "Access token genrate successfully",
      data: accessToken,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};


// forget password

const forgotPassword =async(req,res)=>{
  try {
    const { email } = req.body;

    const employee = await User.findOne({ email });
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }console.log("emp",employee);

    console.log("email",email);
    const token = jwt.sign({ id: employee._id }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });
console.log("token",token);
    const resetLink = `http://localhost:5173/newpassword/${token}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    console.log("transporter",transporter);
    const mailOptions = {
      from: process.env.MAIL_USER,
      to: email,
      subject: "Reset Your Password",
      html: `<p>Hello ${employee.name},</p>
             <p>Click here to reset your password:</p>
             <a href="${resetLink}">${resetLink}</a>
             <p>Link will expire in 15 minutes.</p>`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Reset link sent successfully!" });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }


}


// reset password

const resetPassword=async(req,res)=>{
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const employee = await User.findById(decoded.id);

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    employee.password = newPassword;
    await employee.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    res.status(400).json({ message: "Invalid or expired token" });
  }
}



module.exports = {
  RegisterSuperAdmin,
  SendUserOTP,
  VerifyOTP,
  refreshToken,

  resetPassword,
  forgotPassword
};
