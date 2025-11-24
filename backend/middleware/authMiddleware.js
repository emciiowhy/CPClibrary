import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { pool } from "../db.js";
dotenv.config();

export const jwtAuthenticate = (req, res, next) => {
  const jwtPayload = req.cookies.token; // imong gi kuha ang token gikan sa headers
  console.log("JWT Payload:", jwtPayload);
  if (!jwtPayload) {
    return res.json({ message: "Unauthorized Access" });
  }

  // const token = jwtPayload.split(" ")[1];

  jwt.verify(jwtPayload, process.env.MY_SECRET_KEY, (err, decoded) => {

    if (err) {
      return res.json({ message: "Invalid Token" });
    }

    req.user = decoded; // decode contain the decoded value in token 
    next();

  });
}

export const verifyAdminToken = async (req, res, next) => {
  try {
    const requestToken = req.cookies.token;

    if (!requestToken) {
      return res.json({
        message: "Token not provided",
        success: false
      });
    }

    console.log('token ', requestToken);
    
    const decoded = jwt.verify(requestToken, process.env.MY_SECRET_KEY);
    const getAdmin = await pool.query(`
        SELECT * FROM admins 
        WHERE id = $1
        `, [decoded.id]);

    if (getAdmin.rows.length === 0) {
      return res.json({
        message: "Admin not found",
        success: false
      });
    };

    if (getAdmin.rows[0].role != "admin") {
      return res.json({
        message: "Unauthorized",
        authorized: false,
        success: false
      })
    }

    req.user = getAdmin.rows[0];
    res.json({
      authorized: true,
      success: true
    })

    next();
  } catch (error) {
    console.log("auth middleware error", error.message);
    res.status(500).json({
      message: "Error verifying admin token",
      success: false
    })
  }
}


export const verifyStudentToken = async (req, res, next) => {
  try {

    const requestToken = req.cookies.token;

    if (!requestToken) {
      return res.json({
        message: "Token not provided",
        success: false
      })
    }

    console.log('Token ', requestToken);

    const decoded = jwt.verify(requestToken, process.env.MY_SECRET_KEY);
    const getStudent = await pool.query(
      `
        SELECT * FROM students
        WHERE email = $1
      `, [decoded.id]
    );

    if (getStudent.rows.length === 0) {
      return res.json({
        message: "Student not found",
        success: false
      })
    }

    if (getStudent.rows[0].role !== "student") {
      return res.json({
        message: "Unauthorized",
        authorized: false,
        success: false
      })
    }

    req.user = getStudent.rows[0];
    res.status({
      authorized: true,
      success: true
    })

    next();

  } catch (error) {
    return res.status(500).json({
      message: "Error verifying student token",
      success: false
    })
  }
}