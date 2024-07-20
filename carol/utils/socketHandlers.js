const { SOCKET_EVENTS } = require("../constants");
const { prisma } = require("../prisma/prisma.client");
const { BOT_MESSAGE_EVENT, MIN_TYPING_S, MAX_TYPING_S, MIN_NATURAL_PAUSE_S, MAX_NATURAL_PAUSE_S, DEFAULT_BOT_USER, RESPONSES_FILE_PATH } = require("../constants");
const getRandomDelay = require("./getRandomDelay");
const getBotResponse = require("./getBotResponse");
const parseResponseDataset = require("./parseResponseDataset");

let botResponses = null;

/**
 * Simple implementation to track users in memory when go online and offline
 * so we can track the session in real-time
 */
const activeUsers = new Map();

/**
 * Helper function to handle user chats
 */
const handleUserChat = (socket) => {
  socket.on(SOCKET_EVENTS.USER_EVENTS.USER_TYPING, ({ senderId, receiverId }) => {
    emitTypingEvent(socket, SOCKET_EVENTS.USER_EVENTS.USER_TYPING, { senderId, receiverId });
  });

  socket.on(SOCKET_EVENTS.USER_EVENTS.USER_STOP_TYPING, ({ senderId, receiverId }) => {
    emitTypingEvent(socket, SOCKET_EVENTS.USER_EVENTS.USER_STOP_TYPING, { senderId, receiverId });
  });

  socket.on(SOCKET_EVENTS.USER_EVENTS.USER_MESSAGE_EVENT, async ({ senderId, receiverId, message }) => {
    if (receiverId === DEFAULT_BOT_USER.id) {
      await handleBotResponse(socket, senderId, message);
    }
  });
};

/**
 * Helper function when the user logs in
 */
const handleUserOnline = async (socket, id, io) => {
  activeUsers.set(id, socket.id);
  await prisma.user.update({
    where: { id },
    data: { isOnline: true },
  });
  const users = await prisma.user.findMany();
  io.emit(SOCKET_EVENTS.USER_EVENTS.USERS_ONLINE, users);
};

/**
 * Helper function when the user disconnects
 */
const handleDisconnect = async (socket) => {
  for (const [id, socketId] of activeUsers.entries()) {
    if (socketId === socket.id) {
      activeUsers.delete(id);
      await prisma.user.update({
        where: { id },
        data: { isOnline: false },
      });
      const users = await prisma.user.findMany();
      socket.broadcast.emit(SOCKET_EVENTS.USER_EVENTS.USERS_ONLINE, users);
      break;
    }
  }
};

/**
 * App main sockets events
 */
const setupSocketEvents = (io) => {
  io.on(SOCKET_EVENTS.GLOBAL_EVENTS.CONNECTION, (socket) => {
    socket.on(SOCKET_EVENTS.USER_EVENTS.USER_ONLINE, (id) => handleUserOnline(socket, id, io));
    socket.on(SOCKET_EVENTS.USER_EVENTS.DISCONNECT, () => handleDisconnect(socket));
    handleUserChat(socket);
  });

  parseResponseDataset(RESPONSES_FILE_PATH).then((parsedResponses) => {
    botResponses = parsedResponses;
  });
};

// Socket helpers
const emitTypingEvent = (socket, event, { senderId, receiverId }) => {
  for (const [id, socketId] of activeUsers.entries()) {
    if (receiverId === id) {
      socket.to(socketId).emit(event, { senderId });
    }
  }
};

const handleBotResponse = async (socket, senderId, message) => {
  if (activeUsers.has(senderId)) {
    const typingDelay = getRandomDelay(MIN_TYPING_S, MAX_TYPING_S);
    const pauseDelay = getRandomDelay(MIN_NATURAL_PAUSE_S, MAX_NATURAL_PAUSE_S);

    setTimeout(async () => {
      socket.emit(SOCKET_EVENTS.USER_EVENTS.USER_TYPING, { senderId: DEFAULT_BOT_USER.id });

      setTimeout(async () => {
        socket.emit(SOCKET_EVENTS.USER_EVENTS.USER_STOP_TYPING, { senderId: DEFAULT_BOT_USER.id });

        const botMessage = getBotResponse(message, botResponses);

        await prisma.$transaction([
          prisma.message.create({
            data: {
              senderId,
              receiverId: DEFAULT_BOT_USER.id,
              content: message,
            },
          }),
          prisma.message.create({
            data: {
              senderId: DEFAULT_BOT_USER.id,
              receiverId: senderId,
              content: botMessage,
            },
          }),
        ]);

        const messages = await prisma.message.findMany({
          where: {
            OR: [
              { senderId, receiverId: DEFAULT_BOT_USER.id },
              { senderId: DEFAULT_BOT_USER.id, receiverId: senderId },
            ],
          },
          orderBy: {
            createdAt: "asc",
          },
        });

        socket.emit(SOCKET_EVENTS.USER_EVENTS.USER_MESSAGE_EVENT, messages);
      }, typingDelay);
    }, pauseDelay);
  }
};

module.exports = setupSocketEvents;
