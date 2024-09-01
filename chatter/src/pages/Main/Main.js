import React, { useEffect } from "react";
import UserList from "./components/UserList";
import Messages from "./components/Messages";
import ContactPanel from "./components/ContactPanel";
import { socket } from "../../config";
import { SOCKET_EVENTS } from "../../constants";
import { useContactsContext } from "../../hooks/useContacts";
import { useAuthContext } from "../../hooks/useAuth";

/**
 * Here the main contacts logic will be handled to
 * avoid unnecessary renders
 */
export const Main = () => {
  const { storeContacts, contacts, selectActiveContact, activeContact } = useContactsContext();
  const { number, id } = useAuthContext();

  useEffect(() => {
    /**
     * Notify that we are online
     */
    socket.emit(SOCKET_EVENTS.USER_EVENTS.USER_ONLINE, id);

    socket.on(SOCKET_EVENTS.USER_EVENTS.USERS_ONLINE, (response) => {
      const users = response.filter((user) => user.number !== number);
      storeContacts(users);
    });
    return () => {
      socket.off(SOCKET_EVENTS.USER_EVENTS.USER_ONLINE);
      socket.off(SOCKET_EVENTS.USER_EVENTS.USERS_ONLINE);
    };
  }, []);

  useEffect(() => {
    /**
     * If there is no active user,
     * select the first one (CAROL-BOT) as default
     */
    if (contacts.length >= 0 && !activeContact && contacts[0]) {
      selectActiveContact(contacts[0].number);
    }
  }, [contacts]);

  return (
    <>
      <UserList contacts={contacts} activeContact={activeContact} selectActiveContact={selectActiveContact} />
      <Messages activeContact={activeContact} currentUserId={id} />
      <ContactPanel name={activeContact?.name} number={activeContact?.number} />
    </>
  );
};
