function errorHandler(err, req, res,next) {
  console.log(res);
  console.error(err.stack);
  const status = err.statusCode || 500;
  const message = status === 500 ? err.message: "Internal Server Error";
  res.status(status).json({ message });
}

module.exports = errorHandler;
