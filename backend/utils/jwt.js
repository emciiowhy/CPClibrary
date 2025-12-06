import jwt from "jsonwebtoken";

const getSecret = (primary, fallbackEnvVar) => {
  const secret = process.env[primary] || process.env[fallbackEnvVar];
  if (!secret) {
    throw new Error(`Missing JWT secret: set ${primary} or ${fallbackEnvVar}`);
  }
  return secret;
};

export const generateAccessToken = (payload) => {
  const secret = getSecret("ACCESS_TOKEN", "MY_SECRET_KEY");
  return jwt.sign(payload, secret, { expiresIn: "5m" });
};

export const generateRefreshToken = (payload) => {
  const secret = getSecret("REFRESH_TOKEN", "MY_REFRESH_TOKEN");
  return jwt.sign(payload, secret, { expiresIn: "7d" });
};
