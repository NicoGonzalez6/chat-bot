import React, { useCallback, useEffect, useRef, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Typing from "./TypingMessage";
import "../styles/_messages.scss";
import { AXIOS_INSTANCE, socket } from "../../../../../config";
import { ENDPOINTS, SOCKET_EVENTS } from "../../../../../constants";
import Message from "./Message";

function Messages({ activeContact, currentUserId }) {
  const [isTyping, setIsTyping] = useState({
    typingNow: false,
    typingFrom: undefined,
  });

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [previousContactId, setPreviousContactId] = useState(null);
  const prevMessageRef = useRef(message);

  const handleSendMessage = useCallback(() => {
    const temporaryMessage = {
      content: message,
      senderId: currentUserId,
      receiverId: activeContact?.id,
    };
    setMessages([...messages, temporaryMessage]);
    socket.emit(SOCKET_EVENTS.USER_EVENTS.USER_MESSAGE_EVENT, {
      message,
      senderId: currentUserId,
      receiverId: activeContact?.id,
    });
    setMessage("");
  }, [message, currentUserId, activeContact]);

  const handleMessageChange = (evt) => {
    setMessage(evt.target.value);
  };

  useEffect(() => {
    const handleUserTyping = ({ senderId }) => {
      setIsTyping({
        typingFrom: senderId,
        typingNow: true,
      });
    };

    const handleUserStopTyping = () => {
      setIsTyping({
        typingNow: false,
        typingFrom: undefined,
      });
    };

    socket.on(SOCKET_EVENTS.USER_EVENTS.USER_TYPING, handleUserTyping);
    socket.on(SOCKET_EVENTS.USER_EVENTS.USER_STOP_TYPING, handleUserStopTyping);
    socket.on(SOCKET_EVENTS.USER_EVENTS.USER_MESSAGE_EVENT, (response) => {
      setMessages(response);
    });

    return () => {
      socket.off(SOCKET_EVENTS.USER_EVENTS.USER_TYPING, handleUserTyping);
      socket.off(SOCKET_EVENTS.USER_EVENTS.USER_STOP_TYPING, handleUserStopTyping);
    };
  }, []);

  useEffect(() => {
    if (activeContact?.id !== previousContactId) {
      if (previousContactId) {
        socket.emit(SOCKET_EVENTS.USER_EVENTS.USER_STOP_TYPING, {
          senderId: currentUserId,
          receiverId: previousContactId,
        });
      }
      setPreviousContactId(activeContact?.id);
    }
  }, [activeContact, previousContactId, currentUserId]);

  useEffect(() => {
    const prevMessage = prevMessageRef.current;

    if (message) {
      socket.emit(SOCKET_EVENTS.USER_EVENTS.USER_TYPING, {
        senderId: currentUserId,
        receiverId: activeContact?.id,
      });
    } else if (prevMessage && !message) {
      socket.emit(SOCKET_EVENTS.USER_EVENTS.USER_STOP_TYPING, {
        senderId: currentUserId,
        receiverId: activeContact?.id,
      });
    }

    prevMessageRef.current = message;
  }, [message, currentUserId, activeContact]);

  useEffect(() => {
    const getMessages = async () => {
      const response = await AXIOS_INSTANCE.get(ENDPOINTS.GET_MESSAGES, {
        params: {
          senderId: currentUserId,
          receiverId: activeContact?.id,
        },
      });
      setMessages(response);
    };

    if (currentUserId && activeContact) {
      getMessages();
    }
  }, [activeContact]);

  return (
    <div className="messages">
      <Header isOnline={activeContact?.isOnline} name={activeContact?.name} />
      <div className="messages__list" id="message-list">
        {messages?.map((message, i) => {
          const currentMessage = {
            message: message.content,
            user: message.senderId == currentUserId && "me",
          };
          return <Message message={currentMessage} key={i} />;
        })}
        {isTyping.typingNow && isTyping.typingFrom === activeContact?.id && <Typing />}
      </div>
      <Footer message={message} sendMessage={handleSendMessage} onChangeMessage={handleMessageChange} />
    </div>
  );
}

export default Messages;
