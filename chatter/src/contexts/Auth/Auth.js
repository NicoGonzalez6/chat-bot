import { createContext, useState } from "react";

export const AuthContext = createContext({});

export const AuthContextProvider = ({ children }) => {
  const [authState] = useState({
    isAuthenticated: false,
    userName: undefined,
  });

  return <AuthContext.Provider value={authState}>{children}</AuthContext.Provider>;
};
