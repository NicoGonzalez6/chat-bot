const { SOCKET_EVENTS } = require("../constants");
const { prisma } = require("../prisma/prisma.client");
const { MIN_TYPING_S, MAX_TYPING_S, MIN_NATURAL_PAUSE_S, MAX_NATURAL_PAUSE_S, DEFAULT_BOT_USER, RESPONSES_FILE_PATH } = require("../constants");
const getRandomDelay = require("./getRandomDelay");
const getBotResponse = require("./getBotResponse");
const parseResponseDataset = require("./parseResponseDataset");

let botResponses = null;
const activeUsers = new Map();

const handleUserChat = (socket) => {
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
      await handleUsersChat(socket, senderId, receiverId, message);
    }
  });
};

const handleUserOnline = async (socket, id, io) => {
  activeUsers.set(id, socket.id);
  await prisma.user.update({
    where: { id },
    data: { isOnline: true },
  });
  const usersWithLastMessage = await getLastMessagesForUsers(id);

  console.log(usersWithLastMessage);

  io.emit(SOCKET_EVENTS.USER_EVENTS.USERS_ONLINE, usersWithLastMessage);
};

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

const handleUsersChat = async (socket, senderId, receiverId, message) => {
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

const getLastMessagesForUsers = async (id) => {
  const users = await prisma.user.findMany({
    where: {
      id: {
        not: id,
      },
    },
    include: {
      sentMessages: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
      receivedMessages: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });

  const usersWithLastMessage = users.map((user) => {
    const lastSentMessage = user.sentMessages[0];
    const lastReceivedMessage = user.receivedMessages[0];

    let lastMessage = null;
    if (lastSentMessage && lastReceivedMessage) {
      lastMessage = lastSentMessage.createdAt > lastReceivedMessage.createdAt ? lastSentMessage : lastReceivedMessage;
    } else if (lastSentMessage) {
      lastMessage = lastSentMessage;
    } else if (lastReceivedMessage) {
      lastMessage = lastReceivedMessage;
    }

    return {
      id: user.id,
      number: user.number,
      name: user.name,
      isOnline: user.isOnline,
      lastMessage,
    };
  });

  return usersWithLastMessage;
};

module.exports = setupSocketEvents;
