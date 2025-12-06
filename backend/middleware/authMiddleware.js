import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { pool } from "../db.js";
dotenv.config();
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.js";

const getSecret = (primary, fallback) => {
  const secret = process.env[primary] || process.env[fallback];
  if (!secret) {
    throw new Error(`Missing JWT secret: set ${primary} or ${fallback}`);
  }
  return secret;
};

const getAccessSecret = () => getSecret("ACCESS_TOKEN", "MY_SECRET_KEY");
const getRefreshSecret = () => getSecret("REFRESH_TOKEN", "MY_REFRESH_TOKEN");

export const jwtAuthenticate = (req, res, next) => {
  const access_token = req.cookies.access_token;
  const refresh_token = req.cookies.refresh_token;

  if (!access_token && !refresh_token) {
    return res.status(401).json({ 
      message: "Unauthorized Access",
    });
  }

  try {
    if (access_token) {
      const decoded = jwt.verify(access_token, getAccessSecret());
      req.user = decoded;
      next();
    } else {
      const decoded = jwt.verify(refresh_token, getRefreshSecret());
      req.user = decoded;
      next();
    }
  } catch (error) {
    return res.status(401).json({ 
      message: "Invalid Token",
      success: false,
    });
  }
};

export const verifyAdminToken = async (req, res) => {
  const access_token = req.cookies.access_token;
  const refresh_token = req.cookies.refresh_token;

  if (!access_token && !refresh_token) {
    return res.status(401).json({ 
      message: "Unauthorized Access",
    });
  }

  try {
    const decoded = jwt.verify(access_token, getAccessSecret());
    const adminResult = await pool.query(
      `
        SELECT id, name, email, role
        FROM admins 
        WHERE id = $1
      `,
      [decoded.id]
    );

    const admin = adminResult.rows[0];
    //if not admin
    if (admin.role !== "admin") {
      return res.status(403).json({
        message: "Unauthorized",
        authorized: false,
        success: false,
      });
    }

    //if can't find admin in the db
    if (!admin) {
      return res.status(404).json({
        message: "Admin not found",
        success: false,
      });
    }

    return res.json({
      message: "Authorized",
      authorized: true,
      success: true,
      admin,
    });
  } catch (error) {
    console.log("auth middleware error", error.message);
    const statusCode =
      error.name === "TokenExpiredError" || error.name === "JsonWebTokenError"
        ? 401
        : 500;
    return res.status(statusCode).json({
      message: statusCode === 401 ? "Invalid or expired token" : "Error verifying admin token",
      success: false,
    });
  }
};

export const verifyStudentToken = async (req, res) => {
  try {
    const access_token = req.cookies.access_token;
    const refresh_token = req.cookies.refresh_token;

    if (refresh_token) {
      return res.status(200).json({
        message: "Redirected to dashboard",
        success: true,
      });
    };

    if (!access_token) {
      return res.status(401).json({
        message: "Token not provided",
        success: false,
      });
    }

    const decoded = jwt.verify(access_token, getAccessSecret());
    const studentResult = await pool.query(
      `
        SELECT id, name, email, role
        FROM students
        WHERE id = $1
      `,
      [decoded.id]
    );

    const student = studentResult.rows[0];
    if (!student) {
      return res.status(404).json({
        message: "Student not found",
        success: false,
      });
    }

    if (student.role !== "student") {
      return res.status(403).json({
        message: "Unauthorized",
        authorized: false,
        success: false,
      });
    }

    return res.json({
      message: "Authorized",
      authorized: true,
      success: true,
      student,
    });
  } catch (error) {
    const statusCode =
      error.name === "TokenExpiredError" || error.name === "JsonWebTokenError"
        ? 401
        : 500;
    return res.status(statusCode).json({
      message:
        statusCode === 401 ? "Invalid or expired token" : "Error verifying student token",
      success: false,
    });
  }
};

export const refreshToken = async (req, res) => {
  const token = req.cookies.refresh_token;
  if (!token) {
    return res.status(401).json({
      message: "Refresh token missing",
      success: false,
    });
  }

  try {
    const decoded = jwt.verify(token, getRefreshSecret());

    let result;
    if (decoded.role === "admin") {
      result = await pool.query("SELECT * FROM admins WHERE id = $1", [decoded.id]);
    } else if (decoded.role === "student") {
      result = await pool.query("SELECT * FROM students WHERE id = $1", [decoded.id]);
    } else {
      return res.status(403).json({
        message: "Invalid role",
        success: false,
      });
    }

    if (!result.rows[0]) {
      return res.status(403).json({
        message: "Invalid refresh token",
        success: false,
      });
    }

    const newAccessToken = generateAccessToken({ 
      id: decoded.id, 
      role: decoded.role 
    });

    res.cookie("access_token", newAccessToken, {
      httpOnly: true,
      sameSite: "Lax",
      secure: false,
      maxAge: 5 * 60 * 1000,
    });

    res.json({
      message: "Access token refreshed",
      success: true,
    });

    console.log("Access token refreshed");

  } catch (error) {
    return res.status(500).json({
      message: "Refresh token invalid or expired",
      success: false,
    });
  }
};

export const redirectUser = async (req, res) => {
  try {
    const refresh_token = req.cookies.refresh_token;
    const decoded = jwt.verify(refresh_token, getRefreshSecret());

    return res.json({
      message: "Redirecting to " + decoded.role + " dashboard",
      success: true,
      decoded,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error redirecting user",
      success: false,
    })
  }
}