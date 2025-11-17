import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { findStudentsBySchoolId, findStudentsByEmail } from "../../models/authModel.js";
import dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";

export const loginStudentController = async (req, res) => {
  try {
    const {schoolId, password} = req.body;

    const user = await findStudentsBySchoolId(schoolId);
    if (!user) return res.status(401).json({message: "Invalid schoolId"});

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({message: "Invalid password"});

    const token = jwt.sign(
      {id: user.id, email: user.email, schoolId: user.student_id},
      process.env.MY_SECRET_KEY,
      {expiresIn: "1hr"}
    );

     res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'development', // Only send over HTTPS in production
        sameSite: 'Strict',
        maxAge: 60 * 60 * 1000 // 1 hour in milliseconds
    })

    // res.setHeader('Authorization', `Bearer ${token}`);  
    
    res.json({
      message: "Login Successfully",
      token,
      user: {
        id: user.id,
        name: user.name,
        schoolId: user.student_id,
        email: user.email,
      }
    });

  } catch (error) {
    res.status(500).json({message: "Login error", error: error.message});
  }
}

export const forgotPasswordController = async (req, res) => {
  try {
     const {email} = req.body;

    const user = await findStudentsByEmail(email);
    if (!user) return res.status(404).json({message: "Email not found"});

    const OTP = Math.floor(100000 + Math.random() * 900000).toString();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
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
    };

    await transporter.sendMail(mailOptions);

    res.json({message: "OTP sent to email", otp: OTP});

  } catch (error) {
    res.status(500).json({message: "Error in forgot password", error: error.message});
  }
}