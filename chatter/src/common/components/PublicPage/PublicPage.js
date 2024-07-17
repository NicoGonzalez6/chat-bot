import { Navigate } from "react-router-dom";
import { useAuthContext } from "../../../hooks/useAuth";

/**
 * Simple component to prevent public pages
 * that the user should´n access once the user is created.
 */
export const PublicPage = ({ children }) => {
  const { isAuthenticated } = useAuthContext();

  if (isAuthenticated) {
    return <Navigate to={"/"} />;
  } else {
    return children;
  }
};
