const error = (error, req, res) => {
  console.error(error);
  res.status(error.status || 500).send(error.message);
};

export default error;
