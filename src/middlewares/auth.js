import jwt from "jwt-simple";
import ApiError from "../errors/ApiError.js";
import dotenv from "dotenv";
dotenv.config();

const auth = (req, res, next) => {
  //const token = req.headers.authorization?.split(" ")[1];5

  //per baypassare la richiesta del token de parte della rotta
  //const payload = {email: "mail@bella", password: "d1e8a70b5ccab1dc2f56bbf7e99f064a660c08e361a35751b9c483c88943d082",id:1002};
  const payload= {email:"jonathan.doe@example.net",password:"5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8",id:1001}
  // Crea il token con la chiave segreta
  const token = jwt.encode(payload, process.env.JWT_SECRET);
console.log("token")
console.log(token)
  if (!token) throw new ApiError(401, "Unauthorized");

  try {
    req.user = jwt.decode(token, process.env.JWT_SECRET);
    return next();
  } catch(error){
    console.log(error)
    throw new ApiError(403, "Forbidden");
  }
};

export default auth;
