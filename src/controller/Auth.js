import database from "../database.js";
import jwt from "jwt-simple";
import crypto from "crypto";

const sha256 = (text) => crypto.createHash("sha256").update(text).digest("hex");

/**
 * Register a new user with provided email and password and returns a JWT token.
 */
export const register = async ({ first_name, last_name, email, password }) => {
  await database("users").insert({
    first_name,
    last_name,
    email,
    password: sha256(password),
  });

  return login({ email, password });
};

/**
 * Return a JWT token for user matching the provided email and password.
 */
export const login = async ({ email, password }) => {
  const user = await database("users")
    .select(["id", "email"])
    .where({ email, password: sha256(password) })
    .first();

  const token = jwt.encode(user, process.env.JWT_SECRET);
  return token;
};
