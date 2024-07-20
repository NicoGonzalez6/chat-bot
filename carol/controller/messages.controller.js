const { prisma } = require("../prisma/prisma.client");
const { StatusCodes } = require("http-status-codes");
const { BadRequest } = require("../errors");

/**
 * We get all messages
 */
const getAllMessages = async (req, res) => {
  const { senderId, receiverId } = req.query;

  if (!senderId || !receiverId) throw new BadRequest(GLOBAL_MESSAGES.ERROR_MESSAGES.MISSING_FIELDS);

  const sendId = parseInt(senderId);
  const recId = parseInt(receiverId);

  const messages = await prisma.message.findMany({
    where: {
      OR: [
        { senderId: sendId, receiverId: recId },
        { senderId: recId, receiverId: sendId },
      ],
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  res.status(StatusCodes.OK).json(messages);
};

module.exports = { getAllMessages };
