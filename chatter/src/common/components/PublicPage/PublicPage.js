import { Navigate } from "react-router-dom";
import { useUserStorageSettings } from "../../../hooks/useUserStorage";

/**
 * Simple component to prevent public pages
 * that the user should´n access once the user is created.
 */
export const PublicPage = ({ children }) => {
  const { userStorageState } = useUserStorageSettings();

  if (userStorageState) {
    return <Navigate to={"/"} />;
  } else {
    return children;
  }
};
