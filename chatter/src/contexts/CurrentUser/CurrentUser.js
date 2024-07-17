import { createContext, useState } from "react";
import { currentUserInitialState } from "./constants/initialState";

const CurrentUserContext = createContext({});

export const CurrentUserProvider = ({ children }) => {
  const [currentUser] = useState(currentUserInitialState);
  return <CurrentUserContext.Provider value={currentUser}>{children}</CurrentUserContext.Provider>;
};
