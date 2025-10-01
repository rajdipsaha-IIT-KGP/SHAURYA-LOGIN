const { Router } = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { usermodel } = require("../db");
const otpModel = require("../Models/otpModels");
const forgetotpModel = require("../Models/forgetotpModel");
const userRouter = Router();
const JWT_SECRET = "!@#$%^&*()_+1234567890-=";

// ------------------ Helper: Send OTP Email ------------------
async function sendOtpEmail(toEmail, otp) {
  try {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "rajdipsaha7697@gmail.com",
        pass: "xsyi zewt ptwa tnnh", 
      },
    });

    await transporter.sendMail({
      from: "rajdipsaha7697@gmail.com",
      to: toEmail,
      subject: "SHAURYA 2025 - Your OTP Code",
      text: `Hello,

Your One-Time Password (OTP) is: ${otp}

This OTP is valid for 10 minutes. Please do not share it with anyone.

Best regards,
The SHAURYA 2025 Team`,
    });

    console.log("✅ OTP sent successfully to", toEmail);
  } catch (err) {
    console.error("❌ Error sending OTP:", err);
  }
}

// ------------------ SIGNUP FLOW ------------------
userRouter.post("/signup/send-otp", async (req, res) => {
  const { clgEmail, username, password, ownEmail, clgName, gender } = req.body;

  if (!username || !password || !ownEmail || !clgName || !gender) {
    return res.status(400).send({ message: "All fields are required" });
  }

  try {
    let existingUser = await usermodel.findOne({ ownEmail });
    if (existingUser)
      return res.status(400).json({ message: "User Already Exists" });

    await otpModel.deleteMany({ ownEmail });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await otpModel.create({
      ownEmail,
      otp,
      expiresAt,
      tempUserData: {
        ownEmail,
        clgEmail,
        clgName,
        password,
        username: username,
        gender,
      },
    });

    await sendOtpEmail(ownEmail, otp);
    return res.status(200).json({ message: "OTP sent successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

userRouter.post("/signup/verify-otp", async (req, res) => {
  const { ownEmail, otp } = req.body || {};

  if (!ownEmail || !otp) {
    return res.status(400).json({
      message: "Sign Up first",
    });
  }

  try {
    const record = await otpModel.findOne({ ownEmail, otp });
    if (!record) return res.status(400).json({ message: "Invalid OTP" });

    if (record.expiresAt < new Date())
      return res.status(400).json({ message: "OTP expired" });

    const existingUser = await usermodel.findOne({
      ownEmail: record.tempUserData.ownEmail,
    });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(record.tempUserData.password, 10);

    const newUser = await usermodel.create({
  ownEmail: record.tempUserData.ownEmail,
  username: record.tempUserData.username,
  password: hashedPassword,
  gender: record.tempUserData.gender,
  clgName: record.tempUserData.clgName,
  clgEmail: record.tempUserData.clgEmail, // if required in schema
});

    // remove OTP after verification
    await otpModel.deleteMany({ ownEmail });

    const token = jwt.sign({ id: newUser._id }, JWT_SECRET, {
      expiresIn: "2h",
    });

    return res.status(200).json({
      message: "User verified and created successfully",
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        ownEmail: newUser.ownEmail,
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server error" });
  }
});

// ------------------ SIGNIN ------------------
userRouter.post("/signin", async (req, res) => {
  try {
    const { ownEmail, password } = req.body || {};
    if (!ownEmail || !password)
      return res.status(400).json({ message: "All fields required" });

    const user = await usermodel.findOne({ ownEmail });
    if (!user)
      return res.status(404).json({ message: "Account does not exist" });

    const isValidPass = await bcrypt.compare(password, user.password);
    if (!isValidPass)
      return res.status(400).json({ message: "Password is incorrect" });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "2h" });

    return res.status(200).json({
      message: "User signed in successfully",
      token,
      user: { id: user._id, username: user.username, ownEmail: user.ownEmail },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// ------------------ FORGOT PASSWORD ------------------
userRouter.post("/signin/forgot-password/send-otp", async (req, res) => {
  const { ownEmail } = req.body;

  if (!ownEmail) {
    return res.status(400).json({
      message: "At first type your email",
    });
  }

  const user = await usermodel.findOne({ ownEmail });
  if (!user) return res.status(404).json({ message: "User not found" });

  await forgetotpModel.deleteMany({ ownEmail });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await forgetotpModel.create({
    ownEmail,
    otp,
    expiresAt,
  });

  await sendOtpEmail(ownEmail, otp);
  return res.status(200).json({ message: "OTP sent successfully" });
});

userRouter.post("/signin/forgot-password/verify-otp", async (req, res) => {
  const { ownEmail, otp } = req.body;

  const record = await forgetotpModel.findOne({ ownEmail, otp });

  if (!record)
    return res.status(400).json({
      message: "Invalid OTP",
    });

  if (record.expiresAt < new Date())
    return res.status(400).json({ message: "OTP expired" });

  return res.status(200).json({ message: "OTP verified successfully" });
});

// ------------------ RESET PASSWORD ------------------
userRouter.post("/signin/forgot-password/reset", async (req, res) => {
  const { ownEmail, otp, newPassword } = req.body;

  if (!ownEmail || !otp || !newPassword) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const record = await forgetotpModel.findOne({ ownEmail, otp });
  if (!record) return res.status(400).json({ message: "Invalid OTP" });
  if (record.expiresAt < new Date())
    return res.status(400).json({ message: "OTP expired" });

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await usermodel.updateOne({ ownEmail }, { $set: { password: hashedPassword } });

  await forgetotpModel.deleteMany({ ownEmail });

  return res.status(200).json({ message: "Password reset successfully" });
});

module.exports = userRouter;
