import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const jwtAuthenticate = (req, res, next) => {
  const jwtPayload = req.cookies.token; // imong gi kuha ang token gikan sa headers
  console.log("JWT Payload:", jwtPayload);
  if (!jwtPayload) {
    return res.json({ message: "Unauthorized Access" });
  }

  // const token = jwtPayload.split(" ")[1]; // pag split sa "Bearer

  // token = jdalkwhdawdwadiowadjwadwad

  jwt.verify(jwtPayload, process.env.MY_SECRET_KEY, (err, decoded) => {

    if (err) {
      return res.json({ message: "Invalid Token" });
    }

    req.user = decoded; // decode contain the decoded value in token 
    next();

  });

}