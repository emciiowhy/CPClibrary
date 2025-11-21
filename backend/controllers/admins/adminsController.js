import { getAllAdmins, registerAdmins } from "../../models/adminsModel.js";

export const fetchAdmins = async (req, res) => {
  try {
    const admins = await getAllAdmins();

    res.json(admins);
  } catch (error) {
    res.status(500).json({ error: "FetchAdmins Error" });
  }
};

export const registerAdminsController = async (req, res) => {
  try {
    const newAdmin = await registerAdmins(req);
    
    res.status(201).json({
      message: "Admin registered succesfully",
      admin: newAdmin,
    });
  } catch (error) {
    if (error.code === "23505" && error.constraint === "admins_email_key") {
      if (error.constraint === "admins_email_key") {
        return res.status(409).json({
          message: "Registration failed",
          error: "Email already exists. Please use a different email address.",
        });
      }

      return res.status(409).json({
        message: "Registraton failed",
        error: "Duplicate entry. This record already exists.",
      });
    }

    res.status(500).json({
      message: "Failed to register student",
      error: error.message,
    });
  }
};
