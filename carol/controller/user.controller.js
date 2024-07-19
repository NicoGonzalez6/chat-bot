const { prisma } = require("../prisma/prisma.client");
const { StatusCodes } = require("http-status-codes");
const { BadRequest, NotFound } = require("../errors");

/**
 * We get all users that registered in our app
 */
const getAllUsers = async (req, res) => {
  const { number } = req.query;

  if (!number) throw new BadRequest("Please provide the current user number");

  const currentUser = await prisma.user.findFirst({
    where: {
      number: parseInt(number),
    },
  });

  if (!currentUser) throw new NotFound("Usert not found");

  const users = await prisma.user.findMany({
    where: {
      number: {
        not: parseInt(number),
      },
    },
  });
  res.status(StatusCodes.OK).json({ users });
};

module.exports = { getAllUsers };
