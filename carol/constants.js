const PORT = process.env.PORT || 4001;
const RESPONSES_FILE_PATH = "./response_dataset.csv";
const RESPONSES_INPUT_KEY = "input";
const RESPONSES_OUTPUT_KEY = "output";

const SOCKET_EVENTS = {
  GLOBAL_EVENTS: {
    CONNECTION: "connection",
  },
  USER_EVENTS: {
    DISCONNECT: "disconnect",
    USER_ONLINE: "user-online",
    USERS_ONLINE: "users-online",
    USER_MESSAGE_EVENT: "user-message",
    USER_TYPING: "user-typing",
    USER_STOP_TYPING: "user-stop-typing",
  },
};

// Bot Natural Defaults
const DEFAULT_RESPONSE = "Sorry, I didn't quite understand that.";
const RESPONSE_MATCH_THRESHOLD = 0.4;
const MIN_TYPING_S = 1;
const MAX_TYPING_S = 3;
const MIN_NATURAL_PAUSE_S = 0.5;
const MAX_NATURAL_PAUSE_S = 2;

// Default bot users
const DEFAULT_BOT_USER = {
  name: "carol",
  id: 1,
  number: 1,
};

// Global Messages
const GLOBAL_MESSAGES = {
  ERROR_MESSAGES: {
    MISSING_FIELDS: "Please provide the requested values",
    EXISTING_FIELDS: "Ups the value already exists in our records.",
    INVALID_FIELD: "Invalid field type",
    RESERVED_VALUE: "Please select a different number",
  },
};

// Auth Messages
const AUTH_MESSAGES = {
  SUCCESS_MESSAGES: {
    SIGNUP: "Welcome to chatter",
  },
  ERROR_MESSAGES: {
    USER_NOT_FOUND: "User Not Found",
  },
};

module.exports = {
  SOCKET_EVENTS,
  DEFAULT_BOT_USER,
  PORT,
  AUTH_MESSAGES,
  GLOBAL_MESSAGES,
  RESPONSES_FILE_PATH,
  RESPONSES_INPUT_KEY,
  RESPONSES_OUTPUT_KEY,
  DEFAULT_RESPONSE,
  RESPONSE_MATCH_THRESHOLD,
  MIN_TYPING_S,
  MAX_TYPING_S,
  MIN_NATURAL_PAUSE_S,
  MAX_NATURAL_PAUSE_S,
};
