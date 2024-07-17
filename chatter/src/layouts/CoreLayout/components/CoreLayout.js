import React from "react";
import { LastMessageProvider } from "../../../contexts/LatestMessages/LatestMessages";
import ContactPanel from "../../../components/ContactPanel";
import UserList from "../../../components/UserList";
import Messages from "../../../components/Messages";
import IconBackground from "./IconBackground";
import "../styles/_core-layout.scss";
import { CurrentUserProvider } from "../../../contexts/CurrentUser/CurrentUser";

export default function CoreLayout() {
  return (
    <div className="core">
      <CurrentUserProvider>
        <IconBackground />
        <LastMessageProvider>
          <UserList />
          <Messages />
          <ContactPanel />
        </LastMessageProvider>
      </CurrentUserProvider>
    </div>
  );
}
