const { prisma } = require("../prisma/prisma.client");
const { MIN_TYPING_S, MAX_TYPING_S, MIN_NATURAL_PAUSE_S, MAX_NATURAL_PAUSE_S, DEFAULT_BOT_USER, RESPONSES_FILE_PATH, SOCKET_EVENTS } = require("../constants");
const getRandomDelay = require("./getRandomDelay");
const getBotResponse = require("./getBotResponse");
const parseResponseDataset = require("./parseResponseDataset");

let botResponses = null;

// Since this is a small app we keep track of the
// online users on memory
const activeUsers = new Map();

/**
 * =========================================
 *              MAIN SOCKET EVENTS HANDLERS
 * =========================================
 * This section contains the main handlers
 * for socket events.
 */

// Function to control users chat between users or bot
const handleUsersChat = (socket) => {
  socket.on(SOCKET_EVENTS.USER_EVENTS.USER_TYPING, ({ senderId, receiverId }) => {
    emitTypingEvent(socket, SOCKET_EVENTS.USER_EVENTS.USER_TYPING, { senderId, receiverId });
  });

  socket.on(SOCKET_EVENTS.USER_EVENTS.USER_STOP_TYPING, ({ senderId, receiverId }) => {
    emitTypingEvent(socket, SOCKET_EVENTS.USER_EVENTS.USER_STOP_TYPING, { senderId, receiverId });
  });

  socket.on(SOCKET_EVENTS.USER_EVENTS.USER_MESSAGE_EVENT, async ({ senderId, receiverId, message }) => {
    if (receiverId === DEFAULT_BOT_USER.id) {
      await handleBotChat(socket, senderId, message);
    } else {
      await handleUserChat(socket, senderId, receiverId, message);
    }
  });
};

// Function to update users session on connect
const handlerUsersSession = async (socket, id, io) => {
  activeUsers.set(id, socket.id);
  await prisma.user.update({
    where: { id },
    data: { isOnline: true },
  });
  const users = await prisma.user.findMany();
  io.emit(SOCKET_EVENTS.USER_EVENTS.USERS_ONLINE, users);
};

// Function to update users session on disconnect
const handleUsersDisconnect = async (socket) => {
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
 * =========================================
 *             SOCKET EVENTS HELPERS
 * =========================================
 * This section contains the socket helpers
 * functions for the main handlers.
 */

// function to emit typing events between users
const emitTypingEvent = (socket, event, { senderId, receiverId }) => {
  const receiverSocketId = activeUsers.get(receiverId);
  if (receiverSocketId) {
    socket.to(receiverSocketId).emit(event, { senderId });
  }
};

const handleBotChat = async (socket, senderId, message) => {
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
// Function to handle chats between users online or offline
const handleUserChat = async (socket, senderId, receiverId, message) => {
  const receiverSocketId = activeUsers.get(receiverId);

  await prisma.message.create({
    data: {
      senderId,
      receiverId,
      content: message,
    },
  });

  const messages = await prisma.message.findMany({
    where: {
      OR: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  if (receiverSocketId) {
    socket.to(receiverSocketId).emit(SOCKET_EVENTS.USER_EVENTS.USER_MESSAGE_EVENT, messages);
  } else {
    socket.emit(SOCKET_EVENTS.USER_EVENTS.USER_MESSAGE_EVENT, messages);
  }
};

/**
 * =========================================
 *         GLOBAL SOCKET EVENT
 * =========================================
 * This is the main socket event that
 * we have to call in the app section.
 */
const setupSocketEvents = (io) => {
  io.on(SOCKET_EVENTS.GLOBAL_EVENTS.CONNECTION, (socket) => {
    socket.on(SOCKET_EVENTS.USER_EVENTS.USER_ONLINE, (id) => handlerUsersSession(socket, id, io));
    socket.on(SOCKET_EVENTS.USER_EVENTS.DISCONNECT, () => handleUsersDisconnect(socket));
    handleUsersChat(socket);
  });

  parseResponseDataset(RESPONSES_FILE_PATH).then((parsedResponses) => {
    botResponses = parsedResponses;
  });
};

module.exports = setupSocketEvents;
