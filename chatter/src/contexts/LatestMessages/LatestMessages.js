import React, { useState, createContext, useCallback } from "react";

const LatestMessagesContext = createContext({});

export default LatestMessagesContext;

export function LastMessageProvider({ children }) {
  const [messages, setMessages] = useState([]);

  const setLatestMessage = useCallback(
    (userId, value) => {
      setMessages({ ...messages, [userId]: value });
    },
    [messages]
  );

  return <LatestMessagesContext.Provider value={{ messages, setLatestMessage }}>{children}</LatestMessagesContext.Provider>;
}
