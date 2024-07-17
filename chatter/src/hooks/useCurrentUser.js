import { useContext } from "react";
import { CurrentUserContext } from "../contexts/CurrentUser/CurrentUser";

export const useCurrentUser = () => useContext(CurrentUserContext);
