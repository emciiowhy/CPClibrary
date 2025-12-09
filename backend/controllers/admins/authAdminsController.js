import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  findAdminsByEmail,
  findStudentsByEmail,
  findAdminsById,
  findStudentsBySchoolId,
  findStudentByBorrowId,
} from "../../models/authModel.js";
import { getAllAdmins } from "../../models/adminsModel.js";
import nodemailer from "nodemailer";
import { generateOTP } from "../../utils/otpGenerator.js";
import { pool } from "../../db.js";
import { generateAccessToken, generateRefreshToken } from "../../utils/jwt.js";
import { findBookById } from "../../models/authModel.js";
import mailOptions from "../../utils/transporter.js";

export const fetchAdmins = async (req, res) => {
  try {
    const admins = await getAllAdmins();
    const adminLength = admins.length;
    res.json({admins, adminLength});
  } catch (error) {
    res.status(500).json({ error: "FetchAdmins Error" });
  }
};

const isProduction = process.env.NODE_ENV === "production";

export const loginAdminController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await findAdminsByEmail(email);
    if (!admin)
      return res.status(401).json({
        message: "Invalid email",
        success: false,
      });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch)
      return res.status(401).json({
        message: "Invalid password",
        success: false,
      });

    const accessToken = generateAccessToken({
      id: admin.id,
      email: admin.email,
      role: admin.role,
    });

    const refreshToken = generateRefreshToken({
      id: admin.id,
      email: admin.email,
      role: admin.role,
    });

    const accessCookieOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "None" : "Lax",
      maxAge: 5 * 60 * 1000,
      path: "/",
    };

    const refreshCookieOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "None" : "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    };

    res.cookie("access_token", accessToken, accessCookieOptions);
    res.cookie("refresh_token", refreshToken, refreshCookieOptions);

    res.json({
      message: "Login Successfully",
      success: true,
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Login error",
      error: error.message,
      success: false,
    });
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

    mailOptions({
      from: isProduction ? "" : "CPC Library <onboarding@resend.dev>",
      to: email,
      subject: "Your Registration OTP",
      text: `Your OTP is: ${otp}`, 
      content: `
        <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Registration OTP</title>
  </head>
  <body style="margin:0; padding:0; font-family: Arial, sans-serif; background-color:#f4f4f4;">
    <div style="max-width:600px; margin:auto; background-color:#ffffff; padding:30px; border-radius:10px; box-shadow:0 2px 10px rgba(0,0,0,0.1); text-align:center;">
      
      <!-- School Logo -->
      <img src="https://res.cloudinary.com/dedef9fpx/image/upload/v1764907656/cpc-logo_hq8466.png" 
           alt="Cordova Public College" 
           style="width:120px; height:auto; margin-bottom:20px;" />
      
      <h2 style="color:#4f46e5; text-align:center;">Registration OTP</h2>
      
      <p style="font-size:16px; color:#333333; text-align:left;">Hello,</p>
      
      <p style="font-size:16px; color:#333333; text-align:left;">
        Thank you for registering with Cordova Public College! Please use the OTP below to complete your registration:
      </p>
      
      <div style="text-align:center; margin:20px 0;">
        <span style="font-size:32px; font-weight:bold; color:#4f46e5; letter-spacing:4px;">
          ${otp}
        </span>
      </div>
      
      <p style="font-size:14px; color:#555555; text-align:left;">
        This OTP is valid for 5 minutes. Please do not share it with anyone.
      </p>
      
      <p style="font-size:14px; color:#555555; text-align:left;">
        If you did not request this, you can safely ignore this email.
      </p>
      
      <hr style="border:none; border-top:1px solid #eeeeee; margin:20px 0;" />
      
      <p style="font-size:12px; color:#999999; text-align:center;">
        &copy; ${new Date().getFullYear()} Cordova Public College. All rights reserved.
      </p>
    </div>
  </body>
</html>

      `
    });

    return res.json({
      message: "OTP sent to your email",
      success: true,
      otp,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to request register",
      success: false,
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
      success: true,
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
    if (!user) return res.status(404).json({ message: "Email not found" });

    const OTP = Math.floor(100000 + Math.random() * 900000).toString();

    await pool.query(
      `
      INSERT INTO admin_otps (email, otp, expires_at)
      VALUES ($1, $2, NOW() + INTERVAL '5 minutes')
      ON CONFLICT (email)
      DO UPDATE SET otp = $2, expires_at = NOW() + INTERVAL '5 minutes'
      `,
      [email, OTP]
    );

   try {
    await mailOptions({
      from: isProduction ? "" : "CPC Library <onboarding@resend.dev>",
      to: email,
      subject: "Cordova Public College - Admin Password Reset OTP",
      text: `
        Hello,

        We received a request to reset your password. Your OTP is: ${otp}

        This OTP is valid for 5 minutes. Please do not share it with anyone.

        If you did not request a password reset, you can ignore this email.

        - Cordova Public College
      `,
      content: `
        <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Forgot Password OTP</title>
  </head>
  <body style="margin:0; padding:0; font-family: Arial, sans-serif; background-color:#f4f4f4;">
    <div style="max-width:600px; margin:auto; background-color:#ffffff; padding:30px; border-radius:10px; box-shadow:0 2px 10px rgba(0,0,0,0.1); text-align:center;">
      
      <!-- School Logo -->
      <img src="https://res.cloudinary.com/dedef9fpx/image/upload/v1764907656/cpc-logo_hq8466.png" 
           alt="Cordova Public College" 
           style="width:120px; height:auto; margin-bottom:20px;" />
      
      <h2 style="color:#4f46e5; text-align:center;">Forgot Password OTP</h2>
      
      <p style="font-size:16px; color:#333333; text-align:left;">Hello,</p>
      
      <p style="font-size:16px; color:#333333; text-align:left;">
        We received a request to reset your password. Please use the OTP below to reset your password:
      </p>
      
      <div style="text-align:center; margin:20px 0;">
        <span style="font-size:32px; font-weight:bold; color:#4f46e5; letter-spacing:4px;">
          ${OTP}
        </span>
      </div>
      
      <p style="font-size:14px; color:#555555; text-align:left;">
        This OTP is valid for 5 minutes. Please do not share it with anyone.
      </p>
      
      <p style="font-size:14px; color:#555555; text-align:left;">
        If you did not request a password reset, you can safely ignore this email.
      </p>
      
      <hr style="border:none; border-top:1px solid #eeeeee; margin:20px 0;" />
      
      <p style="font-size:12px; color:#999999; text-align:center;">
        &copy; ${new Date().getFullYear()} Cordova Public College. All rights reserved.
      </p>
    </div>
  </body>
</html>

      `
    });
   } catch (error) {
    console.error("Error sending email:", err.message);
    return res.status(500).json({
      message: "Failed to send OTP email. Please try again later.",
      success: false
    });
   }

    res.json({
      message: "OTP sent to your email",
      otp: OTP,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error in forgot password",
      error: error.message,
      success: false,
    });
  }
};

export const resetPasswordAdminController = async (req, res) => {
  try {
    const { email, otp, password } = req.body;

    const user = await findAdminsByEmail(email);
    if (!user) return res.status(404).json({ message: "Email not found" });

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

    if (otpRecord.rows[0].otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      `
      UPDATE admins
      SET password = $1
      WHERE email = $2
      `,
      [hashedPassword, email]
    );

    await pool.query(
      `
        DELETE FROM admin_otps
        WHERE email = $1
      `,
      [email]
    );

    return res.json({
      message: "Password reset successful",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error in reset password",
      error: error.message,
      success: false,
    });
  }
};

export const logoutAdmin = async (req, res) => {
  try {
    res.cookie("access_token", "", {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "None" : "Lax",
      maxAge: 0,
      path: "/",
    });

    res.cookie("refresh_token", "", {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "None" : "Lax",
      maxAge: 0,
      path: "/",
    });

    res.status(200).json({
      message: "Logged out successfully!",
      success: true,
      role: "admin",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Logout failed",
      error: error.message,
      success: false,
    });
  }
};

export const getAdminRole = async (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({
      message: "User not found",
      success: false,
    });
  }

  try {
    const admin = await findAdminsById(user.id);
    if (!admin) {
      return res.status(401).json({
        message: "Admin based on Id not found",
        success: false,
      });
    }

    res.status(200).json({
      message: "Admin has been found",
      success: true,
      admin,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to get admin role",
      success: false,
    });
  }
};

export const changeStatus = async (req, res) => {
  try {
    const { status, email } = req.body;
    const student = findStudentsByEmail(email);

    await pool.query(
      `
          UPDATE students
          SET status = $1
          WHERE email = $2;
        `,
      [status, email]
    );

    res.json({
      message: `Successfully changed ${student.name}'s status to ${status}`,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error in changing status",
      success: false,
    });
  }
};

export const deleteStudent = async (req, res) => {
  try {
    const { email, reason } = req.body;
    const student = await findStudentsByEmail(email);

    await pool.query("BEGIN");

    await pool.query(
      `
      INSERT INTO deleted_students 
        (name, email, student_id, course, section, status, password, role, profile_url, profile_public_id, penalty) 
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
    `,
      [
        student.name,
        student.email,
        student.student_id,
        student.course,
        student.section,
        student.status,
        student.password,
        student.role,
        student.profile_url,
        student.profile_public_id,
        reason,
        student.penalty
      ]
    );

    await pool.query(
      `
        DELETE FROM students WHERE email = $1;
      `,
      [email]
    );

    await pool.query("COMMIT");

    await mailOptions({
      from: isProduction ? "" : "CPC Library <onboarding@resend.dev>",
      to: student.email,
      subject: "Account Deleted - Cordova Public College",
      text: `Hello,

    We want to inform you that your account has been deleted from our system.

    If you wish to recover your account, you can do so by either:
    1. Contacting the library directly.
    2. Sending a recovery request via email to library@cordova.edu.ph

    Please ensure you take the appropriate steps if you want to regain access to your account.

    - Cordova Public College`,

      content: `
        <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Account Deleted Notification</title>
</head>
<body style="margin:0; padding:0; font-family: Arial, sans-serif; background-color:#f4f4f4;">
  <div style="max-width:600px; margin:auto; background-color:#ffffff; padding:30px; border-radius:10px; box-shadow:0 2px 10px rgba(0,0,0,0.1); text-align:center;">
    
    <!-- School Logo -->
    <img src="https://res.cloudinary.com/dedef9fpx/image/upload/v1764907656/cpc-logo_hq8466.png" 
         alt="Cordova Public College" 
         style="width:120px; height:auto; margin-bottom:20px;" />
    
    <h2 style="color:#E53E3E; text-align:center;">Account Deleted</h2>
    
    <p style="font-size:16px; color:#333333; text-align:left;">Hello,</p>
    
    <p style="font-size:16px; color:#333333; text-align:left;">
      We want to inform you that your account has been <span style="font-weight: bold; color:red">deleted</span> from our system.
    </p>
    
    <!-- Reason for deletion -->
    <p style="font-size:16px; color:#333333; text-align:left;">
      <strong>Reason:</strong> ${reason}
    </p>
    
    <p style="font-size:16px; color:#333333; text-align:left;">
      If you wish to recover your account, you can do so by either:
    </p>
    
    <ul style="font-size:16px; color:#333333; text-align:left; margin-left:20px;">
      <li>Contacting the library directly.</li>
      <li>Submitting a recovery request through our email: 
        <a href="mailto:jersonjaybonghanoy@gmail.com" style="color:#E53E3E; text-decoration:none;">library@cordova.edu.ph</a>
      </li>
    </ul>
    
    <p style="font-size:16px; color:#333333; text-align:left;">
      Please ensure you take the appropriate steps if you want to regain access to your account.
    </p>
    
    <hr style="border:none; border-top:1px solid #eeeeee; margin:20px 0;">
    
    <p style="font-size:12px; color:#999999; text-align:center;">
      &copy; ${new Date().getFullYear()} Cordova Public College. All rights reserved.
    </p>
    
  </div>
</body>
</html>

      `
    });

    res.json({
      message: `Student ${student.name} has been deleted successfully.`,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error deleting student",
      error: error.message,
    });
  } finally {
    client.release();
  }
};

export const restoreStudent = async (req, res) => {
  const client = await pool.connect();
  try {
    const { email, reason } = req.body;

    if (!email) return res.status(400).json({ message: "Email is required" });

    const { rows } = await client.query(
      "SELECT * FROM deleted_students WHERE email = $1",
      [email]
    );

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ message: "Student not found in deleted records" });
    }

    const student = rows[0];

    await client.query("BEGIN");

    await client.query(
      `
      INSERT INTO students 
        (name, email, student_id, course, section, status, password, role, profile_url, profile_public_id, restore_reason, penalty)
      VALUES ($1,$2,$3,$4,$5,'active',$6,$7,$8,$9,$10, 0)
      ON CONFLICT (email) DO UPDATE
        SET status = 'active',
            restore_reason = EXCLUDED.restore_reason
      RETURNING *
    `,
      [
        student.name,
        student.email,
        student.student_id,
        student.course || "not set",
        student.section || "not set",
        student.password,
        student.role || "student",
        student.profile_url,
        student.profile_public_id,
        reason || "restored",
      ]
    );

    await client.query("DELETE FROM deleted_students WHERE email = $1", [
      email,
    ]);

    await client.query("COMMIT");

    await mailOptions({
      from: isProduction ? "" : "CPC Library <onboarding@resend.dev>",
      to: student.email,
      subject: "Your Registration OTP - Cordova Public College",
      text: `Hello,

        Your account at Cordova Public College has been marked for recovery.

        If you requested to recover your account, please follow the steps below:
        1. Contact the library directly.
        2. Or submit a recovery request through our email: library@cordova.edu.ph

        Please ensure you follow the appropriate steps to regain access to your account.

        Cordova Public College © ${new Date().getFullYear()}`,
        
      content: `
        <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Account Recovery Approved</title>
</head>
<body style="margin:0; padding:0; font-family: Arial, sans-serif; background-color:#e6fffa;">
  <div style="max-width:600px; margin:auto; background-color:#ffffff; padding:30px; border-radius:10px; box-shadow:0 4px 15px rgba(0,0,0,0.1); text-align:center; border-top:8px solid #2f855a;">
    
    <!-- School Logo -->
    <img src="https://res.cloudinary.com/dedef9fpx/image/upload/v1764907656/cpc-logo_hq8466.png" 
         alt="Cordova Public College" 
         style="width:120px; height:auto; margin-bottom:20px;" />
    
    <h2 style="color:#2f855a; text-align:center; font-size:24px; margin-bottom:15px;">Account Recovery Approved</h2>
    
    <p style="font-size:16px; color:#333333; text-align:left;">Hello,</p>
    
    <p style="font-size:16px; color:#333333; text-align:left;">
      Great news! Your request for account recovery has been <strong style="color:#2f855a;">approved</strong>.
    </p>
    
    <p style="font-size:16px; color:#333333; text-align:left;">
      You can now <strong style="color:#2f855a;">access your account</strong> and continue using it without any issues.
    </p>
    
    <p style="font-size:16px; color:#333333; text-align:left;">
      Thank you for your patience, and enjoy using your account!
    </p>
    
    <hr style="border:none; border-top:1px solid #c6f6d5; margin:25px 0;">
    
    <p style="font-size:12px; color:#555555; text-align:center;">
      &copy; ${new Date().getFullYear()} Cordova Public College. All rights reserved.
    </p>
    
  </div>
</body>
</html>

      `
    })

    res.status(200).json({
      message: `Student ${student.name} has been restored successfully.`,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Restore student error:", error);
    res.status(500).json({
      message: "Restoring student failed",
      error: error.message,
    });
  } finally {
    client.release();
  }
};

export const getDeletedStudents = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM deleted_students
    `);

    res.json({
      students: result.rows,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error,
    });
  }
};

export const setStudentBorrowedStatus = async (req, res) => {
  try {
    const { borrowedStatus, borrowId } = req.body;

    const query = `
      UPDATE borrow_records
      SET status = $1
      WHERE id = $2
    `;

    await pool.query(query, [borrowedStatus, borrowId]);

    //if returned na button
    if (borrowedStatus === "returned") {
      const user = await findStudentByBorrowId(borrowId);
      if (!user) {
        console.log("no user found"); 
        return res.status(400).json({message: "Student using borrow Id not found"});
      }
      const userId = user.student_id; //student primary id not school Id

      await pool.query(`
        UPDATE students
        SET penalty = $1
        WHERE id = $2;
      `, [0 ,userId]);
    }

    res.json({
      message: borrowedStatus === "returned" ? 
        `Successfully updated status to ${borrowedStatus} and cleared the penalty.`
          :
        `Successfully updated status to ${borrowedStatus}`,

      success: true,
    });
  } catch (error) {
    console.log("Error here in backend", error);
    return res.status(500).json({
      message: "Error setting student borrowed status",
      error: error,
    });
  }
};

export const extendDueDate = async (req, res) => {
  try {
    const { borrowId, extendDueDateValue } = req.body;

    await pool.query(
      `
      UPDATE borrow_records
      SET due_date = $1
      WHERE id = $2;
    `,
      [extendDueDateValue, borrowId]
    );

    res.json({
      message: "Extend due date successfully",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

export const addPenalty = async (req, res) => {
  try {
    const { penalty, studentId } = req.body;

    await pool.query(`
      UPDATE students
      SET penalty = $1
      WHERE student_id = $2
    `, [penalty, studentId]);

    res.json({
      message: "Success updating the value",
      success: true
    })

  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      message: "Adding penalty failed",
      success: false,
    })
  }
}