const error = (error, req, res, next) => {
  console.error(error);
  res.status(error.status.toString() || "500").json({ message: error.message });
};

export default error;
