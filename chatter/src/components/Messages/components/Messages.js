import React, { useCallback, useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Message from "./Message";
import Typing from "./TypingMessage";
import { SOCKET_EVENTS } from "../../../common/constants/socketEvents";
import io from "socket.io-client";
import config from "../../../config";
import "../styles/_messages.scss";

const socket = io(config.BOT_SERVER_ENDPOINT, { transports: ["websocket", "polling", "flashsocket"] });

function Messages() {
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = useCallback(() => {
    const userMessage = "how are you?";
    socket.emit(SOCKET_EVENTS.USER_MESSAGE_EVENT, userMessage);
  }, []);

  useEffect(() => {
    const handleConnect = () => {
      socket.on(SOCKET_EVENTS.CONNECT, () => {
        console.log("connected");
      });
    };

    const handleBotTyping = () => {
      socket.on(SOCKET_EVENTS.BOTS_EVENTS.BOT_TYPING_EVENT, () => {
        console.log("typing");
        setIsTyping(true);
      });
    };

    const handleBotResponse = () => {
      socket.on(SOCKET_EVENTS.BOTS_EVENTS.BOT_MESSAGE_EVENT, (message) => {
        console.log(message, "bot response");
        setIsTyping(false);
      });
    };

    handleConnect();
    handleBotTyping();
    handleBotResponse();

    return () => {
      socket.off(SOCKET_EVENTS.CONNECT);
      socket.off(SOCKET_EVENTS.BOTS_EVENTS.BOT_TYPING_EVENT);
      socket.off(SOCKET_EVENTS.BOTS_EVENTS.BOT_MESSAGE_EVENT);
    };
  }, []);

  return (
    <div className="messages">
      <Header />
      <div className="messages__list" id="message-list">
        {/* {messages.map((message) => (
          <Message message={message} key={message.id} />
        ))} */}
        {isTyping && <Typing />}
      </div>
      <Footer message={"how are you?"} sendMessage={sendMessage} onChangeMessage={() => console.log("test")} />
    </div>
  );
}

export default Messages;
