import { createContext, useEffect, useState } from "react";
import { AXIOS_INSTANCE } from "../../config";
import { ENDPOINTS } from "../../constants";
import { useAuthContext } from "../../hooks/useAuth";
import { CONTACTS_INITIAL_VALUES } from "./constants";

export const ContactsContext = createContext({});

export const ContactsContextProvider = ({ children }) => {
  const { number, isAuthenticated } = useAuthContext();

  const [contacts, setContacts] = useState(CONTACTS_INITIAL_VALUES);

  if (import.meta.env.MODE === "development") {
    console.log("ContactsContext: ", { ...contacts });
  }

  const getAllContacts = async () => {
    const response = await AXIOS_INSTANCE.get(`${ENDPOINTS.GET_CONTACTS}`, {
      params: {
        number,
      },
    });

    setContacts({
      ...contacts,
      contacts: response?.users,
      selectedContactId: response?.users[0]?.number,
    });
  };

  useEffect(() => {
    if (isAuthenticated) {
      getAllContacts();
    }
  }, [isAuthenticated]);

  return <ContactsContext.Provider value={{ ...contacts }}>{children}</ContactsContext.Provider>;
};
