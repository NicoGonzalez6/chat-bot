import { Navigate } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuth";

/**
 * Simple component to protect private pages
 */
export const Privatepage = ({ children }) => {
  const { isAuthenticated } = useAuthContext();

  if (!isAuthenticated) {
    return <Navigate to={"/sign-in"} />;
  } else {
    return children;
  }
};
