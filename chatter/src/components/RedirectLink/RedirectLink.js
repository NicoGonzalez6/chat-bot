import React from "react";
import { Link } from "react-router-dom";
import "./_redirect-link.scss";

export const RedirectLink = ({ to, children, onClick }) => {
  return (
    <Link to={to} className="redirect-link" data-testid="redirect-link" onClick={onClick}>
      {children}
    </Link>
  );
};
