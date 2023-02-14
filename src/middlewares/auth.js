import jwt from "jwt-simple";
import ApiError from "../errors/ApiError.js";

const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) throw new ApiError(401, "Unauthorized");

  try {
    req.user = jwt.decode(token, process.env.JWT_SECRET);
    return next();
  } catch {
    throw new ApiError(403, "Forbidden");
  }
};

export default auth;
