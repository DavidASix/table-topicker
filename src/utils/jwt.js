import jwt from "jsonwebtoken";
import { connectToDatabase, disconnectFromDatabase } from "@/utils/database";
const { JWT_SECRET } = process.env;

export const generateJWT = (data) => {
  return jwt.sign(data, JWT_SECRET, {
    expiresIn: "30d",
  });
};

export const decodeJWT = async (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (err) {
    console.log(`Error: ${err.message}`);
    return new Error(err);
  }
};

export const validateJWT = async (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const { conn, db } = await connectToDatabase("users");
    const jwtCol = db.collection("jwt-blacklist");
    const expiredJWT = await jwtCol.findOne({ token });
    await disconnectFromDatabase(conn)
    if (expiredJWT) {
      throw new Error("JWT is blacklisted");
    }
    return decoded;
  } catch (err) {
    console.log(`Error: ${err.message}`);
    return false;
  }
};

export const invalidateJWT = async (token) => {
  try {
    const { conn, db } = await connectToDatabase("users");
    const jwtCol = db.collection("jwt-blacklist");

    // Add the JWT to the blacklist
    await jwtCol.insertOne({ token });

    await disconnectFromDatabase(conn)
    return true; // JWT invalidated successfully
  } catch (error) {
    console.error('Error invalidating JWT:', error);
    return false; // Failed to invalidate JWT
  }
};