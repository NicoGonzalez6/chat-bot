import { createContext, useState } from "react";

import { CONTACTS_INITIAL_VALUES } from "./constants";

export const ContactsContext = createContext({});

export const ContactsContextProvider = ({ children }) => {
  const [contacts, setContacts] = useState(CONTACTS_INITIAL_VALUES);

  if (import.meta.env.MODE === "development") {
    console.log("ContactsContext: ", { ...contacts });
  }

  const storeContacts = (data) => {
    setContacts({ ...contacts, contacts: data });
  };

  const selectActiveContact = (number) => {
    const selectedContact = contacts?.contacts.find((contact) => contact.number === number);
    setContacts({ ...contacts, activeContact: selectedContact });
  };

  return <ContactsContext.Provider value={{ ...contacts, storeContacts, selectActiveContact }}>{children}</ContactsContext.Provider>;
};
