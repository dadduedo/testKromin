import database from "../database.js";
import jwt from "jwt-simple";
import crypto from "crypto";
import ApiError from "../errors/ApiError.js";

const sha256 = (text) => crypto.createHash("sha256").update(text).digest("hex");

/**
 * Register a new user with provided email and password and returns a JWT token.
 */
export const register = async ({ first_name, last_name, email, password }) => {
  if (![email, password].every((value) => value)) {
    throw new ApiError(
      400,
      "Values should include: first_name, last_name, email, password"
    );
  }
  //TODO Validation on object structure
  await database("users").insert({
    first_name,
    last_name,
    email,
    password: sha256(password),
  });

  return await login({ email, password });
};

/**
 * Return a JWT token for user matching the provided email and password.
 */
export const login = async ({ email, password }) => {
  if (![email, password].every((value) => value)) {
    return {
      message: "Values should include: email, password",
    };
  }
  const user = await database("users")
    .select(["id", "email"])
    .where({ email, password: sha256(password) })
    .first();
  if (!user) {
    throw new ApiError(401, "Invalid credentials");
  }

  const token = jwt.encode(user, process.env.JWT_SECRET);
  return { access_token: token };
};
