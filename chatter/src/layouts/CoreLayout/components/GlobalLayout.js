import React from "react";
import IconBackground from "./IconBackground";
import "../styles/_core-layout.scss";
import { Outlet } from "react-router-dom";

export const GlobalLayout = () => {
  return (
    <div className="core">
      <IconBackground />
      <Outlet />
    </div>
  );
};
