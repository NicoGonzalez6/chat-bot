import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Typing from "./TypingMessage";
import "../styles/_messages.scss";
import { AXIOS_INSTANCE, socket } from "../../../../../config";
import { ENDPOINTS, SOCKET_EVENTS } from "../../../../../constants";
import Message from "./Message";
import debounce from "lodash.debounce";

const INITIAL_TYPING_STATE = {
  typingNow: false,
  typingFrom: undefined,
};

function Messages({ activeContact, currentUserId }) {
  const [isTyping, setIsTyping] = useState(INITIAL_TYPING_STATE);

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

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

  const sendTypingEvent = useCallback(
    debounce(() => {
      socket.emit(SOCKET_EVENTS.USER_EVENTS.USER_TYPING, {
        senderId: currentUserId,
        receiverId: activeContact?.id,
      });
    }, 300),
    [currentUserId, activeContact?.id]
  );

  const sendStopTypingEvent = useCallback(
    debounce(() => {
      socket.emit(SOCKET_EVENTS.USER_EVENTS.USER_STOP_TYPING, {
        senderId: currentUserId,
        receiverId: activeContact?.id,
      });
    }, 300),
    [currentUserId, activeContact?.id]
  );

  useEffect(() => {
    const handleUserTyping = ({ senderId }) => {
      if (senderId === activeContact?.id) {
        setIsTyping({
          typingFrom: senderId,
          typingNow: true,
        });
      }
    };

    const handleUserStopTyping = ({ senderId }) => {
      if (senderId === activeContact?.id) {
        setIsTyping({
          typingNow: false,
          typingFrom: undefined,
        });
      }
    };

    const handleNewMessages = (newMessages) => {
      if (Array.isArray(newMessages)) {
        const filteredMessages = newMessages.some(
          (msg) => (msg.receiverId === currentUserId && msg.senderId === activeContact?.id) || (msg.receiverId === activeContact?.id && msg.senderId === currentUserId)
        );
        if (filteredMessages) {
          setMessages(newMessages);
        }
      }
    };

    socket.on(SOCKET_EVENTS.USER_EVENTS.USER_TYPING, handleUserTyping);
    socket.on(SOCKET_EVENTS.USER_EVENTS.USER_STOP_TYPING, handleUserStopTyping);
    socket.on(SOCKET_EVENTS.USER_EVENTS.USER_MESSAGE_EVENT, handleNewMessages);

    return () => {
      socket.off(SOCKET_EVENTS.USER_EVENTS.USER_TYPING, handleUserTyping);
      socket.off(SOCKET_EVENTS.USER_EVENTS.USER_STOP_TYPING, handleUserStopTyping);
      socket.off(SOCKET_EVENTS.USER_EVENTS.USER_MESSAGE_EVENT, handleNewMessages);
    };
  }, [activeContact?.id]);

  useEffect(() => {
    if (message) {
      sendTypingEvent();
    } else {
      sendStopTypingEvent();
    }
    return () => {
      sendTypingEvent.cancel();
      sendStopTypingEvent.cancel();
    };
  }, [message, sendTypingEvent, sendStopTypingEvent]);

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

  const endOfMessagesRef = useRef();

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
        <div ref={endOfMessagesRef} />
      </div>
      <Footer message={message} sendMessage={handleSendMessage} onChangeMessage={handleMessageChange} />
    </div>
  );
}

export default memo(Messages);
