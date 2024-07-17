import React, { useCallback, useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Typing from "./TypingMessage";
import { SOCKET_EVENTS } from "../../../common/constants/socketEvents";
import io from "socket.io-client";
import config from "../../../config";
import "../styles/_messages.scss";

const socket = io(config.BOT_SERVER_ENDPOINT, { transports: ["websocket", "polling", "flashsocket"] });

function Messages() {
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = useCallback(() => {
    socket.emit(SOCKET_EVENTS.USER_EVENTS.USER_MESSAGE_EVENT, { message: "how are you?", userId: "bot" });
  }, []);

  const handleBotTyping = useCallback(() => {
    return socket.on(SOCKET_EVENTS.BOTS_EVENTS.BOT_TYPING_EVENT, () => {
      setIsTyping(true);
    });
  }, []);

  const handleBotResponse = useCallback(() => {
    socket.on(SOCKET_EVENTS.BOTS_EVENTS.BOT_MESSAGE_EVENT, () => {
      setIsTyping(false);
    });
  }, []);

  useEffect(() => {
    handleBotTyping();
    handleBotResponse();
    return () => {
      socket.off(SOCKET_EVENTS.BOTS_EVENTS.BOT_TYPING_EVENT);
      socket.off(SOCKET_EVENTS.BOTS_EVENTS.BOT_MESSAGE_EVENT);
    };
  }, []);

  return (
    <div className="messages">
      <Header />
      <div className="messages__list" id="message-list">
        {isTyping && <Typing />}
      </div>
      <Footer message={"how are you?"} sendMessage={sendMessage} onChangeMessage={() => console.log("test")} />
    </div>
  );
}

export default Messages;
