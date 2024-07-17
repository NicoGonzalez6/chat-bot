import React from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes/routes";
import { CurrentUserProvider } from "./contexts/CurrentUser/CurrentUser";

export default function App() {
  return (
    <CurrentUserProvider>
      <RouterProvider router={router} />
    </CurrentUserProvider>
  );
}
