import React, { useContext } from "react";
import io from "socket.io-client";
import useSound from "use-sound";
import config from "../../../config";
import LatestMessagesContext from "../../../contexts/LatestMessages/LatestMessages";
import TypingMessage from "./TypingMessage";
import Header from "./Header";
import Footer from "./Footer";
import Message from "./Message";
import "../styles/_messages.scss";

const URL = process.env.NODE_ENV === "production" ? config.BOT_SERVER_ENDPOINT : "http://localhost:4001";

const socket = io(URL, { transports: ["websocket", "polling", "flashsocket"] });

function Messages() {
  const [playSend] = useSound(config.SEND_AUDIO_URL);
  const [playReceive] = useSound(config.RECEIVE_AUDIO_URL);
  const { setLatestMessage } = useContext(LatestMessagesContext);

  return (
    <div className="messages">
      <Header />
      <div className="messages__list" id="message-list"></div>
      <Footer message={"test"} sendMessage={() => console.log("send")} onChangeMessage={() => console.log("test")} />
    </div>
  );
}

export default Messages;
