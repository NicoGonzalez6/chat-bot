import React from "react";
import { LastMessageProvider } from "../../contexts/LatestMessages/LatestMessages";
import UserList from "../../components/UserList";
import Messages from "../../components/Messages";
import ContactPanel from "../../components/ContactPanel";

export const Main = () => {
  return (
    <LastMessageProvider>
      <UserList />
      <Messages />
      <ContactPanel />
    </LastMessageProvider>
  );
};
