import React from "react";
import { Link } from "react-router-dom";
import "./_redirect-link.scss";

export const RedirectLink = ({ to, children }) => {
  return (
    <Link to={to} className="redirect-link">
      {children}
    </Link>
  );
};
