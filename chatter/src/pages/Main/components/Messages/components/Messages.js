import React, { useCallback, useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Typing from "./TypingMessage";
import { SOCKET_EVENTS } from "../../../../../constants";
import { socket } from "../../../../../config";
import { useAuthContext } from "../../../../../hooks/useAuth";
import "../styles/_messages.scss";

function Messages() {
  const { isAuthenticated, number } = useAuthContext();
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      console.log(number, isAuthenticated);
      socket.emit(SOCKET_EVENTS.USER_EVENTS.REGISTER_USER, number);
    }
  }, [isAuthenticated]);

  const sendMessage = useCallback(() => {
    if (socket) {
      socket.emit(SOCKET_EVENTS.USER_EVENTS.USER_MESSAGE_EVENT, { message: "how are you?", userId: "bot" });
    }
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
