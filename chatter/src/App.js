import React from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes/routes";
import { AuthContextProvider } from "./contexts/Auth/Auth";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  return (
    <AuthContextProvider>
      <ToastContainer position="bottom-center" autoClose={3000} hideProgressBar={false} />
      <RouterProvider router={router} />
    </AuthContextProvider>
  );
}
