import { createContext, useEffect, useState } from "react";
import { useUserStorageSettings } from "../../hooks/useUserStorageSettings";
import { INITIAL_AUTH_STATE } from "./constants";

export const AuthContext = createContext({});

export const AuthContextProvider = ({ children }) => {
  const { setUserStorageState, userStorageState } = useUserStorageSettings();

  const [authState, setAuthState] = useState(INITIAL_AUTH_STATE);

  if (import.meta.env.MODE === "development") {
    console.log("AuthContextState: ", { ...authState });
  }

  const authenticateUser = (data) => {
    if (!userStorageState?.user) {
      setUserStorageState(data);
    }
    setAuthState({
      isAuthenticated: true,
      number: data.user.number,
      name: data.user.name,
      id: data.user.id,
      isLoading: false,
    });
  };

  useEffect(() => {
    if (userStorageState?.user) {
      authenticateUser(userStorageState);
    }
  }, []);

  return <AuthContext.Provider value={{ ...authState, authenticateUser }}>{children}</AuthContext.Provider>;
};
