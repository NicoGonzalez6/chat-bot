const { StatusCodes } = require("http-status-codes");

/**
 * Error handler middlware
 */
const errorHandler = async (err, req, res, next) => {
  const customErr = {
    message: err.message || "Something went wrong, please try agan later",
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
  };

  res.status(customErr.statusCode).json({ message: customErr.message });
};

module.exports = errorHandler;
