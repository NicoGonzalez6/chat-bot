const { DEFAULT_BOT_USER } = require("../constants");
const { prisma } = require("../prisma/prisma.client");
const { StatusCodes } = require("http-status-codes");

const getAllUsers = async (_, res) => {
  const users = await prisma.user.findMany();
  res.status(StatusCodes.OK).json({ users: users, bot: DEFAULT_BOT_USER });
};

module.exports = { getAllUsers };
