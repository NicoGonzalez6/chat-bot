import reciveSound from "./assets/sounds/receive.mp3";
import sendSound from "./assets/sounds/send.mp3";

const isProduction = process.env.NODE_ENV === "production";

export default {
  BOT_SERVER_ENDPOINT: isProduction ? "https://carol.alexgurr.com" : "http://localhost:4001",
  SEND_AUDIO: sendSound,
  RECEIVE_AUDIO: reciveSound,
};
