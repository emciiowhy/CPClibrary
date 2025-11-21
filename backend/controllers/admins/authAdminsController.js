import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { findAdminsByEmail, findStudentsByEmail } from "../../models/authModel.js";
import { getAllAdmins } from "../../models/adminsModel.js";
import dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";
import { generateOTP } from "../../utils/otpGenerator.js";
import { pool } from "../../db.js";

export const fetchAdmins = async (req, res) => {
  try {
    const admins = await getAllAdmins();

    res.json(admins);
  } catch (error) {
    res.status(500).json({ error: "FetchAdmins Error" });
  }
};

export const loginAdminController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await findAdminsByEmail(email);
    if (!admin) return res.status(401).json({ message: "Invalid email" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid password" });
    const token = jwt.sign(
      { id: admin.id, email: admin.email },
      process.env.MY_SECRET_KEY,
      { expiresIn: "1hr" }
    );
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "development", // Only send over HTTPS in production
      sameSite: "Strict",
      maxAge: 60 * 60 * 1000, // 1 hour in milliseconds
    });
    res.json({
      message: "Login Successfully",
      token,
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Login error", error: error.message });
  }
};

export const registerAdminRequestController = async (req, res) => {
  const { email } = req.body;

  try {
    const existingAdmin = await findAdminsByEmail(email);

    if (existingAdmin) {
      return res.status(409).json({
        message: "Email already exists. Please use another email.",
      });
    }

    const otp = generateOTP();

    await pool.query(
      `
      INSERT INTO admin_otps (email, otp, expires_at)
      VALUES ($1, $2, NOW() + INTERVAL '5 minutes')
      ON CONFLICT (email)
      DO UPDATE SET otp = $2, expires_at = NOW() + INTERVAL '5 minutes'
      `,
      [email, otp]
    );

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Registration OTP",
      text: `Your OTP for registration is: ${otp}`,
    };

    await transporter.sendMail(mailOptions);

    return res.json({
      message: "OTP sent to you email",
      otp,
    });
    
  } catch (error) {
    return res.status(500).json({
      message: "Failed to request register",
      error: error.message,
    });
  }
};

export const verifyAdminOtpController = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const result = await pool.query(
      `
      SELECT * FROM admin_otps WHERE email = $1 AND otp = $2
    `,
      [email, otp]
    );

    const otpRecord = result.rows[0];

    if (!otpRecord) {
      return res.status(404).json({
        message: "No OTP request found",
      });
    }

    if (otpRecord.expires_at < new Date()) {
      return res.status(400).json({
        message: "OTP expires. Please request a new one",
      });
    }

    return res.json({
      message: "OTP verified",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to verify OTP",
      error: error.message,
    });
  }
};

export const finalRegisterAdminController = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingAdmin = await findAdminsByEmail(email);
    if (existingAdmin) {
      return res.status(409).json({
        message: "Email already registered as admin.",
      });
    }

    const otpRecord = await pool.query(
      `
      SELECT * FROM admin_otps WHERE email = $1
    `,
      [email]
    );

    if (otpRecord.rows.length === 0) {
      return res.status(400).json({
        message:
          "Email is not verified. Please complete OTP verification first",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = await pool.query(
      `
        INSERT INTO admins (name, email, password)
        VALUES ($1, $2, $3)
        RETURNING *;
      `,
      [name, email, hashedPassword]
    );

    await pool.query(`DELETE FROM admin_otps WHERE email = $1`, [email]);

    res.status(201).json({
      message: "Admin registered successfully",
      admin: newAdmin.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to register admin",
      error: error.message,
    });
  }
};

export const forgotPasswordAdminController = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await findAdminsByEmail(email);
    if (!user) return res.status(404).json({message: "Email not found"});

    const OTP = Math.floor(100000 + Math.random() * 900000).toString();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset OTP',
      text: `Your OTP for password reset is: ${OTP}`,
    }

    await transporter.sendMail(mailOptions);

    res.json({message: "OTP sent to your email", otp: OTP})
  } catch (error) {
    return res.status(500).json({message: "Error in forgot password", error: error.message});
  }
}
