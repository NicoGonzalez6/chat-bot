import { Navigate } from "react-router-dom";
import { useCurrentUser } from "../../../hooks/useCurrentUser";

/**
 * Simple component to protect private pages
 */
export const Privatepage = ({ children }) => {
  const { currentUser } = useCurrentUser();

  if (!currentUser) {
    return <Navigate to={"/auth"} />;
  } else {
    return children;
  }
};
