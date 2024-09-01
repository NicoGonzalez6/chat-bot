import { useContext } from "react";
import { ContactsContext } from "../contexts/Contacts/Contacts";

export const useContactsContext = () => {
  return useContext(ContactsContext);
};
