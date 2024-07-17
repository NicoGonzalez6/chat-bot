import { createContext, useEffect, useState } from "react";
import { useUserStorageSettings } from "../../hooks/useUserStorage";

export const CurrentUserContext = createContext({});

export const CurrentUserProvider = ({ children }) => {
  const { userStorageState, setUserStorageState } = useUserStorageSettings();

  /**
   * Check if the current user exists and have active session
   */
  const storedUser = userStorageState ? { name: userStorageState?.name, number: userStorageState?.number } : undefined;

  const [currentUser, setCurrentUser] = useState(storedUser);

  const authenticateUser = (data) => {
    setUserStorageState(data);
    setCurrentUser(data);
  };

  useEffect(() => {
    if (userStorageState) authenticateUser({ name: userStorageState?.name, number: userStorageState?.number });
  }, []);

  return <CurrentUserContext.Provider value={{ currentUser, authenticateUser }}>{children}</CurrentUserContext.Provider>;
};
