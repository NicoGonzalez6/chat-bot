const User = require("../models/User");

/**
 * Register
 */
const register = async (req, res) => {
  const { name, number } = req.body;
  const newUser = new User(name, number);
  res.status(200).json({ ...newUser });
};

module.exports = { register };
