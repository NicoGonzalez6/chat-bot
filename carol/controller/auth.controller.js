const { GLOBAL_MESSAGES, AUTH_MESSAGES, DEFAULT_BOT_USER, CAROL_DEFAULT_MESSAGE } = require("../constants");
const { BadRequest, NotFound } = require("../errors");
const { prisma, Prisma } = require("../prisma/prisma.client");
const { StatusCodes } = require("http-status-codes");

/**
 * User Signup with some basic validations and error handling
 */
const signUp = async (req, res) => {
  const { name, number } = req.body;
  if (!name || !number) throw new BadRequest(GLOBAL_MESSAGES.ERROR_MESSAGES.MISSING_FIELDS);

  const normalizedName = name.toLowerCase();

  try {
    const user = await prisma.user.create({
      data: {
        name: normalizedName,
        number,
      },
    });

    await prisma.message.create({
      data: {
        content: CAROL_DEFAULT_MESSAGE,
        senderId: DEFAULT_BOT_USER.id,
        receiverId: user.id,
        createdAt: new Date(),
      },
    });

    res.status(StatusCodes.CREATED).json({
      message: AUTH_MESSAGES.SUCCESS_MESSAGES.SIGNUP,
      user: user,
    });
  } catch (e) {
    /**
     * Try catch needed beacuse we need to catch specific
     * prisma errors for some validations
     */
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        throw new BadRequest(GLOBAL_MESSAGES.ERROR_MESSAGES.EXISTING_FIELDS);
      }
    }
    if (e instanceof Prisma.PrismaClientValidationError) {
      throw new BadRequest(GLOBAL_MESSAGES.ERROR_MESSAGES.INVALID_FIELD);
    }
  }
};

/**
 * Simple login  with some basic validations and error handling
 */
const signIn = async (req, res) => {
  const { number } = req.body;

  if (!number) throw new BadRequest(GLOBAL_MESSAGES.ERROR_MESSAGES.MISSING_FIELDS);

  if (number === DEFAULT_BOT_USER.number) throw new BadRequest(GLOBAL_MESSAGES.ERROR_MESSAGES.RESERVED_VALUE);

  const user = await prisma.user.findUnique({
    where: {
      number,
    },
  });

  if (!user) throw new NotFound(AUTH_MESSAGES.ERROR_MESSAGES.USER_NOT_FOUND);

  res.status(StatusCodes.OK).json({
    user: user,
  });
};

module.exports = { signUp, signIn };
