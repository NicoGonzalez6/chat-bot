const express = require("express");
const cors = require("cors");

// Utils
const { getRandomDelay, getBotResponse, parseResponseDataset } = require("./utils");

// Constants
const {
  PORT,
  RESPONSES_FILE_PATH,
  USER_MESSAGE_EVENT,
  BOT_MESSAGE_EVENT,
  BOT_TYPING_EVENT,
  MIN_TYPING_S,
  MAX_TYPING_S,
  MIN_NATURAL_PAUSE_S,
  MAX_NATURAL_PAUSE_S,
  DEFAULT_BOT_USER,
} = require("./constants");

/**
 * Catch async errors
 */
require("express-async-errors");

const errorHandler = require("./middlewares/errorHandler");

// Routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");

const app = express();
const http = require("http").createServer(app);

const io = require("socket.io")(http);

let botResponses = null;
const router = express.Router();

app.use(router);
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.static(__dirname + "/public"));
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);
app.use(errorHandler);

const users = {};

io.on("connection", (socket) => {
  console.log("successfully conected");

  // socket.on(USER_MESSAGE_EVENT, ({ message, userId }) => {
  //   if (userId === DEFAULT_BOT_USER.id) {
  //     setTimeout(() => {
  //       // Don't emit a typing event if we've set typing seconds to 0
  //       if (MAX_TYPING_S) {
  //         socket.emit(BOT_TYPING_EVENT, {});
  //       }
  //       setTimeout(() => {
  //         socket.emit(BOT_MESSAGE_EVENT, getBotResponse(message, botResponses));
  //       }, getRandomDelay(MIN_TYPING_S, MAX_TYPING_S));
  //     }, getRandomDelay(MIN_NATURAL_PAUSE_S, MAX_NATURAL_PAUSE_S));
  //   }
  // });
});

parseResponseDataset(RESPONSES_FILE_PATH).then((parsedResponses) => {
  botResponses = parsedResponses;
});

http.listen(PORT, () => {
  console.log(`Carol server listening on *:${PORT} 🚀`);
});
