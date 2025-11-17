import { getAllAdmins } from "../../models/adminsModel.js";

export const fetchAdmins = async (req, res) => {
  try {
    const admins = await getAllAdmins();

    res.json(admins);
  } catch (error) {
    res.status(500).json({error: "FetchAdmins Error"});
  }
};