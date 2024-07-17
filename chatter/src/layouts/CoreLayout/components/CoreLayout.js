import React from "react";
import { LastMessageProvider } from "../../../contexts/LatestMessages/LatestMessages";
import ContactPanel from "../../../components/ContactPanel";
import UserList from "../../../components/UserList";
import Messages from "../../../components/Messages";
import IconBackground from "./IconBackground";
import "../styles/_core-layout.scss";

export default function CoreLayout() {
  return (
    <div className="core">
      <IconBackground />
      <LastMessageProvider>
        <UserList />
        <Messages />
        <ContactPanel />
      </LastMessageProvider>
    </div>
  );
}
