export const { VITE_BASE_API_URL } = import.meta.env;

export const SOCKET_EVENTS = {
  BOTS_EVENTS: {
    BOT_MESSAGE_EVENT: "bot-message",
    BOT_TYPING_EVENT: "bot-typing",
  },
  USER_EVENTS: {
    USER_ONLINE: "user_online",
    USER_MESSAGE_EVENT: "user-message",
  },
};

export const CAROL_DEFAULT_MESSAGE = "Hi! My name's Carol.";

export const TOAST_MESSAGES = {
  REGISTER: {
    WELCOME: "Welcome to chatter",
  },
};

export const ENDPOINTS = {
  SIGN_UP: "/auth/sign-up",
  SIGN_IN: "/auth/sign-in",
};
