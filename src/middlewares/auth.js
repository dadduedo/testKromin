import jwt from "jwt-simple";

const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.sendStatus(401);

  try {
    req.user = jwt.decode(token, process.env.JWT_SECRET);
    return next();
  } catch {
    return res.sendStatus(403);
  }
};

export default auth;
