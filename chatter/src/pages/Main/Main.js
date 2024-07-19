import React from "react";
import UserList from "./components/UserList";
import Messages from "./components/Messages";
import ContactPanel from "./components/ContactPanel";

export const Main = () => {
  return (
    <>
      <UserList />
      <Messages />
      <ContactPanel />
    </>
  );
};
